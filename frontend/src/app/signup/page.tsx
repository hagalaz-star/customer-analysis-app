import { signup } from "@/app/login/actions";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-400">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-md">
        <h1 className="mb-6 text-center font-bold text-gray-600 text-2xl">
          SIGNUP
        </h1>
        <form className="space-y-6">
          <div>
            <label
              htmlFor="nickName"
              className="text-md font-medium text-gray-700 block"
            >
              NickName
            </label>
            <input
              id="nickName"
              name="nickName"
              type="text"
              required
              placeholder="Please enter your nickname"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-md font-medium text-gray-700 block"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="email@example.com"
              className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-900 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className=" block text-md font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="(at least 8 characters)"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              formAction={signup}
              className="flex-1 justify-center rounded-md bg-gray-400 py-2 px-4 font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Register and verify your email
            </button>
          </div>
          <Link
            href="/login"
            className="block w-full rounded-md border border-gray-300 bg-white py-2 px-4 text-center text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
          >
            로그인 페이지로 돌아가기
          </Link>
        </form>
      </div>
    </div>
  );
}
