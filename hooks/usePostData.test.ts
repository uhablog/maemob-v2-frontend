import usePostData from '@/hooks/usePostData';
import { act, renderHook } from '@testing-library/react';

// fetch のモック
global.fetch = jest.fn();

describe('usePostData', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // 各テストごとにモックをクリア
  });

  it('should initially have null data, false loading, and null error', () => {
    const { result } = renderHook(() => usePostData('/api/test'));

    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should successfully post data and update state', async () => {
    // モックするレスポンスデータ
    const mockResponseData = { message: 'Success' };

    // fetch のモック設定
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockResponseData),
    });

    const { result } = renderHook(() => usePostData<typeof mockResponseData, { name: string }>('/api/test'));

    // act で postData を呼び出す
    await act(async () => {
      await result.current.postData({ name: 'Test' });
    });

    // 結果の検証
    expect(result.current.data).toEqual(mockResponseData);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set error when fetch fails', async () => {
    // fetch の失敗をモック
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      statusText: 'Internal Server Error',
    });

    const { result } = renderHook(() => usePostData<null, { name: string }>('/api/test'));

    // act で postData を呼び出す
    await act(async () => {
      await result.current.postData({ name: 'Test' });
    });

    // 結果の検証
    expect(result.current.data).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Failed to POST: Internal Server Error');
  });
});
