import useFetchData from "@/hooks/useFetchData";
import { Scorer } from "@/types/scorer";

interface TopScorerProps {
  conventionId: string;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function TopScorer({conventionId}: TopScorerProps) {

  const { data: scorers, loading, error } = useFetchData<Scorer[]>(`${API_ENDPOINT}/api/scorers?convention_id=${conventionId}`);

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  return (
    <>
      <div className="border p-4 rounded-lg shadow-sm flex-grow mt-4">
        <h2>Top scorer</h2>
        <div className="overflow-x-auto">
          <table className="bg-gray-100 min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left"></th>
                <th className="py-3 px-6 text-center"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 text-gray-600 text-sm">
              {scorers?.map((scorer) => (
                <tr
                  key={scorer.id}
                  className="hover:bg-gray-200 transition"
                >
                  <td className="py-3 px-6 text-left">{scorer.name}<br/>{scorer.player_name}</td>
                  <td className="py-3 px-6 text-center">{scorer.score_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}