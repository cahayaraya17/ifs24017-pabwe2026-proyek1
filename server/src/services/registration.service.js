import { ROLES } from '../constants/roles.js';
import { withTransaction } from '../config/database.js';
import { REGISTRATION_STATUS } from '../constants/statuses.js';
import { eventRepository } from '../repositories/event.repository.js';
import { registrationRepository } from '../repositories/registration.repository.js';
import { canManageEvent } from '../policies/event.policy.js';
import { HttpError } from '../utils/httpError.js';
import { parsePositiveInt } from '../utils/parsers.js';

export const registrationService = {
  /** Pendaftaran dijalankan dalam transaksi agar pengecekan kuota dan penyimpanan konsisten. */
  registerForEvent(eventIdParam, user) {
    const eventId = parsePositiveInt(eventIdParam);

    withTransaction(() => {
      const event = eventId && eventRepository.findPublishedById(eventId);
      if (!event) throw HttpError.notFound('Acara tidak ditemukan atau belum diterbitkan.');

      const previous = registrationRepository.findByEventAndUser(eventId, user.id);
      if (previous?.status === REGISTRATION_STATUS.REGISTERED) {
        throw HttpError.conflict('Kamu sudah terdaftar pada acara ini.');
      }
      if (registrationRepository.countActiveByEvent(eventId) >= event.capacity) {
        throw HttpError.conflict('Maaf, kuota acara sudah penuh.');
      }

      if (previous) registrationRepository.reactivate(previous.id);
      else registrationRepository.create(eventId, user.id);
    });

    return { message: 'Pendaftaran acara berhasil.' };
  },

  listForUser(userId) {
    return registrationRepository.listByUser(userId);
  },

  cancel(registrationIdParam, user) {
    const registration = registrationRepository.findById(parsePositiveInt(registrationIdParam));
    if (!registration) throw HttpError.notFound('Pendaftaran tidak ditemukan.');

    const isOwner = registration.user_id === user.id;
    if (!isOwner && user.role !== ROLES.ADMIN) {
      throw HttpError.forbidden('Kamu tidak dapat membatalkan pendaftaran pengguna lain.');
    }
    if (registration.status === REGISTRATION_STATUS.CANCELLED) {
      return { message: 'Pendaftaran sudah dibatalkan.' };
    }

    registrationRepository.cancel(registration.id);
    return { message: 'Pendaftaran berhasil dibatalkan.' };
  },

  listForEvent(eventIdParam, user) {
    const event = eventRepository.findById(parsePositiveInt(eventIdParam));
    if (!event) throw HttpError.notFound('Acara tidak ditemukan.');
    if (!canManageEvent(user, event)) {
      throw HttpError.forbidden('Kamu tidak dapat melihat peserta acara ini.');
    }
    return registrationRepository.listByEvent(event.id);
  },
};
