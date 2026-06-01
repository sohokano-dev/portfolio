"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const PASSWORD = "sohokano";
const ONE_DAY_IN_SECONDS = 60 * 60 * 24;

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (document.cookie.includes("auth=ok")) {
      router.replace("/");
    }
  }, [router]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password !== PASSWORD) {
      setError("パスワードが違います");
      return;
    }

    document.cookie = `auth=ok; path=/; max-age=${ONE_DAY_IN_SECONDS}; samesite=lax`;
    router.replace("/");
    router.refresh();
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg-900 px-5 py-10 text-text-100">
      <div className="w-full max-w-sm rounded-card border border-border bg-bg-800 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="mb-6">
          <h1 className="text-3xl font-semibold leading-[1.2]">
            Password Required
          </h1>
          <p className="mt-3 text-sm leading-[1.8] text-text-70">
            閲覧するにはパスワードを入力してください。
          </p>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <label className="text-xs uppercase text-text-50" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value);
              if (error) {
                setError("");
              }
            }}
            className="h-11 rounded-lg border border-border bg-neutral-950 px-3 text-text-100 outline-none transition-colors placeholder:text-text-50 focus:border-neutral-700"
            placeholder="Enter password"
          />
          {error ? (
            <p className="text-xs text-red-400">{error}</p>
          ) : null}
          <button
            type="submit"
            className="mt-2 h-11 rounded-lg bg-text px-4 text-sm font-medium text-bg transition-opacity hover:opacity-90"
          >
            Enter
          </button>
        </form>
      </div>
    </main>
  );
}
