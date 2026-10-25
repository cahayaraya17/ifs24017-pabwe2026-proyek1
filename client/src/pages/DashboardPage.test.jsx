import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import DashboardPage from './DashboardPage';
import { api } from '../services/api';

vi.mock('../services/api', () => ({
  api: vi.fn(),
}));

const eventData = {
  id: 7,
  title: 'Workshop React',
  description: 'Belajar React bersama',
  location: 'Aula Kampus',
  start_at: '2027-05-10T09:00:00.000Z',
  end_at: '2027-05-10T12:00:00.000Z',
  capacity: 30,
  registered_count: 12,
  category_id: 1,
  category_name: 'Teknologi',
  status: 'published',
};

const statsData = {
  event_count: 5,
  registration_count: 42,
  published_count: 3,
};

const categoriesData = [
  { id: 1, name: 'Teknologi' },
  { id: 2, name: 'Seminar' },
];

function configureApi() {
  api.mockImplementation(async (path, options = {}) => {
    if (path === '/dashboard/stats') {
      return { stats: statsData };
    }

    if (path === '/events?includeDrafts=true&limit=100') {
      return { events: [eventData] };
    }

    if (path === '/categories') {
      return { categories: categoriesData };
    }

    if (path === '/events' && options.method === 'POST') {
      return { event: eventData };
    }

    if (path === '/events/7' && options.method === 'PATCH') {
      return { event: eventData };
    }

    if (path === '/events/7' && options.method === 'DELETE') {
      return { message: 'Berhasil' };
    }

    throw new Error(`API tidak dikenal: ${path}`);
  });
}

function renderPage(user = { name: 'Budi' }) {
  return render(<DashboardPage user={user} />);
}

async function openCreate(user) {
  await user.click(screen.getByRole('button', { name: /Create event/i }));

  expect(screen.getByRole('heading', { name: 'Create an event' })).toBeInTheDocument();
}

async function fillForm(user) {
  await user.type(screen.getByLabelText('Judul acara'), 'Acara Baru');
  await user.type(screen.getByLabelText('Deskripsi'), 'Deskripsi acara');
  await user.type(screen.getByLabelText('Lokasi'), 'Aula Baru');

  await user.clear(screen.getByLabelText('Kuota'));
  await user.type(screen.getByLabelText('Kuota'), '40');

  await user.clear(screen.getByLabelText('Mulai'));
  await user.type(screen.getByLabelText('Mulai'), '2027-05-10T09:00');

  await user.clear(screen.getByLabelText('Selesai'));
  await user.type(screen.getByLabelText('Selesai'), '2027-05-10T12:00');
}

function submitForm() {
  fireEvent.submit(
    screen
      .getByRole('button', {
        name: /Save event|Saving/i,
      })
      .closest('form'),
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal(
      'confirm',
      vi.fn(() => true),
    );
    configureApi();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it('menampilkan statistik dan daftar acara', async () => {
    renderPage();

    expect(screen.getByText(/Selamat datang, Budi/)).toBeInTheDocument();
    expect(await screen.findByText('Workshop React')).toBeInTheDocument();

    expect(screen.getByText('Total events')).toBeInTheDocument();
    expect(screen.getByText('Registrations')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('menampilkan daftar acara kosong', async () => {
    api.mockImplementation(async (path) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [] };
      }
      if (path === '/categories') return { categories: categoriesData };
      throw new Error('API tidak dikenal');
    });

    renderPage();

    expect(await screen.findByText('Belum ada acara. Buat acara pertamamu!')).toBeInTheDocument();

    expect(screen.getByText('0 items')).toBeInTheDocument();
  });

  it('menampilkan error jika pemuatan data gagal', async () => {
    api.mockRejectedValue(new Error('Gagal memuat data'));

    renderPage();

    expect(await screen.findByText('Gagal memuat data')).toBeInTheDocument();
  });

  it('menampilkan fallback ketika data statistik tidak tersedia', async () => {
    api.mockImplementation(async (path) => {
      if (path === '/dashboard/stats') {
        return {
          stats: {
            event_count: null,
            registration_count: undefined,
            published_count: null,
          },
        };
      }

      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [] };
      }

      if (path === '/categories') return { categories: [] };

      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await screen.findByText('Total events');

    expect(screen.getAllByText('—')).toHaveLength(3);
  });

  it('membuka form pembuatan acara', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Workshop React');
    await openCreate(user);

    expect(screen.getByLabelText('Judul acara')).toHaveValue('');
    expect(screen.getByLabelText('Kuota')).toHaveValue(30);
    expect(screen.getByLabelText('Kategori')).toHaveValue('1');
    expect(screen.getByLabelText('Status')).toHaveValue('published');
  });

  it('menggunakan kategori default ketika daftar kategori kosong', async () => {
    const user = userEvent.setup();

    api.mockImplementation(async (path) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [eventData] };
      }
      if (path === '/categories') return { categories: [] };
      if (path === '/events') return { event: eventData };
      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await screen.findByText('Workshop React');
    await openCreate(user);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Save event/i }));

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith('/events', expect.objectContaining({ method: 'POST' }));
    });

    const call = api.mock.calls.find(([path]) => path === '/events');

    expect(JSON.parse(call[1].body).category_id).toBe(1);
  });

  it('menggunakan id kategori pertama sebagai default', async () => {
    const user = userEvent.setup();
    api.mockImplementation(async (path) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [] };
      }
      if (path === '/categories') {
        return { categories: [{ id: 5, name: 'Seni' }] };
      }
      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await screen.findByText('Belum ada acara. Buat acara pertamamu!');
    await openCreate(user);

    expect(screen.getByLabelText('Kategori')).toHaveValue('5');
  });

  it('mengubah kategori dan status acara sebelum disimpan', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Workshop React');
    await openCreate(user);
    await fillForm(user);

    await user.selectOptions(screen.getByLabelText('Kategori'), '2');
    await user.selectOptions(screen.getByLabelText('Status'), 'draft');
    await user.click(screen.getByRole('button', { name: /Save event/i }));

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith('/events', expect.objectContaining({ method: 'POST' }));
    });

    const call = api.mock.calls.find(
      ([path, options]) => path === '/events' && options?.method === 'POST',
    );
    const payload = JSON.parse(call[1].body);

    expect(payload.category_id).toBe(2);
    expect(payload.status).toBe('draft');
  });

  it('menutup form dengan tombol Cancel dan X', async () => {
    const user = userEvent.setup();
    renderPage();

    await openCreate(user);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.queryByRole('heading', { name: 'Create an event' })).not.toBeInTheDocument();

    await openCreate(user);
    await user.click(screen.getByRole('button', { name: '' }));

    expect(screen.queryByRole('heading', { name: 'Create an event' })).not.toBeInTheDocument();
  });

  it('membuat acara baru', async () => {
    const user = userEvent.setup();
    renderPage();

    await openCreate(user);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Save event/i }));

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith('/events', expect.objectContaining({ method: 'POST' }));
    });

    const call = api.mock.calls.find(
      ([path, options]) => path === '/events' && options?.method === 'POST',
    );

    expect(call).toBeDefined();

    const payload = JSON.parse(call[1].body);

    expect(payload.title).toBe('Acara Baru');
    expect(payload.capacity).toBe(40);
    expect(payload.category_id).toBe(1);
    expect(new Date(payload.end_at).getTime()).toBeGreaterThan(
      new Date(payload.start_at).getTime(),
    );
  });

  it('memvalidasi tanggal kosong', async () => {
    const user = userEvent.setup();
    renderPage();

    await openCreate(user);
    submitForm();

    expect(await screen.findByText('Tanggal mulai dan selesai wajib diisi.')).toBeInTheDocument();
  });

  it('memvalidasi tanggal selesai yang tidak setelah tanggal mulai', async () => {
    const user = userEvent.setup();
    renderPage();

    await openCreate(user);
    await fillForm(user);

    await user.clear(screen.getByLabelText('Mulai'));
    await user.type(screen.getByLabelText('Mulai'), '2027-05-11T12:00');

    await user.clear(screen.getByLabelText('Selesai'));
    await user.type(screen.getByLabelText('Selesai'), '2027-05-10T12:00');

    submitForm();

    expect(
      await screen.findByText('Tanggal selesai harus setelah tanggal mulai.'),
    ).toBeInTheDocument();
  });

  it('membuka form edit dengan data acara', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Workshop React');
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByRole('heading', { name: 'Edit event' })).toBeInTheDocument();

    expect(screen.getByLabelText('Judul acara')).toHaveValue('Workshop React');
    expect(screen.getByLabelText('Lokasi')).toHaveValue('Aula Kampus');
  });

  it('menyimpan perubahan acara menggunakan PATCH', async () => {
    const user = userEvent.setup();
    renderPage();

    await screen.findByText('Workshop React');
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.clear(screen.getByLabelText('Judul acara'));
    await user.type(screen.getByLabelText('Judul acara'), 'Workshop Update');
    await user.click(screen.getByRole('button', { name: /Save event/i }));

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith('/events/7', expect.objectContaining({ method: 'PATCH' }));
    });
  });

  it('menampilkan error ketika penyimpanan perubahan acara gagal', async () => {
    const user = userEvent.setup();

    api.mockImplementation(async (path, options = {}) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [eventData] };
      }
      if (path === '/categories') return { categories: categoriesData };
      if (path === '/events/7' && options.method === 'PATCH') {
        throw new Error('Gagal memperbarui acara');
      }
      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await screen.findByText('Workshop React');
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    await user.clear(screen.getByLabelText('Judul acara'));
    await user.type(screen.getByLabelText('Judul acara'), 'Workshop Update');
    await user.click(screen.getByRole('button', { name: /Save event/i }));

    expect(await screen.findByText('Gagal memperbarui acara')).toBeInTheDocument();
  });

  it('membatalkan penghapusan ketika confirm bernilai false', async () => {
    const user = userEvent.setup();
    window.confirm.mockReturnValue(false);

    renderPage();

    await screen.findByText('Workshop React');
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(api).not.toHaveBeenCalledWith(
      '/events/7',
      expect.objectContaining({ method: 'DELETE' }),
    );
  });

  it('menghapus acara ketika confirm bernilai true', async () => {
    const user = userEvent.setup();
    window.confirm.mockReturnValue(true);

    renderPage();

    await screen.findByText('Workshop React');
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(api).toHaveBeenCalledWith('/events/7', { method: 'DELETE' });
    });
  });

  it('menampilkan error ketika penghapusan gagal', async () => {
    const user = userEvent.setup();

    api.mockImplementation(async (path, options = {}) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [eventData] };
      }
      if (path === '/categories') return { categories: categoriesData };
      if (path === '/events/7' && options.method === 'DELETE') {
        throw new Error('Gagal menghapus acara');
      }
      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await screen.findByText('Workshop React');
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(await screen.findByText('Gagal menghapus acara')).toBeInTheDocument();
  });

  it('menampilkan error ketika pembuatan acara gagal', async () => {
    const user = userEvent.setup();

    api.mockImplementation(async (path, options = {}) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [eventData] };
      }
      if (path === '/categories') return { categories: categoriesData };
      if (path === '/events' && options.method === 'POST') {
        throw new Error('Gagal menyimpan acara');
      }
      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await openCreate(user);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Save event/i }));

    expect(await screen.findByText('Gagal menyimpan acara')).toBeInTheDocument();
  });

  it('memakai pesan default ketika error penyimpanan tidak punya pesan', async () => {
    const user = userEvent.setup();

    api.mockImplementation(async (path, options = {}) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return { events: [eventData] };
      }
      if (path === '/categories') return { categories: categoriesData };
      if (path === '/events' && options.method === 'POST') {
        throw new Error('');
      }
      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await openCreate(user);
    await fillForm(user);
    await user.click(screen.getByRole('button', { name: /Save event/i }));

    expect(await screen.findByText('Terjadi kesalahan saat menyimpan acara.')).toBeInTheDocument();
  });

  it('membuka form edit untuk acara tanpa tanggal', async () => {
    const user = userEvent.setup();

    api.mockImplementation(async (path) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      if (path === '/events?includeDrafts=true&limit=100') {
        return {
          events: [{ ...eventData, start_at: undefined, end_at: undefined }],
        };
      }
      if (path === '/categories') return { categories: categoriesData };
      throw new Error(`API tidak dikenal: ${path}`);
    });

    renderPage();

    await screen.findByText('Workshop React');
    await user.click(screen.getByRole('button', { name: 'Edit' }));

    expect(screen.getByLabelText('Mulai')).toHaveValue('');
    expect(screen.getByLabelText('Selesai')).toHaveValue('');
  });

  it('menangani respons tanpa daftar acara dan kategori', async () => {
    api.mockImplementation(async (path) => {
      if (path === '/dashboard/stats') return { stats: statsData };
      return {};
    });

    renderPage();

    expect(await screen.findByText('Belum ada acara. Buat acara pertamamu!')).toBeInTheDocument();
  });
});
