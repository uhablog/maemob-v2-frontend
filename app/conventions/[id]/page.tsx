'use client';

import useFetchData from "@/hooks/useFetchData";
import { Match } from "@/types/match";
import Link from "next/link";
import { useParams } from "next/navigation";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT: 'http://localhost:3000';

export default function Page() {

  const params = useParams<{ id: string}>();
  const {data, loading, error} = useFetchData<Match[]>(`${API_ENDPOINT}/api/conventions/${params.id}/matches`);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">試合</h1>
          <Link href={`/conventions/${params.id}/matches/register`} className="text-blue-500 hover:underline">試合登録</Link>
        </div>
        {data?.map((match) => (
          <Link key={match.id} href={`/conventions/${params.id}/matches/${match.id}`}>
            <div  className="border p-4 mb-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg">{match.homePlayerId} {match.homeScore} - {match.awayScore} {match.awayPlayerId}</h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
