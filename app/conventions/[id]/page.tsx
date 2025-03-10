'use client';

import GamesList from '@/components/conventions/GamesList';
import ConventionSummary from '@/components/conventions/Summary';
import { useParams } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
  const params = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("概要");

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="border p-4 rounded-lg shadow-sm flex-grow">
        <h2 className="font-semibold text-lg">Unknown</h2>
        <div className='flex space-x-4 mt-2 border-b'>
          {["概要", "試合"].map((tab) => (
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
    </div>
  );
}
