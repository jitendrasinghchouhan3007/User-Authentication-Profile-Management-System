/**
 * Migration: 001_create_users_collection
 *
 * Purpose  : Initialize the `users` collection and apply the required
 *            index (unique email) in MongoDB.
 *
 * Run with : node database/migrations/001_create_users_collection.js
 *
 * Note     : MongoDB creates collections implicitly when the first document
 *            is inserted. This migration makes the intent explicit and
 *            ensures the unique email index is in place before any data
 *            is written — preventing race conditions in concurrent deployments.
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Load .env from the backend directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') })

const MIGRATION_NAME = '001_create_users_collection'
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/profile_management_system'

async function up() {
  const conn = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  })
  const db = conn.connection.db

  console.log(`[${MIGRATION_NAME}] Connected to: ${MONGO_URI}`)

  // ── Step 1: Create the collection explicitly ──────────────────────────────
  const existingCollections = await db
    .listCollections({ name: 'users' })
    .toArray()

  if (existingCollections.length === 0) {
    await db.createCollection('users')
    console.log(`[${MIGRATION_NAME}] ✅ Collection 'users' created.`)
  } else {
    console.log(`[${MIGRATION_NAME}] ℹ️  Collection 'users' already exists — skipping creation.`)
  }

  // ── Step 2: Apply unique index on email ───────────────────────────────────
  const usersCollection = db.collection('users')

  await usersCollection.createIndex(
    { email: 1 },
    {
      unique: true,
      name: 'email_1',
      background: true,
    }
  )
  console.log(`[${MIGRATION_NAME}] ✅ Unique index on 'email' applied.`)

  // ── Step 3: Apply index on createdAt (for pagination queries) ─────────────
  await usersCollection.createIndex(
    { createdAt: -1 },
    { name: 'createdAt_-1', background: true }
  )
  console.log(`[${MIGRATION_NAME}] ✅ Descending index on 'createdAt' applied.`)

  console.log(`[${MIGRATION_NAME}] 🎉 Migration complete.`)
}

async function down() {
  const conn = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  })
  const db = conn.connection.db

  await db.dropCollection('users')
  console.log(`[${MIGRATION_NAME}] ↩️  Rolled back — 'users' collection dropped.`)
}

// ── Entry point ───────────────────────────────────────────────────────────────
const action = process.argv[2] // 'up' | 'down'

try {
  if (action === 'down') {
    await down()
  } else {
    await up()
  }
} catch (err) {
  console.error(`[${MIGRATION_NAME}] ❌ Migration failed:`, err.message)
  process.exitCode = 1
} finally {
  await mongoose.connection.close()
}
