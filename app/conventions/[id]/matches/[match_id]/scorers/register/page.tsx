'use client';

import StepIndicator from "@/components/StepIndicator";
import { useMatchContext } from "@/context/MatchContext";
import usePostData from "@/hooks/usePostData";
import { Scorer } from "@/types/scorer";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

type RegisterScorer = {
  name: string
  player_id: string
}

interface IScorerForm {
  scorers: RegisterScorer[]
}

export default function Page() {

  const { match } = useMatchContext();
  const params = useParams<{ id: string, match_id: string}>();
  const router = useRouter();
  const totalScores = Number(match?.homeScore ?? 0) + Number(match?.awayScore ?? 0)
  const { register, handleSubmit, formState: { errors } } = useForm<IScorerForm>({
    defaultValues: {
      scorers: Array.from({ length: totalScores}, () => ({
        name: "",
        player_id: "",
      })),
    },
  });
  const { loading, postData } = usePostData<Scorer[], RegisterScorer[]>(`${API_ENDPOINT}/api/conventions/${params.id}/matches/${params.match_id}/scorers`)

  const onSubmit: SubmitHandler<IScorerForm> = async (formData) => {
    console.log(formData);
    const result = await postData(formData.scorers);

    if (result) {
      router.push(`/conventions/${params.id}/matches/${params.match_id}/assist/register`);
    } else {
      window.alert('試合の登録に失敗しました。');
      console.log(result);
    }
  };

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-blue-50 border rounded">
        <StepIndicator currentStep={2} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold">ホームチームの得点者</h3>
            {Array.from({ length: match?.homeScore ?? 0 }).map((_, index) => (
              <div key={index} className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  {`得点者 ${index + 1}`}
                </label>
                <input
                  type="text"
                  {...register(`scorers.${index}.name`, { required: "選手名を入力してください。"})}
                  className="w-full px-3 py-2 border rounded"
                  // onChange={(e) => {
                  //   setValue(`scorers.${index}.player_id`, match?.homePlayerId ?? '');
                  // }}
                />
                <input type="hidden" {...register(`scorers.${index}.player_id`)} value={match?.homePlayerId} />
                {errors.scorers?.[index]?.name && (
                  <p className="text-red-500 text-sx mt-1">{errors.scorers?.[index]?.name?.message}</p>
                )}
              </div>
            ))}
          </div>
          {/* アウェイチームの得点者入力欄 */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">アウェイチームの得点者</h3>
            {Array.from({ length: match?.awayScore ?? 0 }).map((_, index) => {
              const scorerIndex = Number(match?.homeScore ?? 0) + index;
              return (
                <div key={`away-${index}`} className="mb-2">
                  <label className="block text-gray-700 text-sm font-bold mb-1">
                    {`得点者 ${index + 1}`}
                  </label>
                  <input
                    type="text"
                    {...register(`scorers.${scorerIndex}.name`, { required: "選手名を入力してください。" })}
                    className="w-full px-3 py-2 border rounded"
                    // onChange={(e) => {
                    //   setValue(`scorers.${scorerIndex}.player_id`, match?.awayPlayerId ?? '');
                    // }}
                  />
                  <input type="hidden" {...register(`scorers.${scorerIndex}.player_id`)} value={match?.awayPlayerId} />
                  {errors.scorers?.[scorerIndex]?.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.scorers[scorerIndex].name?.message}</p>
                  )}
                </div>
              );
            })}
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
}