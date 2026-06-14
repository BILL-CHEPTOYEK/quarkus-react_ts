import { useState } from 'react'

import { Dashboard } from './pages/dashboard'
import { Login } from './pages/login'
import { Signup } from './pages/signup'
import type { UserRecord } from './types/user'

type Screen = 'login' | 'signup'

const sessionKey = 'quarkus-react-session-user'

function readSession(): UserRecord | null {
  const stored = window.localStorage.getItem(sessionKey)

  if (!stored) {
    return null
  }

  try {
    return JSON.parse(stored) as UserRecord
  } catch {
    return null
  }
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('login')
  const [session, setSession] = useState<UserRecord | null>(() =>
    typeof window === 'undefined' ? null : readSession(),
  )

  const handleAuthenticated = (user: UserRecord) => {
    window.localStorage.setItem(sessionKey, JSON.stringify(user))
    setSession(user)
  }

  const handleSignOut = () => {
    window.localStorage.removeItem(sessionKey)
    setSession(null)
    setScreen('login')
  }

  if (session) {
    return <Dashboard user={session} onSignOut={handleSignOut} />
  }

  return screen === 'login' ? (
    <Login
      onAuthenticated={handleAuthenticated}
      onSwitchToSignup={() => setScreen('signup')}
    />
  ) : (
    <Signup
      onAuthenticated={handleAuthenticated}
      onSwitchToLogin={() => setScreen('login')}
    />
  )
}