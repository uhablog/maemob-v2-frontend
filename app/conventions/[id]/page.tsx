'use client';

import GamesList from '@/components/conventions/GamesList';
import Players from '@/components/conventions/Players';
import ConventionSummary from '@/components/conventions/Summary';
import useFetchData from '@/hooks/useFetchData';
import { Convention } from '@/types/convention';
import { useParams } from 'next/navigation';
import { useState } from 'react';

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ?? 'http://localhost:3000';

export default function Page() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("概要");

  const { data: convention, loading, error } = useFetchData<Convention>(`${API_ENDPOINT}/api/convention/${params.id}`);

  if (loading) return <div className='text-center p-4'>Loading...</div>
  if (error) return <div className='text-red-500 text-center p-4'>{error}</div>

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="border p-4 rounded-lg shadow-sm flex-grow">
        <h2 className="font-semibold text-lg">{convention?.name}</h2>
        <div className='flex space-x-4 mt-2 border-b'>
          {["概要", "試合", "プレイヤー"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-4 border-b-2 ${
                activeTab === tab ? "border-blue-500 text-blue-500 font-bold": "border-transparent text-gray-600"
              } hover:border-blue-500 hover:text-blue-500`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
        {activeTab === "概要" && <ConventionSummary conventionId={params.id} />}
        {activeTab === "試合" && <GamesList conventionId={params.id}/>}
        {activeTab === "プレイヤー" && <Players conventionId={params.id}/>}
    </div>
  );
}
