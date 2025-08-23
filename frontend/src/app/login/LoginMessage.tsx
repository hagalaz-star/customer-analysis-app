"use client";

import { useSearchParams } from "next/navigation";

export default function LoginMessage() {
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const errorMessage = searchParams.get("error");

  return (
    <div>
      {/* 성공 또는 에러 메시지를 보여주는 부분 */}
      {message && errorMessage ? (
        <div className="mt-4 rounded-md border border-green-200 bg-green-50 p-3 text-center">
          <p className="text-sm font-medium text-green-800">{message}</p>

          <p className="text-sm font-medium text-red-800">{errorMessage}</p>
        </div>
      ) : null}
    </div>
  );
}
