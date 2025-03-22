import { getAccessToken } from '@auth0/nextjs-auth0';
import { useEffect, useState } from 'react';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type QueryParams = {
  [key: string]: string | number | undefined
}

type CacheEntry<T> = {
  data: T;
  timestamp: number;
}

const cache = new Map<string, CacheEntry<unknown>>();

/**
 * キャッシュを削除する
 * キャッシュキーの指定がない場合はすべてのキャッシュを削除する
 * @param cacheKey 削除するキャッシュキー
 */
export function clearCache(cacheKey?: string) {
  if (cacheKey) {
    cache.delete(cacheKey);
  } else {
    cache.clear();
  }
}

/**
 * クエリパラメータをオブジェクトで受け取り、Stringにして返却する
 * @param params クエリパラメータ
 * @returns クエリパラメータをURLエンコードした上で文字列形式で返却
 */
function buildQueryString(params: QueryParams): string {
  const query = new URLSearchParams(
    Object.entries(params).reduce((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = String(value);
      }
      return acc;
    }, {} as Record<string, string>)
  );

  return query.toString() ? `${query.toString()}` : '';
}

/**
 * 受け取ったURLのエンドポイントからデータを取得する
 * キャッシュが存在していれば、キャッシュのデータを返却する
 * キャッシュはURL＋クエリストリングのキーに対して保存される
 * @param url バックエンドAPIのURL
 * @param cacheDuration キャッシュを保存しておく期間
 * @param queryParams {key: value}形式で受け取るクエリパラメータ(複数指定可)
 * @returns data, loading, error
 */
function useFetchData<T>(
  url: string,
  cacheDuration: number = 5 * 60 * 1000,
  queryParams?: QueryParams
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      const queryString = queryParams? buildQueryString(queryParams): '';
      const cacheKey = `${url}${queryString}`;

      /**
       * キャッシュの確認、およびキャッシュ期限の確認
       * キャッシュが存在し、期間内であればキャッシュのデータを返却する
       */
      const cached = cache.get(cacheKey) as CacheEntry<T> | undefined;
      if (cached && Date.now() - cached.timestamp < cacheDuration) {
        setState({ data: cached.data, loading: false, error: null });
        return;
      }

      /**
       * キャッシュがない or キャッシュの期限切れの場合はAPIを叩いてデータを取得する
       */
      try {
        setState({ data: null, loading: true, error: null});
        const accessToken = await getAccessToken();
        const response = await fetch(`${url}${queryString}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const result: T = await response.json();

        // API取得結果をキャッシュに格納
        cache.set(cacheKey, { data: result, timestamp: Date.now() });
        setState({ data: result, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error: (error as Error).message });
      }
    };

    fetchData();
  }, [url, cacheDuration, queryParams]);

  return state;
}

export default useFetchData;

