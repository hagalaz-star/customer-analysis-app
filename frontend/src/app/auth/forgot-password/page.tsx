import { sendResetLink } from "@/app/login/actions";
import Link from "next/link";

export default function ForgoPasswordPage() {
  return (
    <div className="flex min-h-screen text-center justify-center items-center">
      <div className="w-full max-w-sm">
        <h1 className="text-center text-2xl mb-3 text-gray-600">
          비밀번호 찾기
        </h1>
        <p className="block text-sm font-medium text-gray-700 mb-5">
          가입하신 이메일 주소를 입력하시면, 비밀번호 재설정 링크를
          보내드립니다.
        </p>

        <form action={sendResetLink} className="mt-8 space-y-6">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            required
            name="email"
            placeholder="email@example.com"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex items-center justify-center mt-10">
            <button className="flex justify-center rounded-md bg-gray-400 py-2 px-10 font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              send
            </button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-sm font-medium text-indigo-600 hover:underline"
          >
            로그인 페이지로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}
