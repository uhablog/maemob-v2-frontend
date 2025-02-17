import { useState } from "react";

type PostState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
}

function usePostData<T, U>(url: string) {
  const [ state, setState ] = useState<PostState<T>>({
    data: null,
    loading: false,
    error: null
  });

  const postData = async (payload: U) => {
    setState({data: null, loading: true, error: null});

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Failed to POST: ${response.statusText}`);
      }

      const result: T = await response.json();
      setState({ data: result, loading: false, error: null});
      return result;
    } catch (error) {
      setState({data: null, loading: false, error: (error as Error).message});
    }
  };

  return { ...state, postData }
};

export default usePostData;