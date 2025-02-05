'use client';

import usePostData from "@/hooks/usePostData";
import { useRouter } from "next/navigation";
import { SubmitHandler, useForm } from "react-hook-form";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT ? process.env.NEXT_PUBLIC_API_ENDPOINT : 'http://localhost:3000';

interface IConventionForm {
  name: string
  held_date: string
}

type AddConventionResponse = {
  id: string
  name: string
  held_date: string
}

export default function Page() {

  const { register, handleSubmit, formState: { errors } } = useForm<IConventionForm>();
  const { loading, error, postData } = usePostData<AddConventionResponse, IConventionForm>(`${API_ENDPOINT}/api/conventions`);
  const router = useRouter();

  const onSubmit: SubmitHandler<IConventionForm> = async (data) => {
    await postData(data);

    if (!error) {
      router.push('/');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-6 bg-blue-50 border rounded">
        <h1 className="text-2xl font-bold mb-4">大会登録</h1>
        <div className="mb-4">
          <label htmlFor="text" className="block font-bold mb-1">大会名</label>
          <input
            type="text"
            {...register("name", { required: "大会名を入力してください。" })}
            className="w-full p-2 border rounded"
          />
          { errors.name && (
            <p className="text-red-500 text-sm italic">
              {errors.name.message}
            </p>
          )}
          <label htmlFor="text" className="block font-bold mb-1">開催日</label>
          <input
            type="date"
            {...register("held_date", { required: "開催日を入力してください。" })}
            className="w-full p-2 border rounded"
          />
          { errors.held_date && <p className="text-red-500 text-sm italic">{errors.held_date.message}</p>}
          <button type="submit" disabled={loading} className="w-full bg-blue-500 text-white py-2 mt-5 rounded hover:bg-blue-700">
            {loading ? 'Submitting...': '登録する'}
          </button>
        </div>
      </form>
      {error && <p className="text-red-500 italic">{error}</p>}
    </>
  )
};