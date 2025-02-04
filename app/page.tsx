'use client';

import useFetchData from "@/hooks/useFetchData"
import { Convention } from "@/types/convention";

const API_ENDPOINT = process.env.API_ENDPOINT ? process.env.API_ENDPOINT : 'http://localhost:3000';

export default function Page() {

  console.log(`${process.env.API_ENDPOINT}`);
  console.log(`API_ENDPOINT is ${API_ENDPOINT}`);
  const { data, loading, error } = useFetchData<Convention[]>(`${API_ENDPOINT}/api/conventions`);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">大会一覧</h1>
      {data?.map((convention) => (
        <div key={convention.id} className="border p-4 mb-4 rounded-lg shadow-sm">
          <h2 className="font-semibold text-lg">{convention.name}</h2>
          <p>{convention.held_date}</p>
        </div>
      ))}
    </div>
  )
}