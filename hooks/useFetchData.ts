import { useEffect, useState } from 'react';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

type QueryParams = {
  [key: string]: string | number | undefined
}

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

function useFetchData<T>(url: string, queryParams?: QueryParams) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const queryString = queryParams? buildQueryString(queryParams): '';
        const response = await fetch(`${url}${queryString}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`);
        }
        const result: T = await response.json();
        setState({ data: result, loading: false, error: null });
      } catch (error) {
        setState({ data: null, loading: false, error: (error as Error).message });
      }
    };

    fetchData();
  }, [url, JSON.stringify(queryParams)]);

  return state;
}

export default useFetchData;

