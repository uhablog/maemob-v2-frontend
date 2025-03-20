'use client';

import useFetchData from "@/hooks/useFetchData";
import { Assist } from "@/types/assist";
import { Match } from "@/types/match";
import { Mom } from "@/types/mom";
import { Player } from "@/types/player";
import { Scorer } from "@/types/scorer";
import { useParams } from "next/navigation";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function Page() {

  const params = useParams<{
    id: string
    match_id: string
  }>();
  const convention_id = params.id;
  const match_id = params.match_id;

  // 試合情報の取得
  const { data: match, loading, error } = useFetchData<Match>(`${API_ENDPOINT}/api/conventions/${convention_id}/match/${match_id}`)

  // 得点者の取得
  const {
    data: scorers,
    loading: scorerLoading,
    error: scorerError
  } = useFetchData<Scorer[]>(`${API_ENDPOINT}/api/conventions/${convention_id}/matches/${match_id}/scorers`);

  // アシストの取得
  const {
    data: assists,
    loading: assistLoading,
    error: assistError
  } = useFetchData<Assist[]>(`${API_ENDPOINT}/api/conventions/${convention_id}/matches/${match_id}/assists`);

  // MOMの取得
  const {
    data: mom,
    loading: momLoading,
    error: momError
  } = useFetchData<Mom>(`${API_ENDPOINT}/api/conventions/${convention_id}/matches/${match_id}/mom`);

  // ホームプレイヤーの取得
  const {
    data: homePlayer,
    loading: homePlayerLoading,
    error: homePlayerError
  } = useFetchData<Player>(`${API_ENDPOINT}/api/conventions/${convention_id}/player/${match?.homePlayerId}`);

  // アウェイプレイヤーの取得
  const {
    data: awayPlayer,
    loading: awayPlayerLoading,
    error: awayPlayerError
  } = useFetchData<Player>(`${API_ENDPOINT}/api/conventions/${convention_id}/player/${match?.awayPlayerId}`);

  if (loading) return <div className='text-center p-4'>Loading...</div>
  if (error) return <div className='text-red-500 text-center p-4'>{error}</div>

  return (
    <>
      <div className="border p-4 rounded-lg shadow-sm flex-grow flex flex-col">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center text-3xl font-bold">
            {homePlayerLoading ? (
              'Loading...'
            ):(
              homePlayer?.name ?? 'Unknown'
            )}
            {homePlayerError ?? <div className="text-red-500 text-center">{homePlayerError}</div>}
          </div>
          <div className="text-center text-3xl font-bold">
            <span className="mx-2">
              {match?.homeScore} - {match?.awayScore}
            </span>
          </div>
          <div className="text-center text-3xl font-bold">
            {awayPlayerLoading ? (
              'Loading...'
            ):(
              awayPlayer?.name ?? 'Unknown'
            )}
            {awayPlayerError ?? <div className="text-red-500 text-center">{awayPlayerError}</div>}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {/* ホームチームの得点者表示 */}
          <div className="text-center">
            <ul className="space-y-1">
              {scorerLoading ? (
                <div>Loading...</div>
              ) : (
                scorers
                  ?.filter((scorer) => scorer.player_id === homePlayer?.id)
                  .map((scorer, index) => (
                    <li key={`home-scorer-${index}`}>{scorer.name}</li>
                ))
              )}
              {scorerError && <div className="text-red-500 text-center p-4">{scorerError}</div>}
            </ul>
          </div>

          <div className="flex justify-center items-center">
            ⚽
          </div>

          {/* アウェーチームの得点者表示 */}
          <div className="text-center">
            <ul className="space-y-1">
              {scorerLoading ? (
                <div>Loading...</div>
              ): (
                scorers
                ?.filter((scorer) => scorer.player_id === awayPlayer?.id)
                .map((scorer, index) => (
                  <li key={`away-scorer-${index}`}>{scorer.name}</li>
                ))
              )}
              {scorerError && <div className="text-red-500 text-center p-4">{scorerError}</div>}
            </ul>
          </div>
        </div>
        <hr className="my-2 border-gray-200" />
        <div className="grid grid-cols-3 gap-4">
          {/* ホームチームのアシスト表示 */}
          <div className="text-center">
            <ul className="space-y-1">
              {assistLoading ? (
                <div>Loading...</div>
              ): (
                assists
                ?.filter((assist) => assist.player_id === homePlayer?.id)
                .map((assist, index) => (
                  <li key={`home-assist-${index}`}> {assist.name}</li>
                ))
              )}
              {assistError && <div className="text-red-500 text-center p-4">{assistError}</div>}
            </ul>
          </div>

          {/* スコア中央表示 */}
          <div className="flex justify-center items-center">
            🎯
          </div>

          {/* アウェーチームの得点者とアシスト表示 */}
          <div className="text-center">
            <ul className="space-y-1">
              {assistLoading ? (
                <div>Loading...</div>
              ): (assists
                ?.filter((assist) => assist.player_id === awayPlayer?.id)
                .map((assist, index) => (
                  <li key={`away-assist-${index}`}>{assist.name}</li>
                ))
              )}
              {assistError && <div className="text-red-500 text-center p-4">{assistError}</div>}
            </ul>
          </div>
        </div>
      </div>
      <div className="border p-4 rounded-lg shadow-sm flex-grow flex flex-col">
          {momLoading ? (
            'Loading...'
          ):(
            <>
              <div className="font-bold">
                Player of the Match
              </div>
              <div className="text-xl font-bold">
                {mom?.name ?? 'Unknown'}<br/>
              </div>
              {mom?.player_id === homePlayer?.id ? (
                homePlayer?.name
              ): (
                awayPlayer?.name
              )}
            </>
          )}
          {momError ?? <div className="text-red-500 text-center">{momError}</div>}
      </div>
    </>
  )
};