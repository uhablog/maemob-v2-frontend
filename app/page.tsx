'use client';

import useFetchData from "@/hooks/useFetchData"
import { Convention } from "@/types/convention";
import Link from "next/link";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

export default function Page() {

  const { data, loading, error } = useFetchData<Convention[]>(`${API_ENDPOINT}/api/conventions`);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">大会一覧</h1>
        <Link href={"/conventions/register"} className="text-blue-500 hover:underline">大会登録</Link>
      </div>
      {data?.map((convention) => (
        <Link key={convention.id} href={`/conventions/${convention.id}`}>
          <div  className="border p-4 mb-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg">{convention.name}</h2>
            <p>{convention.held_date}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}