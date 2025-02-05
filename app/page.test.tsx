import { render, screen, waitFor } from '@testing-library/react';
import Page from './page';

global.fetch = jest.fn();

describe('Home Page', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(() => {})); // データ取得中

    render(<Page />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders posts successfully', async () => {
    const mockPosts = [
      {
        "id": "b2f77130-2c51-4b66-9dea-0ad6b88bbc2d",
        "name": "convention1",
        "held_date": "2024-10-24"
      },
      {
        "id": "b2f77130-2c51-4b66-9dea-0ad6b88bbc2e",
        "name": "convention2",
        "held_date": "2025-02-05"
      },
    ];

    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPosts,
    });

    render(<Page />);
    await waitFor(() => expect(screen.getByText('convention1')).toBeInTheDocument());
    expect(screen.getByText('convention2')).toBeInTheDocument();
  });

  it('renders error state when fetch fails', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch error'));

    render(<Page />);
    await waitFor(() => expect(screen.getByText(/Fetch error/i)).toBeInTheDocument());
  });
});
