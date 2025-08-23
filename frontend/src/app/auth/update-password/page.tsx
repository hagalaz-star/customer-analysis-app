"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      setIsSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 6자 이상이어야 합니다.");
      setIsSubmitting(false);
      return;
    }

    // 이제 클라이언트용 Supabase 클라이언트를 사용합니다.
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
    } else {
      // 성공 시, 성공 메시지와 함께 로그인 페이지로 보냅니다.
      router.push(
        "/login?message=비밀번호가 성공적으로 변경되었습니다. 다시 로그인해주세요."
      );
    }

    setIsSubmitting(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          비밀번호 재설정
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              새로운 비밀번호 (6자 이상)
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호 확인
            </label>
            <input
              id="passwordConfirm"
              name="passwordConfirm"
              type="password"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50"
            >
              {isSubmitting ? "변경 중..." : "비밀번호 변경하기"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-center">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
