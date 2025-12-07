'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { listDirectoryProfiles, ROLE_DEFINITIONS } from '@/lib/rbac';

const MOCK_PASSWORD = 'admin123';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('admin@easy11.com');
  const [password, setPassword] = useState(MOCK_PASSWORD);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const directoryProfiles = listDirectoryProfiles();
  const callbackUrl = searchParams?.get('callbackUrl') || '/dashboard';

  const attemptSignIn = async (payload: { email: string; password: string }) => {
    setError('');
    setLoading(true);

    try {
      const result = await signIn('easy11-directory', {
        ...payload,
        redirect: false,
      });

      if (result?.error) {
        setError('Unable to authenticate with the Easy11 directory mock.');
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await attemptSignIn({ email, password });
  };

  const handleMockSso = async (targetEmail: string) => {
    setEmail(targetEmail);
    setPassword(MOCK_PASSWORD);
    await attemptSignIn({ email: targetEmail, password: MOCK_PASSWORD });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-6 rounded-3xl border border-white/10 bg-white/10 p-10 shadow-2xl backdrop-blur-md md:p-14 lg:p-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-900 shadow-lg">
            E11
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Easy11 Admin SSO (Preview)
          </h1>
          <p className="max-w-2xl text-sm text-slate-200">
            This environment simulates Google Workspace / Okta SSO. Choose a persona below or use your
            directory email + password to continue. Every sign-in is captured in the hash-chained audit log.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {directoryProfiles.map((profile) => {
            const roleMeta = ROLE_DEFINITIONS[profile.role];
            return (
              <button
                key={profile.id}
                type="button"
                disabled={loading}
                onClick={() => handleMockSso(profile.email)}
                className="group flex h-full flex-col rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/10 disabled:opacity-50"
              >
                <p className="text-sm font-semibold text-white">{profile.name}</p>
                <p className="text-xs text-slate-300">{profile.email}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.28em] text-slate-400">
                  {roleMeta.label}
                </p>
                <p className="mt-2 text-xs text-slate-200">{roleMeta.description}</p>
                <span className="mt-4 inline-flex w-fit rounded-full border border-white/20 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-slate-200">
                  Auto sign-in • Mock SSO
                </span>
              </button>
            );
          })}
        </div>

        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-8 text-white">
          <h2 className="text-lg font-semibold">Sign in with directory credentials</h2>
          <p className="mt-1 text-xs text-slate-300">
            Supports password + TOTP mocks. Replace with real IdP once credentials are provisioned.
          </p>
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Work email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="you@easy11.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label htmlFor="password" className="text-xs uppercase tracking-[0.28em] text-slate-400">
                  Password / TOTP
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/40"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            )}

            <div className="flex flex-col items-center justify-between gap-3 md:flex-row">
              <p className="text-xs text-slate-400">
                Mock password for all personas: <span className="font-mono text-white">{MOCK_PASSWORD}</span>
              </p>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:opacity-50"
              >
                {loading ? 'Signing in…' : 'Continue'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

