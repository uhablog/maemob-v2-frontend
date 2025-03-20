'use client';

import useFetchData from "@/hooks/useFetchData";
import { Player } from "@/types/player";
import { useParams } from "next/navigation";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function Page() {

  const params = useParams<{
    id: string
    player_id: string
  }>();
  const conventionId = params.id;
  const playerId = params.player_id;

  // プレイヤー情報の取得
  const { data: player, loading, error } = useFetchData<Player>(`${API_ENDPOINT}/api/conventions/${conventionId}/player/${playerId}`)

  if (loading) return <div className='text-center p-4'>Loading...</div>
  if (error) return <div className='text-red-500 text-center p-4'>{error}</div>

  return (
    <>
      <div className="border p-4 rounded-lg shadow-sm flex-grow flex flex-col">
        {player?.name}
      </div>
    </>
  )
};