'use client';

import usePostData from "@/hooks/usePostData";
import { Player } from "@/types/player";
import { useParams, useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

interface IPlayerForm {
  name: string
}

export default function Page() {

  const params = useParams<{ id: string}>();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors }} = useForm<IPlayerForm>();
  const { error, loading, postData } = usePostData<Player, IPlayerForm>(`${API_ENDPOINT}/api/conventions/${params.id}/players`);

  const onSubmit: SubmitHandler<IPlayerForm> = async (formData) => {
    const result = await postData(formData);

    if (result) {
      router.push(`/conventions/${params.id}`);
    } else {
      window.alert('登録に失敗しました');
      console.error(error);
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-blue-50 border rounded">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="mb-4">
            <label htmlFor="name" className="block font-bold mb-1">プレイヤー名</label>
            <input
              id="name"
              type="text"
              {...register("name", {
                required: "プレイヤー名を入力してください",
                min: 0,
                max: 99
              })}
              className="w-full p-2 border rounded"
            />
            {
              errors.name && (
                <p className="text-red-500 text-sm italic">
                  {errors.name.message}
                </p>
              )
            }
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 mt-5 rounded hover:bg-blue-700">
            {loading ? '登録中': '登録する'}
          </button>
        </form>
      </div>
    </>
  )
}