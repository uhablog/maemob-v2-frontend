'use client';

import StepIndicator from "@/components/StepIndicator";
import { useMatchContext } from "@/context/MatchContext";
import useFetchData from "@/hooks/useFetchData";
import usePostData from "@/hooks/usePostData";
import { Match } from "@/types/match";
import { Player } from "@/types/player";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

interface IMatchForm {
  homePlayerId: string
  awayPlayerId: string
  homeScore: number
  awayScore: number
}

export default function Page() {

  const { setMatch } = useMatchContext();
  const params = useParams<{ id: string}>();
  const router = useRouter();
  const { data: players } = useFetchData<Player[]>(`${API_ENDPOINT}/api/conventions/${params.id}/players`);
  const { register, handleSubmit, formState: { errors }} = useForm<IMatchForm>();
  const { loading, postData } = usePostData<Match, IMatchForm>(`${API_ENDPOINT}/api/conventions/${params.id}/matches`);

  const onSubmit: SubmitHandler<IMatchForm> = async (formData) => {
    const result = await postData(formData);

    if (result) {
      setMatch(result);
      router.push(`/conventions/${params.id}/matches/${result?.id}/scorers/register`);
    } else {
      window.alert('登録に失敗しました');
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-blue-50 border rounded">
        <StepIndicator currentStep={1}/>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="homePlayerId" className="block font-bold mb-1">ホームプレイヤー</label>
            <select
              id="homePlayerId"
              {...register("homePlayerId", {required: "ホームプレイヤーを選択してください"})}
              className="w-full p-2 border rounded"
            >
              <option value="">選択してください</option>
              {players && players.map(player => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
            {errors.homePlayerId && (
              <p className="text-red-500 text-sm italic">{errors.homePlayerId.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="homeScore" className="block font-bold mb-1">ホームチームの得点数</label>
            <input
              id="homeScore"
              type="number"
              {...register("homeScore", {
                required: "得点数を入力してください",
                min: 0,
                max: 99
              })}
              className="w-full p-2 border rounded"
            />
            {
              errors.homeScore && (
                <p className="text-red-500 text-sm italic">
                  {errors.homeScore.message}
                </p>
              )
            }
          </div>
          <div className="mb-4">
            <label htmlFor="awayPlayerId" className="block font-bold mb-1">アウェイプレイヤー</label>
            <select
              id="awayPlayerId"
              {...register("awayPlayerId", {required: "アウェイプレイヤーを選択してください"})}
              className="w-full p-2 border rounded"
            >
              <option value="">選択してください</option>
              {players && players.map(player => (
                <option key={player.id} value={player.id}>{player.name}</option>
              ))}
            </select>
            {errors.awayPlayerId && (
              <p className="text-red-500 text-sm italic">{errors.awayPlayerId.message}</p>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="awayScore" className="block font-bold mb-1">アウェイチームの得点</label>
            <input
              id="awayScore"
              type="number"
              {...register("awayScore", {
                required: "得点数を入力してください",
                min: 0,
                max: 99
              })}
              className="w-full p-2 border rounded"
            />
            {
              errors.awayScore && (
                <p className="text-red-500 text-sm italic">
                  {errors.awayScore.message}
                </p>
              )
            }
            <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 mt-5 rounded hover:bg-blue-700">
              {loading ? '登録中': '登録する'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}