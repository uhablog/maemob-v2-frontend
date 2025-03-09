import useFetchData from "@/hooks/useFetchData";
import { Player } from "@/types/player";

interface ConventionSummaryProps {
  conventionId: string;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function ConventionSummary({conventionId}: ConventionSummaryProps) {

  const { data: players, loading, error } = useFetchData<Player[]>(`${API_ENDPOINT}/api/conventions/${conventionId}/players`);

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  console.log('players', players);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="bg-gray-100 min-w-full bg-white shadow-md rounded-lg">
          <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left"></th>
              <th className="py-3 px-6 text-center">勝点</th>
              <th className="py-3 px-6 text-center">勝</th>
              <th className="py-3 px-6 text-center">引分</th>
              <th className="py-3 px-6 text-center">負</th>
              <th className="py-3 px-6 text-center">得点</th>
              <th className="py-3 px-6 text-center">失点</th>
            </tr>
          </thead>
          <tbody className="bg-gray-100 text-gray-600 text-sm">
            {players?.map((player) => (
              <tr
                key={player.id}
                className="hover:bg-gray-200 transition"
              >
                <td className="py-3 px-6 text-left">{player.name}</td>
                <td className="py-3 px-6 text-center">{player.points}</td>
                <td className="py-3 px-6 text-center">{player.wins}</td>
                <td className="py-3 px-6 text-center">{player.draws}</td>
                <td className="py-3 px-6 text-center">{player.losses}</td>
                <td className="py-3 px-6 text-center">{player.goals}</td>
                <td className="py-3 px-6 text-center">{player.concede}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}