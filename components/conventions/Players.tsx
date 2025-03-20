import useFetchData, { clearCache } from "@/hooks/useFetchData";
import { Player } from "@/types/player";
import Link from "next/link";

interface PlayersProps {
  conventionId: string;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function Players({conventionId}: PlayersProps) {

  const { data: players, loading, error } = useFetchData<Player[]>(`${API_ENDPOINT}/api/conventions/${conventionId}/players`);

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  return (
    <>
      <div className="border p-4 rounded-lg shadow-sm flex-grow mt-4">
        <div className="flex items-center justify-between mb-4">
          <Link
            onClick={() => clearCache(`${API_ENDPOINT}/api/conventions/${conventionId}/players`)}
            href={`/conventions/${conventionId}/players/register`}
            className="text-blue-500 hover:underline"
          >
            プレイヤー登録
          </Link>
        </div>

        {players?.map((player) => (
          <Link key={player.id} href={`/conventions/${conventionId}/players/${player.id}`}>
            <div className="border p-4 mb-4 rounded-lg shadow-sm">
              <h2 className="font-semibold text-lg">
                {player.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
};