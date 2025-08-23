"use client";

import { useRouter } from "next/navigation";

export default function Backbutton() {
  const router = useRouter();

  return (
    <div>
      <button
        onClick={() => router.back()}
        className=" bg-gray-200 hover:bg-gray-300 font-bold rounded-2xl px-4 py-5 "
      >
        뒤로가기
      </button>
    </div>
  );
}
