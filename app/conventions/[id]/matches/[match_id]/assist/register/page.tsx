'use client';
import StepIndicator from "@/components/StepIndicator";
import { useMatchContext } from "@/context/MatchContext";
// import usePostData from "@/hooks/usePostData";
// import { Assist } from "@/types/assist";
// import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

// const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

type RegisterAssist = {
  name: string
  player_id: string
}

interface IAssistForm {
  assist: RegisterAssist[]
}

export default function Page() {

  const { match } = useMatchContext();
  // const params = useParams<{ id: string, match_id: string}>();
  // const router = useRouter();
  const totalScores = Number(match?.homeScore ?? 0) + Number(match?.awayScore ?? 0);
  const { register, handleSubmit, formState: { errors } } = useForm<IAssistForm>({
    defaultValues: {
      assist: Array.from({ length: totalScores }, () => ({
        name: "",
        player_id: ""
      }))
    }
  });
  // const { loading, postData } = usePostData<Assist[], RegisterAssist[]>(`${API_ENDPOINT}/api/conventions/${params.id}/matches/${params.match_id}/assist`);

  const onSubmit: SubmitHandler<IAssistForm> = async (formData) => {
    // const result = await postData(formData.assist);

    // if (result) {
    //   router.push(`/conventions/${params.id}/matches/${params.match_id}/mom/register`);
    // } else {
    //   window.alert('アシストの登録に失敗しました。');
    // }

    console.log(formData);
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-blue-50 border rounded">
        <StepIndicator currentStep={3} />
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <h3 className="text-lg font-bold">ホームチームのアシスト</h3>
            {Array.from({ length: match?.awayScore ?? 0 }).map(( _, index) => (
              <div key={index} className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-1">
                  {`得点者 ${index + 1}`}
                </label>
                <input
                  type="text"
                  {...register(`assist.${index}.name`)}
                  className="w-full px-3 py-2 border rounded"
                  // onChange={() => {
                  //   setValue(`assist.${index}.player_id`, match?.homePlayerId ?? '')
                  // }}
                />
                <input type="hidden" {...register(`assist.${index}.player_id`)} value={match?.homePlayerId} />
                {errors.assist?.[index]?.name && (
                  <p>{errors.assist?.[index]?.name.message}</p>
                )}
              </div>
            ))}
          </div>
          <button
            type="submit"
            // disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            {/* {loading ? '登録中': '登録'} */}
            登録
          </button>
        </form>
      </div>
    </>
  )

};