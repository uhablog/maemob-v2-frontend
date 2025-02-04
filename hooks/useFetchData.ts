import { useEffect, useState } from 'react';

type FetchState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

function useFetchData<T>(url: string) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
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
  }, [url]);

  return state;
}

export default useFetchData;

