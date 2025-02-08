'use client';

import { useEffect, useState } from 'react';
import useFetchData, { clearCache } from '@/hooks/useFetchData';
import { Match } from '@/types/match';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

type MatchWithPlayers = Match & {
  homePlayerName?: string;
  awayPlayerName?: string;
};

export default function Page() {
  const params = useParams<{ id: string }>();
  const { data: matches, loading, error } = useFetchData<Match[]>(`${API_ENDPOINT}/api/conventions/${params.id}/matches`);

  const [matchesWithPlayers, setMatchesWithPlayers] = useState<MatchWithPlayers[]>([]);

  useEffect(() => {
    if (!matches) return;

    const fetchPlayerNames = async () => {
      try {
        // 各試合の homePlayerId と awayPlayerId を使ってプレイヤー名を取得
        const playerFetchPromises = matches.map(async (match) => {
          const homePlayerResponse = await fetch(`${API_ENDPOINT}/api/conventions/${params.id}/player/${match.homePlayerId}`);
          const awayPlayerResponse = await fetch(`${API_ENDPOINT}/api/conventions/${params.id}/player/${match.awayPlayerId}`);

          const homePlayer = await homePlayerResponse.json();
          const awayPlayer = await awayPlayerResponse.json();

          return {
            ...match,
            homePlayerName: homePlayer.name,
            awayPlayerName: awayPlayer.name,
          };
        });

        // すべてのプレイヤー情報が揃ったら状態にセット
        const matchesWithPlayerData = await Promise.all(playerFetchPromises);
        setMatchesWithPlayers(matchesWithPlayerData);
      } catch (err) {
        console.error('プレイヤー情報の取得中にエラーが発生しました', err);
      }
    };

    fetchPlayerNames();
  }, [matches, params.id]);

  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">試合</h1>
        <Link
          onClick={() => clearCache(`${API_ENDPOINT}/api/conventions/${params.id}/matches`)}
          href={`/conventions/${params.id}/matches/register`}
          className="text-blue-500 hover:underline"
        >
          試合登録
        </Link>
      </div>

      {matchesWithPlayers.map((match) => (
        <Link key={match.id} href={`/conventions/${params.id}/matches/${match.id}`}>
          <div className="border p-4 mb-4 rounded-lg shadow-sm">
            <h2 className="font-semibold text-lg">
              {match.homePlayerName ?? 'Unknown'} {match.homeScore} - {match.awayScore} {match.awayPlayerName ?? 'Unknown'}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
