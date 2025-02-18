import useFetchData, { clearCache } from '@/hooks/useFetchData';
import { renderHook, waitFor } from '@testing-library/react';

describe('useFetchData', () => {

  beforeEach(() => {
    fetchMock.resetMocks();
    clearCache();  // キャッシュをクリアしておく
  });

  it('fetches and returns data successfully', async () => {
    // モックデータを定義
    const mockData = [{ id: 1, title: 'Test Post', body: 'This is a test.' }];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    const { result } = renderHook(() =>
      useFetchData<typeof mockData>('https://example.com/posts')
    );

    // 最初はローディング中
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // データ取得後の更新を待つ
    await waitFor(() => expect(result.current.loading).toBe(false));

    // 結果を確認
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(fetch).toHaveBeenCalledWith('https://example.com/posts');

    // キャッシュに保存されているか確認する
    fetchMock.mockReset();

    const { result: cachedResult } = renderHook(() => 
      useFetchData<typeof mockData>('https://example.com/posts')
    );

    expect(cachedResult.current).toEqual({ data: mockData, loading: false, error: null});
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('handles fetch errors gracefully', async () => {
    const mockError = new Error('Failed to fetch data');
    (fetch as jest.Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() =>
      useFetchData('https://example.com/posts')
    );

    // 最初はローディング中
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // エラー発生後の更新を待つ
    await waitFor(() => expect(result.current.loading).toBe(false));

    // エラーが適切に設定されているか確認
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Failed to fetch data');
  });

  it('handles non-ok response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      statusText: 'Not Found',
    });

    const { result } = renderHook(() =>
      useFetchData('https://example.com/invalid')
    );

    // 最初はローディング中
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();

    // レスポンス処理後の更新を待つ
    await waitFor(() => expect(result.current.loading).toBe(false));

    // エラーとして処理されているか確認
    expect(result.current.loading).toBe(false);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Failed to fetch data: Not Found');
  });
});
