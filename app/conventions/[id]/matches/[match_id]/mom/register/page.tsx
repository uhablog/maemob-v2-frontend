'use client';

import StepIndicator from "@/components/StepIndicator";
import { useMatchContext } from "@/context/MatchContext";
import useFetchData from "@/hooks/useFetchData";
import usePostData from "@/hooks/usePostData";
import { Mom } from "@/types/mom";
import { Player } from "@/types/player";
import { useParams } from "next/navigation";
import { useRouter } from "next/router";
import { SubmitHandler, useForm } from "react-hook-form";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

type RegisterMOM = {
  player_id: string
  name: string
}

export default function Page() {

  const { match } = useMatchContext();
  const params = useParams<{id: string, match_id: string }>();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }} = useForm<RegisterMOM>();
  const { data: homePlayer } = useFetchData<Player>(`${API_ENDPOINT}/api/conventions/${params.id}/player/${match?.homePlayerId}`);
  const { data: awayPlayer } = useFetchData<Player>(`${API_ENDPOINT}/api/conventions/${params.id}/player/${match?.awayPlayerId}`);
  const { loading, postData } = usePostData<Mom, RegisterMOM>(`${API_ENDPOINT}/api/conventions/{convention_id}/matches/{match_id}/mom`);

  console.log(homePlayer);
  console.log(awayPlayer);

  const onSubmit: SubmitHandler<RegisterMOM> = async (formData) => {
    const result = await postData(formData);

    if (result) {
      router.push(`/conventions/${params.id}`);
    } else {
      window.alert('MOMの登録に失敗しました。');
      console.log(result);
    }
  }
  return (
    <>
      <div className="max-w-lg mx-auto p-6 bg-blue-50 border rounded">
        <StepIndicator currentStep={4} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold">
              MOM
            </h3>
            <label htmlFor="playerId" className="block font-bold mb-1">プレイヤーを選択</label>
            <select
              id="playerId"
              {...register("player_id", {required: "プレイヤーを選択してください"})}
              className="w-full p-2 border rounded"
            >
              <option value={""}>選択してください。</option>
              <option value={homePlayer?.id}>{homePlayer?.name}</option>
              <option value={awayPlayer?.id}>{awayPlayer?.name}</option>
            </select>
            {errors.player_id && (
              <p className="text-red-500 text-sm italic">{errors.player_id.message}</p>
            )}
            <label className="block text-gray-700 text-sm font-bold mb-1">
              {`MOM`}
            </label>
            <input
              type="text"
              {...register(`name`, {required: "名前を入力してください。"})}
              className="w-full px-3 py-2 border rounded"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {loading ? '登録中': '登録'}
          </button>
        </form>
      </div>
    </>
  )
};