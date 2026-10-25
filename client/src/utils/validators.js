const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthForm({ name, email, password }, isRegister) {
  if (isRegister && name.trim().length < 2) return 'Nama minimal 2 karakter.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Format email tidak valid.';
  if (password.length < 8) return 'Password minimal 8 karakter.';
  return null;
}

export function validateEventForm(form) {
  if (!form.start_at || !form.end_at) return 'Tanggal mulai dan selesai wajib diisi.';
  if (new Date(form.end_at) <= new Date(form.start_at)) {
    return 'Tanggal selesai harus setelah tanggal mulai.';
  }
  if (form.title.trim().length < 3) return 'Judul acara minimal 3 karakter.';
  if (!form.location.trim()) return 'Lokasi wajib diisi.';
  if (!Number.isInteger(Number(form.capacity)) || Number(form.capacity) < 1) {
    return 'Kuota harus berupa bilangan bulat minimal 1.';
  }
  return null;
}

export function buildEventPayload(form) {
  return {
    ...form,
    title: form.title.trim(),
    location: form.location.trim(),
    capacity: Number(form.capacity),
    category_id: Number(form.category_id),
    start_at: new Date(form.start_at).toISOString(),
    end_at: new Date(form.end_at).toISOString(),
  };
}
