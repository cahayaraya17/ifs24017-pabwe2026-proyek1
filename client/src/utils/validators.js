const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_NAME_LENGTH = 2;
const MIN_PASSWORD_LENGTH = 8;
const MIN_TITLE_LENGTH = 3;

/** Memvalidasi form login/registrasi. Mengembalikan pesan error, atau `null` bila valid. */
export function validateAuthForm({ name, email, password }, isRegister) {
  if (isRegister && name.trim().length < MIN_NAME_LENGTH) return 'Nama minimal 2 karakter.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Format email tidak valid.';
  if (password.length < MIN_PASSWORD_LENGTH) return 'Password minimal 8 karakter.';
  return null;
}

/** Memvalidasi form acara. Mengembalikan pesan error, atau `null` bila valid. */
export function validateEventForm(form) {
  if (!form.start_at || !form.end_at) return 'Tanggal mulai dan selesai wajib diisi.';
  if (new Date(form.end_at) <= new Date(form.start_at)) {
    return 'Tanggal selesai harus setelah tanggal mulai.';
  }
  if (form.title.trim().length < MIN_TITLE_LENGTH) return 'Judul acara minimal 3 karakter.';
  if (!form.location.trim()) return 'Lokasi wajib diisi.';
  if (!Number.isInteger(Number(form.capacity)) || Number(form.capacity) < 1) {
    return 'Kuota harus berupa bilangan bulat minimal 1.';
  }
  return null;
}
