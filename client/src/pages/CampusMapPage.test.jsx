import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../test-utils';
import CampusMapPage from './CampusMapPage';

const { flyToMock } = vi.hoisted(() => ({
  flyToMock: vi.fn(),
}));

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children, eventHandlers, position }) => (
    <div
      data-testid="map-marker"
      data-position={position.join(',')}
      onClick={() => eventHandlers?.click?.()}
    >
      {children}
    </div>
  ),
  Popup: ({ children }) => <div>{children}</div>,
  CircleMarker: () => null,
  useMap: () => ({ flyTo: flyToMock }),
}));

vi.mock('leaflet/dist/leaflet.css', () => ({}));

vi.mock('lucide-react', () => {
  const Icon = () => <span aria-hidden="true" />;

  return {
    ArrowLeft: Icon,
    CalendarDays: Icon,
    MapPin: Icon,
    Search: Icon,
    ExternalLink: Icon,
    Radio: Icon,
  };
});

function renderPage() {
  return renderWithProviders(<CampusMapPage />);
}

// Batasi pemeriksaan lokasi pada sidebar,
// karena marker peta juga menampilkan nama lokasi.
function getLocationList() {
  const list = document.querySelector('.map-place-list');

  if (!list) {
    throw new Error('Daftar lokasi kampus tidak ditemukan.');
  }

  return within(list);
}

describe('CampusMapPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('menampilkan halaman peta dan seluruh lokasi awal', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /Explore your campus/i })).toBeInTheDocument();

    const locationList = getLocationList();

    const expectedPlaces = [
      'Perpustakaan',
      'Lapangan NA70',
      'Lapangan Hijau',
      'Open Theater (OT)',
      'Entrance Hall (EH)',
      'Lapangan Pniel',
      'Kantin Lama',
      'Kantin Baru',
      'Auditorium',
    ];

    expectedPlaces.forEach((place) => {
      expect(locationList.getByText(place)).toBeInTheDocument();
    });

    expect(screen.getByTestId('map-container')).toBeInTheDocument();
    expect(screen.getAllByTestId('map-marker')).toHaveLength(9);
    expect(screen.getByText('9 lokasi')).toBeInTheDocument();
  });

  it('memfilter lokasi berdasarkan teks pencarian', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Cari lokasi kampus...'), 'kantin');

    const locationList = getLocationList();

    expect(locationList.getByText('Kantin Lama')).toBeInTheDocument();
    expect(locationList.getByText('Kantin Baru')).toBeInTheDocument();
    expect(locationList.queryByText('Perpustakaan')).not.toBeInTheDocument();

    expect(screen.getByText('2 lokasi')).toBeInTheDocument();
  });

  it('pencarian tidak membedakan huruf besar dan kecil', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Cari lokasi kampus...'), 'AUDITORIUM');

    expect(getLocationList().getByText('Auditorium')).toBeInTheDocument();
    expect(screen.getByText('1 lokasi')).toBeInTheDocument();
  });

  it('menampilkan jumlah nol jika pencarian tidak cocok', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.type(screen.getByPlaceholderText('Cari lokasi kampus...'), 'lokasi-tidak-ada');

    const locationList = getLocationList();

    expect(screen.getByText('0 lokasi')).toBeInTheDocument();
    expect(locationList.queryByText('Perpustakaan')).not.toBeInTheDocument();
    expect(locationList.queryByText('Kantin Lama')).not.toBeInTheDocument();
  });

  it.each([
    ['Fasilitas', ['Perpustakaan', 'Entrance Hall (EH)', 'Auditorium']],
    ['Lapangan', ['Lapangan NA70', 'Lapangan Hijau', 'Lapangan Pniel']],
    ['Kegiatan', ['Open Theater (OT)']],
    ['Kuliner', ['Kantin Lama', 'Kantin Baru']],
  ])('memfilter kategori %s', async (category, expectedPlaces) => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: category }));

    const locationList = getLocationList();

    expectedPlaces.forEach((place) => {
      expect(locationList.getByText(place)).toBeInTheDocument();
    });

    expect(screen.getByText(`${expectedPlaces.length} lokasi`)).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Semua' })).toBeInTheDocument();
  });

  it('mengembalikan semua lokasi saat filter Semua dipilih', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Kuliner' }));
    expect(screen.getByText('2 lokasi')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Semua' }));

    expect(screen.getByText('9 lokasi')).toBeInTheDocument();
    expect(getLocationList().getByText('Perpustakaan')).toBeInTheDocument();
  });

  it('menerapkan pencarian dan filter kategori secara bersamaan', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: 'Lapangan' }));

    await user.type(screen.getByPlaceholderText('Cari lokasi kampus...'), 'hijau');

    const locationList = getLocationList();

    expect(locationList.getByText('Lapangan Hijau')).toBeInTheDocument();
    expect(locationList.queryByText('Lapangan NA70')).not.toBeInTheDocument();
    expect(screen.getByText('1 lokasi')).toBeInTheDocument();
  });

  it('menampilkan kartu ketika lokasi dipilih', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /Perpustakaan/i }));

    expect(screen.getByText('LOKASI DIPILIH')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Perpustakaan' })).toBeInTheDocument();
    expect(screen.getByText(/Fasilitas.*Institut Teknologi Del/)).toBeInTheDocument();

    expect(screen.getByRole('link', { name: /Buka lokasi di Google Maps/i })).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=2.38465,99.1472',
    );
  });

  it('memindahkan peta ke lokasi yang dipilih', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /Perpustakaan/i }));

    expect(flyToMock).toHaveBeenCalledWith([2.38465, 99.1472], 18, { duration: 0.5 });
  });

  it('menutup kartu lokasi dengan tombol Tutup', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByRole('button', { name: /Perpustakaan/i }));

    expect(screen.getByText('LOKASI DIPILIH')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Tutup lokasi dipilih' }));

    expect(screen.queryByText('LOKASI DIPILIH')).not.toBeInTheDocument();
  });

  it('memilih lokasi dari marker pada peta', () => {
    renderPage();

    const markers = screen.getAllByTestId('map-marker');
    fireEvent.click(markers[0]);

    expect(screen.getByText('LOKASI DIPILIH')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Perpustakaan' })).toBeInTheDocument();
  });

  it('menyediakan tautan kembali dan Google Maps', () => {
    renderPage();

    expect(screen.getByRole('link', { name: /Kembali/i })).toHaveAttribute('href', '/');

    expect(screen.getByRole('link', { name: /Google Maps/i })).toHaveAttribute(
      'href',
      'https://www.google.com/maps/search/?api=1&query=Institut+Teknologi+Del+Sitoluama+Balige',
    );

    expect(screen.getByText('Acara di sekitar kampus')).toBeInTheDocument();
  });
});
