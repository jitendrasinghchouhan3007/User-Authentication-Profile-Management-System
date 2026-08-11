import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { pathToFileURL } from 'node:url'

import { connectDb } from '../src/config/db.js'
import User from '../src/models/User.js'

dotenv.config()

export const initialDemoUsers = [
  {
    name: 'Maya Fernandes',
    email: 'maya@example.com',
    password: 'password123',
    bio: 'Software engineer passionate about scalable backend microservices.',
    role: 'user',
  },
  {
    name: 'Arjun Mehta',
    email: 'arjun@example.com',
    password: 'password123',
    bio: 'Full stack developer building intuitive web interfaces.',
    role: 'user',
  },
  {
    name: 'Priya Sharma',
    email: 'priya@example.com',
    password: 'password123',
    bio: 'UX designer who codes. Passionate about accessible design systems.',
    role: 'user',
  },
  {
    name: 'Site Admin',
    email: 'admin@example.com',
    password: 'password123',
    bio: 'System administrator overseeing access management.',
    role: 'admin',
  },
]

export async function seedDemoData() {
  await connectDb()

  await User.deleteMany({})
  console.log('🗑️  Cleared existing user records.')

  const createdUsers = []

  for (const userPayload of initialDemoUsers) {
    const createdUser = new User(userPayload)
    await createdUser.save()
    createdUsers.push(createdUser)
  }

  console.log('\n✅ Database seeded successfully.\n')
  console.log('┌────────────────────────────────────────────────────────────┐')
  console.log('│                 Demo Login Accounts                        │')
  console.log('├──────────────────────────┬────────────────┬───────────────┤')
  console.log('│ Name                     │ Email          │ Role          │')
  console.log('├──────────────────────────┼────────────────┼───────────────┤')

  for (const account of initialDemoUsers) {
    const name = account.name.padEnd(24)
    const email = account.email.padEnd(14)
    const role = account.role.padEnd(13)
    console.log(`│ ${name} │ ${email} │ ${role} │`)
  }

  console.log('└──────────────────────────┴────────────────┴───────────────┘')
  console.log('\nAll accounts use password: password123\n')
}

async function runSeedScript() {
  try {
    await seedDemoData()
  } catch (error) {
    console.error('❌ Seeding failed')
    console.error(error)
    process.exitCode = 1
  } finally {
    await mongoose.connection.close()
  }
}

const isDirectRun = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href

if (isDirectRun) {
  runSeedScript()
}