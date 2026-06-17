import { useState, type FormEvent } from 'react'

import { usersApi } from '../services/api.js'
import type { UserRecord } from '../types/user'

interface LoginProps {
  onAuthenticated: (user: UserRecord) => void
  onSwitchToSignup: () => void
}

export function Login({ onAuthenticated, onSwitchToSignup }: LoginProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const user = await usersApi.findByEmail(email.trim())
      onAuthenticated(user)
    } catch (err) {
      const status = typeof err === 'object' && err && 'status' in err ? err.status : null

      if (status === 404) {
        setError('No account found for that email. Create one first.')
      } else if (status === 400) {
        setError('Enter a valid email address.')
      } else {
        setError(err instanceof Error ? err.message : 'Unable to log in right now.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-transparent px-4 py-6 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl items-center gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/*<section className="overflow-hidden rounded-sm border border-white/10 bg-white/8 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-10">*/}

        {/*  <div className="mt-8 grid gap-4 sm:grid-cols-3">*/}
        {/*    {[*/}
        {/*      ['Backend lookup', 'Email is checked through the API.'],*/}
        {/*      ['Scalable flow', 'Auth UI, data UI, and API stay separate.'],*/}
        {/*      ['Clean dev setup', 'Tailwind and Vite keep the UI lightweight.'],*/}
        {/*    ].map(([title, text]) => (*/}
        {/*      <article*/}
        {/*        className="rounded-sm border border-white/10 bg-slate-950/40 p-4"*/}
        {/*        key={title}*/}
        {/*      >*/}
        {/*        <h2 className="text-sm font-semibold text-white">{title}</h2>*/}
        {/*        <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>*/}
        {/*      </article>*/}
        {/*    ))}*/}
        {/*  </div>*/}
        {/*</section>*/}

        <section className="rounded-sm border border-white/10 bg-slate-950/70 p-6 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
          <div className="flex rounded-sm border border-white/10 bg-white/5 p-1 text-sm font-medium text-slate-300">
            <button
              type="button"
              className="flex-1 rounded-sm bg-sky-500 px-4 py-2.5 text-white shadow-lg shadow-sky-500/20 transition"
              aria-current="page"
            >
              Login
            </button>
            <button
              type="button"
              className="flex-1 rounded-sm px-4 py-2.5 transition hover:text-white"
              onClick={onSwitchToSignup}
            >
              Sign up
            </button>
          </div>

          <form className="mt-6 grid gap-4" onSubmit={submit}>
            <div>
              <h2 className="text-2xl font-bold text-white">Welcome back</h2>
              <p className="mt-2 text-sm text-slate-400">
                Use the email from a user record in the database.
              </p>
            </div>

            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Email address
              <input
                className="rounded-sm border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:bg-white/10 focus:ring-4 focus:ring-sky-500/10"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@email.com"
                autoComplete="email"
                required
              />
            </label>

            {error ? (
              <p className="rounded-sm border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 inline-flex items-center justify-center rounded-sm bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Checking account...' : 'Open dashboard'}
            </button>

            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
            >
              Need an account? Go to sign up.
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}