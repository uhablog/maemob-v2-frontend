'use client';

import useFetchData from "@/hooks/useFetchData";
import { Match } from "@/types/match";
import { useParams } from "next/navigation";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function Page() {

  const params = useParams<{
    id: string
    match_id: string
  }>();

  const { data: match, loading, error } = useFetchData<Match>(`${API_ENDPOINT}/api/conventions/${params.id}/match/${params.match_id}`)

  if (loading) return <div className='text-center p-4'>Loading...</div>
  if (error) return <div className='text-red-500 text-center p-4'>{error}</div>

  return (
    <>
      <div className="border p-4 rounded-lg shadow-sm flex-grow">
        <h2 className="font-semibold text-lg">
          {match?.homePlayerId ?? 'Unknown'} {match?.homeScore} - {match?.awayScore} {match?.awayPlayerId ?? 'Unknown'}
        </h2>
      </div>
    </>
  )
};