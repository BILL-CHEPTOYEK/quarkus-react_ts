import { useState, type FormEvent } from 'react'

import { usersApi } from '../services/api.js'
import type { UserRecord } from '../types/user'

interface SignupProps {
  onAuthenticated: (user: UserRecord) => void
  onSwitchToLogin: () => void
}

export function Signup({ onAuthenticated, onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await usersApi.create({
        name: name.trim(),
        email: email.trim(),
      })

      onAuthenticated(user)
    } catch (err) {
      const status = typeof err === 'object' && err && 'status' in err ? err.status : null

      if (status === 409) {
        setError('This email already exists. Try logging in instead.')
      } else {
        setError(err instanceof Error ? err.message : 'Unable to create the account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="overflow-hidden rounded-4xl border border-white/10 bg-white/8 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">
          <div className="inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-emerald-200">
            Create a database user
          </div>
          <h1 className="mt-6 max-w-xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            Create an account that becomes a real record in the backend.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300 sm:text-base">
            Signup creates a new user row. That keeps the UI honest and avoids
            hardcoded accounts.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ['One source of truth', 'The backend user table stores the account.'],
              ['No fake auth', 'The UI does not invent users locally.'],
              ['Easy growth', 'Later auth can add passwords and tokens.'],
            ].map(([title, text]) => (
              <article
                className="rounded-2xl border border-white/10 bg-slate-950/40 p-4"
                key={title}
              >
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-4xl border border-white/10 bg-slate-950/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-sm font-medium text-slate-300">
            <button
              type="button"
              className="flex-1 rounded-full px-4 py-2.5 transition hover:text-white"
              onClick={onSwitchToLogin}
            >
              Login
            </button>
            <button
              type="button"
              className="flex-1 rounded-full bg-emerald-500 px-4 py-2.5 text-white shadow-lg shadow-emerald-500/20 transition"
              aria-current="page"
            >
              Sign up
            </button>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <div>
              <h2 className="text-2xl font-bold text-white">Create account</h2>
              <p className="mt-2 text-sm text-slate-400">
                This creates a user in the backend, then opens the dashboard.
              </p>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Full name
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/10"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ada Lovelace"
                autoComplete="name"
                required
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Email address
              <input
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-emerald-400/60 focus:bg-white/10 focus:ring-4 focus:ring-emerald-500/10"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ada@company.com"
                autoComplete="email"
                required
              />
            </label>

            {error ? (
              <p className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create and continue'}
            </button>

            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-sm font-medium text-emerald-300 transition hover:text-emerald-200"
            >
              Already have an account? Log in.
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}