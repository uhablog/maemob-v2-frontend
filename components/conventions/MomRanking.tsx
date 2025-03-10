import useFetchData from "@/hooks/useFetchData";
import { Mom } from "@/types/mom";

interface TopMomProps {
  conventionId: string;
}

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function TopMom({conventionId}: TopMomProps) {

  const { data: moms, loading, error } = useFetchData<Mom[]>(`${API_ENDPOINT}/api/mom?convention_id=${conventionId}`);

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>

  console.log('moms', moms);

  return (
    <>
      <div className="border p-4 rounded-lg shadow-sm flex-grow mt-4">
        <h2>Top mom</h2>
        <div className="overflow-x-auto">
          <table className="bg-gray-100 min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
              <tr>
                <th className="py-3 px-6 text-left"></th>
                <th className="py-3 px-6 text-center"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-100 text-gray-600 text-sm">
              {moms?.map((mom) => (
                <tr
                  key={`${mom.player_id}-${mom.name}`}
                  className="hover:bg-gray-200 transition"
                >
                  <td className="py-3 px-6 text-left">{mom.name}<br/>{mom.player_name}</td>
                  <td className="py-3 px-6 text-center">{mom.mom_count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}