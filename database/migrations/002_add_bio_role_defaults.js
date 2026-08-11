/**
 * Migration: 002_add_bio_role_defaults
 *
 * Purpose  : Back-fill default values for `bio` and `role` on any existing
 *            user documents that were created before these fields were added
 *            to the schema.
 *
 *            - bio  : defaults to "Writes occasionally and reads a lot."
 *            - role : defaults to "user"
 *
 * Run with : node database/migrations/002_add_bio_role_defaults.js
 *            node database/migrations/002_add_bio_role_defaults.js down
 *
 * Safe     : Uses MongoDB's $setOnInsert / $set with $exists checks so that
 *            existing values are never overwritten.
 */

import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../../backend/.env') })

const MIGRATION_NAME = '002_add_bio_role_defaults'
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/profile_management_system'

const BIO_DEFAULT = 'Writes occasionally and reads a lot.'
const ROLE_DEFAULT = 'user'

async function up() {
  const conn = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  })
  const db = conn.connection.db
  const users = db.collection('users')

  console.log(`[${MIGRATION_NAME}] Connected to: ${MONGO_URI}`)

  // ── Back-fill missing `bio` fields ────────────────────────────────────────
  const bioResult = await users.updateMany(
    { bio: { $exists: false } },
    { $set: { bio: BIO_DEFAULT } }
  )
  console.log(
    `[${MIGRATION_NAME}] ✅ bio default applied to ${bioResult.modifiedCount} document(s).`
  )

  // ── Back-fill missing `role` fields ───────────────────────────────────────
  const roleResult = await users.updateMany(
    { role: { $exists: false } },
    { $set: { role: ROLE_DEFAULT } }
  )
  console.log(
    `[${MIGRATION_NAME}] ✅ role default applied to ${roleResult.modifiedCount} document(s).`
  )

  // ── Validate allowed role values ──────────────────────────────────────────
  const invalidRoles = await users
    .find({ role: { $nin: ['user', 'admin'] } })
    .toArray()

  if (invalidRoles.length > 0) {
    console.warn(
      `[${MIGRATION_NAME}] ⚠️  ${invalidRoles.length} document(s) have unrecognised role values. ` +
        `Review and correct manually.`
    )
  } else {
    console.log(`[${MIGRATION_NAME}] ✅ All role values are valid.`)
  }

  console.log(`[${MIGRATION_NAME}] 🎉 Migration complete.`)
}

async function down() {
  const conn = await mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 8000,
  })
  const db = conn.connection.db
  const users = db.collection('users')

  // Remove the fields that were added (only if they equal the default value
  // to avoid destroying user-set data during a rollback)
  const bioRollback = await users.updateMany(
    { bio: BIO_DEFAULT },
    { $unset: { bio: '' } }
  )
  const roleRollback = await users.updateMany(
    { role: ROLE_DEFAULT },
    { $unset: { role: '' } }
  )

  console.log(
    `[${MIGRATION_NAME}] ↩️  Rolled back bio on ${bioRollback.modifiedCount} doc(s), ` +
      `role on ${roleRollback.modifiedCount} doc(s).`
  )
}

// ── Entry point ───────────────────────────────────────────────────────────────
const action = process.argv[2]

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
