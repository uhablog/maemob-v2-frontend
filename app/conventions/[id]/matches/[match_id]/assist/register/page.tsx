'use client';

import StepIndicator from "@/components/StepIndicator";
import { useMatchContext } from "@/context/MatchContext";
import usePostData from "@/hooks/usePostData";
import { Scorer } from "@/types/scorer";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm, useFieldArray } from "react-hook-form";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

type RegisterAssist = {
  name: string;
  player_id: string;
};

interface IAssistForm {
  homeAssists: RegisterAssist[];
  awayAssists: RegisterAssist[];
}

export default function AssistPage() {
  const { match } = useMatchContext();
  const params = useParams<{ id: string; match_id: string }>();
  const router = useRouter();

  const { register, handleSubmit, control, formState: { errors } } = useForm<IAssistForm>({
    defaultValues: {
      homeAssists: [],
      awayAssists: [],
    },
  });

  const { loading, postData } = usePostData<Scorer[], IAssistForm>(`${API_ENDPOINT}/api/conventions/${params.id}/matches/${params.match_id}/assists`);

  const {
    fields: homeFields,
    append: appendHomeAssist,
    remove: removeHomeAssist
  } = useFieldArray({
    control,
    name: "homeAssists"
  });

  const {
    fields: awayFields,
    append: appendAwayAssist,
    remove: removeAwayAssist
  } = useFieldArray({
    control,
    name: "awayAssists"
  });

  const onSubmit: SubmitHandler<IAssistForm> = async (formData) => {
    const result = await postData(formData);

    if (result) {
      router.push(`/conventions/${params.id}/matches/${params.match_id}/complete`);
    } else {
      window.alert('アシストの登録に失敗しました。');
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto p-6 bg-blue-50 border rounded">
        <StepIndicator currentStep={3} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* ホームチームのアシスト入力欄 */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">ホームチームのアシスト</h3>
            {homeFields.map((field, index) => (
              <div key={field.id} className="mb-2 flex items-center">
                <input
                  type="text"
                  {...register(`homeAssists.${index}.name`, { required: "選手名を入力してください。" })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder={`アシスト者 ${index + 1}`}
                />
                <input
                  type="hidden"
                  {...register(`homeAssists.${index}.player_id`)}
                  value={match?.homePlayerId}
                />
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => removeHomeAssist(index)}
                >
                  削除
                </button>
                {errors.homeAssists?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.homeAssists[index].name?.message}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={() => appendHomeAssist({ name: "", player_id: match?.homePlayerId ? match?.homePlayerId : '' })}
            >
              アシストを追加
            </button>
          </div>

          {/* アウェイチームのアシスト入力欄 */}
          <div className="mb-4">
            <h3 className="text-lg font-bold">アウェイチームのアシスト</h3>
            {awayFields.map((field, index) => (
              <div key={field.id} className="mb-2 flex items-center">
                <input
                  type="text"
                  {...register(`awayAssists.${index}.name`, { required: "選手名を入力してください。" })}
                  className="w-full px-3 py-2 border rounded"
                  placeholder={`アシスト者 ${index + 1}`}
                />
                <input
                  type="hidden"
                  {...register(`awayAssists.${index}.player_id`)}
                  value={match?.awayPlayerId}
                />
                <button
                  type="button"
                  className="ml-2 text-red-500"
                  onClick={() => removeAwayAssist(index)}
                >
                  削除
                </button>
                {errors.awayAssists?.[index]?.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.awayAssists[index].name?.message}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
              onClick={() => appendAwayAssist({ name: "", player_id: match?.awayPlayerId? match?.awayPlayerId: '' })}
            >
              アシストを追加
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "登録中..." : "登録"}
          </button>
        </form>
      </div>
    </>
  );
}
