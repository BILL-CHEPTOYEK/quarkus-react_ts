import { useCallback, useEffect, useMemo, useState } from 'react'

import { usersApi } from '../services/api.js'
import type { UserFormValues, UserRecord } from '../types/user'

interface DashboardProps {
  user: UserRecord
  onSignOut: () => void
}

type Section = 'overview' | 'users' | 'stats'

const emptyDraft: UserFormValues = {
  name: '',
  email: '',
}

export function Dashboard({ user, onSignOut }: DashboardProps) {
  const [section, setSection] = useState<Section>('overview')
  const [users, setUsers] = useState<UserRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [selectedUserId, setSelectedUserId] = useState<number>(user.id)
  const [draft, setDraft] = useState<UserFormValues>({
    name: user.name,
    email: user.email,
  })

  const loadUsers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const result = await usersApi.list()
      const nextUsers = Array.isArray(result) ? result : []

      setUsers(nextUsers)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load users.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(loadUsers)
  }, [loadUsers])

  const selectedUser = useMemo(
    () => users.find((item) => item.id === selectedUserId) ?? null,
    [users, selectedUserId],
  )

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((item) => {
      return (
        item.name.toLowerCase().includes(query) ||
        item.email.toLowerCase().includes(query)
      )
    })
  }, [search, users])

  const cards = useMemo(() => {
    const domains = new Map<string, number>()

    for (const item of users) {
      const domain = item.email.split('@')[1] ?? 'unknown'
      domains.set(domain, (domains.get(domain) ?? 0) + 1)
    }

    const topDomain = [...domains.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? 'n/a'

    return [
      { label: 'Total users', value: String(users.length) },
      { label: 'Top domain', value: topDomain },
      {
        label: 'Average name length',
        value: users.length
          ? Math.round(users.reduce((sum, item) => sum + item.name.length, 0) / users.length)
          : 0,
      },
      { label: 'Selected user', value: selectedUser?.name ?? 'None selected' },
    ]
  }, [selectedUser, users])

  const selectUser = (item: UserRecord) => {
    setSelectedUserId(item.id)
    setDraft({ name: item.name, email: item.email })
    setSection('users')
  }

  const updateSelectedUser = async () => {
    if (!selectedUser) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      const updated = await usersApi.update(selectedUser.id, draft)
      setUsers((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setDraft({ name: updated.name, email: updated.email })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update the selected user.')
    } finally {
      setSaving(false)
    }
  }

  const deleteSelectedUser = async () => {
    if (!selectedUser) {
      return
    }

    const confirmed = window.confirm(`Delete ${selectedUser.name}?`)

    if (!confirmed) {
      return
    }

    setSaving(true)
    setError(null)

    try {
      await usersApi.remove(selectedUser.id)
      const remaining = users.filter((item) => item.id !== selectedUser.id)
      setUsers(remaining)

      if (remaining[0]) {
        setSelectedUserId(remaining[0].id)
        setDraft({ name: remaining[0].name, email: remaining[0].email })
      } else {
        setSelectedUserId(user.id)
        setDraft(emptyDraft)
      }

      if (selectedUser.id === user.id) {
        onSignOut()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to delete the selected user.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen px-4 py-4 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-360 gap-4 xl:gap-6">
        <aside className="flex w-full max-w-[320px] flex-col gap-1 rounded-sm bg-slate-650/70 p-5 backdrop-blur-xl lg:w-[320px]">
          <div>
            <div className="inline-flex rounded-none border border-black bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-black">
              Dashboard
            </div>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
              Welcome, {user.name}
            </h1>
            <p className="mt-2 text-sm text-slate-400">{user.email}</p>
          </div>

          <nav className="grid gap-2">
            {[
              ['overview', 'Overview'],
              ['users', 'Users'],
              ['stats', 'Stats'],
            ].map(([key, label]) => (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key as Section)}
                className={`rounded-none px-4 py-3 text-left text-sm font-medium transition ${
                  section === key
                    ? 'bg-sky-700 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg- hover:text-white'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="rounded-none border border-white/20 bg-white/5 p-4">
            <label className="grid gap-2 text-sm font-medium text-slate-200">
              Search users
              <input
                className="rounded-none bg-slate-650/60 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:ring-4 focus:ring-sky-500/10"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name or email"
              />
            </label>

            <div className="mt-4 max-h-[38vh] overflow-auto pr-1">
              {filteredUsers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectUser(item)}
                  className={`mb-2 w-full rounded-none px-4 py-3 text-left transition last:mb-0 ${
                    selectedUserId === item.id
                      ? 'border-sky-400/40 bg-sky-500/10 text-white'
                      : 'bg-slate-950/40 text-slate-300 hover:bg- hover:text-white'
                  }`}
                >
                  <span className="block text-sm font-semibold">{item.name}</span>
                  <span className="block text-xs text-slate-500">{item.email}</span>
                </button>
              ))}

              {!loading && filteredUsers.length === 0 ? (
                <p className="rounded-none border border-dashed bg-slate-650/40 px-4 py-6 text-sm text-slate-400">
                  No users match the current search.
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="mt-auto rounded-none border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg- hover:text-white"
          >
            Sign out
          </button>
        </aside>

        <section className="flex min-w-0 flex-1 flex-col gap-4">
          <header className="rounded-none border border-emerald-950 bg-white/8 p-5 sm:p-6">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <h2 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                  {section === 'overview' ? 'Overview' : section === 'users' ? 'Users' : 'User stats'}
                </h2>
                <p className="mt-2 max-w-3xl text-xs leading-7 text-slate-400 sm:text-base">
                  The sidebar controls the main section. Click a user to inspect their
                  data, update it, or remove it from the database.
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadUsers()}
                className="rounded-none bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400"
              >
                Refresh
              </button>
            </div>
          </header>

          {error ? (
            <p className="rounded-none border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
              {error}
            </p>
          ) : null}

          {section === 'overview' ? (
            <section className="grid gap-4 xl:grid-cols-2">
              {cards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-none bg-slate-650/60 p-5"
                >
                  <span className="text-sm font-medium text-slate-400">{card.label}</span>
                  <div className="mt-3 text-3xl font-extrabold tracking-tight text-white">
                    {card.value}
                  </div>
                </article>
              ))}
            </section>
          ) : null}

          {section === 'users' ? (
            <section className="grid gap-4 xl:grid-cols-[1fr_0.9fr]">
              <article className="rounded-none bg-slate-650/60 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-50000">
                      Selected user
                    </div>
                    <h3 className="mt-3 text font-bold text-white">
                      {selectedUser?.name ?? 'No user selected'}
                    </h3>
                    <p className="mt-2 text-sm text-slate-400">
                      {selectedUser?.email ?? 'Choose a user from the sidebar.'}
                    </p>
                  </div>

                  {selectedUser ? (
                    <span className="rounded-sm bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                      ID {selectedUser.id}
                    </span>
                  ) : null}
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <label className="grid gap-2 text-sm font-medium text-slate-200">
                    Name
                    <input
                      className="rounded-none bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-600/60 focus:ring-4 focus:ring-sky-500/10"
                      value={draft.name}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, name: event.target.value }))
                      }
                      placeholder="Full name"
                    />
                  </label>

                  <label className="grid gap-2 text-sm font-medium text-slate-200">
                    Email
                    <input
                      className="rounded-none bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-sky-400/60 focus:ring-4 focus:ring-sky-500/10"
                      value={draft.email}
                      onChange={(event) =>
                        setDraft((current) => ({ ...current, email: event.target.value }))
                      }
                      placeholder="email@company.com"
                    />
                  </label>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={!selectedUser || saving}
                    onClick={() => void updateSelectedUser()}
                    className="rounded-none bg-sky-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving ? 'Saving...' : 'Update user'}
                  </button>
                  <button
                    type="button"
                    disabled={!selectedUser || saving}
                    onClick={() => void deleteSelectedUser()}
                    className="rounded-none bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete user
                  </button>
                </div>
              </article>

              <article className="rounded-none bg-slate-950/60 p-5">
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">
                  User list
                </div>
                <div className="mt-4 max-h-[58vh] overflow-auto pr-1">
                  {filteredUsers.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => selectUser(item)}
                      className={`mb-3 w-full rounded-none px-4 py-3 text-left transition last:mb-0 ${
                        selectedUserId === item.id
                          ? 'border-sky-400/40 bg-sky-500/10 text-white'
                          : 'bg-white/5 text-slate-300 hover:bg- hover:text-white'
                      }`}
                    >
                      <span className="block text-sm font-semibold">{item.name}</span>
                      <span className="block text-xs text-slate-500">{item.email}</span>
                    </button>
                  ))}
                </div>
              </article>
            </section>
          ) : null}

          {section === 'stats' ? (
            <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {cards.map((card) => (
                <article
                  key={card.label}
                  className="rounded-none bg-slate-950/60 p-5"
                >
                  <span className="text-sm font-medium text-slate-400">{card.label}</span>
                  <div className="mt-3 text font-extrabold tracking-tight text-white">
                    {card.value}
                  </div>
                </article>
              ))}
            </section>
          ) : null}
        </section>
      </div>
    </main>
  )
}