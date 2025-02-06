import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import Page from './page';

global.fetch = jest.fn();

// useRouterのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('Page component', () => {
  const push = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push });
  });

  it('should render the form correctly', () => {
    render(<Page />);

    // フォームの要素が正しく表示されるか確認
    expect(screen.getByText('大会登録')).toBeInTheDocument();
    expect(screen.getByText('大会名')).toBeInTheDocument();
    expect(screen.getByText('開催日')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登録する' })).toBeInTheDocument();
  });

  it('should show validation error messages when fields are empty', async () => {
    render(<Page />);

    fireEvent.click(screen.getByRole('button', { name: '登録する' }));

    await waitFor(() => {
      expect(screen.getByText('大会名を入力してください。')).toBeInTheDocument();
      expect(screen.getByText('開催日を入力してください。')).toBeInTheDocument();
    });
  });

  it('should submit the form and redirect on success', async () => {
    const mockResponse = { id: '1', name: 'Sample Convention', held_date: '2025-02-01' };

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponse),
    });

    render(<Page />);

    fireEvent.change(screen.getByLabelText('大会名'), { target: { value: 'Sample Convention' } });
    fireEvent.change(screen.getByLabelText('開催日'), { target: { value: '2025-02-01' } });
    fireEvent.click(screen.getByRole('button', { name: '登録する' }));

    // 成功後にリダイレクトされることを確認
    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/');
    });
  });

  it('should show an error message on POST request failure', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    });

    render(<Page />);

    fireEvent.change(screen.getByLabelText('大会名'), { target: { value: 'Failed Convention' } });
    fireEvent.change(screen.getByLabelText('開催日'), { target: { value: '2025-02-01' } });
    fireEvent.click(screen.getByRole('button', { name: '登録する' }));

    await waitFor(() => {
      expect(screen.getByText('Failed to POST: Internal Server Error')).toBeInTheDocument();
    });
  });
});
