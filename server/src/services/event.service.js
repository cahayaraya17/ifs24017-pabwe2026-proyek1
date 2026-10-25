import { ROLES } from '../constants/roles.js';
import { EVENT_STATUS } from '../constants/statuses.js';
import { categoryRepository } from '../repositories/category.repository.js';
import { eventRepository } from '../repositories/event.repository.js';
import { registrationRepository } from '../repositories/registration.repository.js';
import { canListDrafts, canManageEvent } from '../policies/event.policy.js';
import { HttpError } from '../utils/httpError.js';
import { parsePagination, parsePositiveInt, parseSearchText } from '../utils/parsers.js';
import { parseEventInput } from '../validators/event.validator.js';

const EVENT_NOT_FOUND = 'Acara tidak ditemukan.';
const INVALID_EVENT_ID = 'ID acara tidak valid.';

function requireEventId(value) {
  const id = parsePositiveInt(value);
  if (!id) throw HttpError.badRequest(INVALID_EVENT_ID);
  return id;
}

function requireExistingEvent(id) {
  const event = eventRepository.findById(id);
  if (!event) throw HttpError.notFound(EVENT_NOT_FOUND);
  return event;
}

function requireValidCategory(categoryId) {
  if (!categoryRepository.exists(categoryId)) {
    throw HttpError.badRequest('Kategori tidak valid. Pilih kategori yang tersedia.');
  }
}

function buildListFilters(query, user) {
  const includeDrafts = canListDrafts(user) && query.includeDrafts === 'true';
  const category = String(query.category || '').trim();
  const isCategoryId = /^\d+$/.test(category);

  return {
    publishedOnly: !includeDrafts,
    organizerId: includeDrafts && user.role === ROLES.ORGANIZER ? user.id : null,
    text: parseSearchText(query.q),
    categoryId: isCategoryId ? Number(category) : null,
    categoryName: category && !isCategoryId ? category : null,
  };
}

export const eventService = {
  list(query = {}, user = null) {
    const { page, limit, offset } = parsePagination(query);
    const { events, total } = eventRepository.search(buildListFilters(query, user), {
      limit,
      offset,
    });

    return { events, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  },

  get(idParam, user = null) {
    const event = eventRepository.findDetailedById(requireEventId(idParam));
    if (!event) throw HttpError.notFound(EVENT_NOT_FOUND);

    const isPublished = event.status === EVENT_STATUS.PUBLISHED;
    if (!isPublished && !canManageEvent(user, event)) throw HttpError.notFound(EVENT_NOT_FOUND);
    return event;
  },

  create(body, user) {
    const values = parseEventInput(body);
    requireValidCategory(values.category_id);

    const id = eventRepository.create({ ...values, organizer_id: user.id });
    return eventRepository.findDetailedById(id);
  },

  update(idParam, body, user) {
    const id = requireEventId(idParam);
    const existing = requireExistingEvent(id);

    if (!canManageEvent(user, existing)) {
      throw HttpError.forbidden('Kamu hanya dapat mengubah acara milikmu.');
    }

    const values = parseEventInput({ ...existing, ...body });
    requireValidCategory(values.category_id);

    if (values.capacity < registrationRepository.countActiveByEvent(id)) {
      throw HttpError.badRequest('Kuota tidak boleh lebih kecil dari jumlah peserta terdaftar.');
    }

    eventRepository.update(id, values);
    return eventRepository.findDetailedById(id);
  },

  /** Mengembalikan `{ archived: true }` bila acara hanya diarsipkan karena masih punya peserta aktif. */
  remove(idParam, user) {
    const id = requireEventId(idParam);
    const existing = requireExistingEvent(id);

    if (!canManageEvent(user, existing)) {
      throw HttpError.forbidden('Kamu hanya dapat menghapus acara milikmu.');
    }

    if (registrationRepository.countActiveByEvent(id) > 0) {
      eventRepository.markCancelled(id);
      return { archived: true };
    }

    eventRepository.delete(id);
    return { archived: false };
  },
};
