"use client";

import Link from "next/link";
import { login } from "./actions";
import { loginAsGuest } from "./actions";
import LoginMessage from "./LoginMessage";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-400">
      <div className="w-full max-w-2xl bg-white rounded-2xl p-8 shadow-md">
        <h1 className="mb-6 text-center font-bold text-gray-600 text-2xl">
          AI Persona
        </h1>
        <form className="space-y-6">
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
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus:outline-none focus:ring-2"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              formAction={login}
              className="flex-1 justify-center rounded-md bg-gray-400 py-2 px-4 font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Log in
            </button>
          </div>
        </form>

        <form
          action={loginAsGuest}
          className="flex items-center justify-between gap-4"
        >
          <button className="flex-1 justify-center rounded-md bg-gray-400 py-2 px-4 font-semibold text-white shadow-sm hover:bg-indigo-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-5">
            Guest login
          </button>
        </form>
        <div className="flex mt-4 text-center">
          <Link href="/signup" className="text-gray-600 hover:underline flex-1">
            Not a member yet?
          </Link>

          <Link
            href="/auth/forgot-password"
            className="text-gray-600 hover:underline flex-1"
          >
            Did you forget your password?
          </Link>
        </div>
        <Suspense fallback={null}>
          <LoginMessage />
        </Suspense>
      </div>
    </div>
  );
}
