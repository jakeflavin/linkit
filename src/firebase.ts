/**
 * The only module that touches the Firebase SDK's setup. Everything else
 * talks to `lib/api.ts`.
 *
 * `db` is null when no config is present, which is the normal state for a
 * fresh clone — the app then runs read-only against an empty board and says
 * so, rather than crashing.
 */

import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, getFirestore, type Firestore } from 'firebase/firestore'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const EMULATOR_PORT = 8080

function connect(): Firestore | null {
  // `npm run dev:emulator` points the app at the local Firestore, so the
  // board is developable without touching the live project.
  const useEmulator = import.meta.env.VITE_FIRESTORE_EMULATOR === '1'
  if (!useEmulator && (!config.apiKey || !config.projectId || !config.appId)) return null

  try {
    const app = initializeApp(useEmulator ? { projectId: 'linkit-web' } : config)
    const firestore = getFirestore(app)
    if (useEmulator) connectFirestoreEmulator(firestore, '127.0.0.1', EMULATOR_PORT)
    return firestore
  } catch {
    return null
  }
}

export const db = connect()
export const isConfigured = db !== null
