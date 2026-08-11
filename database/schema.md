# Database Schema Documentation

> **Database**: MongoDB (NoSQL Document Store)  
> **ODM**: Mongoose v8  
> **Database Name**: `profile_management_system`

---

## Collection: `users`

The `users` collection is the sole collection in this application. It stores all registered user accounts, including authentication credentials and profile information.

### Schema Definition

| Field | Type | Required | Unique | Min | Max | Default | Notes |
|-------|------|----------|--------|-----|-----|---------|-------|
| `_id` | ObjectId | ✅ auto | ✅ | — | — | auto-generated | MongoDB primary key |
| `name` | String | ✅ | ❌ | 2 chars | 50 chars | — | Trimmed on save |
| `email` | String | ✅ | ✅ | — | — | — | Lowercased & trimmed; indexed |
| `password` | String | ✅ | ❌ | 6 chars | — | — | bcrypt hash (10 rounds), never returned in responses |
| `bio` | String | ❌ | ❌ | — | 180 chars | `"Writes occasionally and reads a lot."` | Trimmed on save |
| `role` | String (enum) | ❌ | ❌ | — | — | `"user"` | Allowed values: `"user"`, `"admin"` |
| `createdAt` | Date | ✅ auto | ❌ | — | — | `Date.now()` | Set by Mongoose `timestamps: true` |
| `updatedAt` | Date | ✅ auto | ❌ | — | — | `Date.now()` | Updated automatically by Mongoose |

### Indexes

| Index Name | Field(s) | Type | Purpose |
|------------|----------|------|---------|
| `_id_` | `_id` | Default | Primary key lookup |
| `email_1` | `email` | Unique Ascending | Fast login lookup; prevents duplicate accounts |

### Mongoose Schema (reference)

```js
const userSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
    email:    { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },  // stored as bcrypt hash
    bio:      { type: String, trim: true, maxlength: 180, default: 'Writes occasionally and reads a lot.' },
    role:     { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
)
```

### Pre-Save Hook

Before any document is saved, if the `password` field has been modified, Mongoose automatically hashes it using `bcrypt` with a salt factor of `10`. Raw passwords are **never** persisted to the database.

### Instance Method

`user.comparePassword(candidatePassword)` — Returns a `Promise<boolean>` using `bcrypt.compare` to verify a plain-text password against the stored hash.

---

## Data Flow

```
Registration Request
   │
   ▼
validateRegister middleware (name, email, password presence & format)
   │
   ▼
Check for existing email → 409 Conflict if duplicate
   │
   ▼
User.create({ name, email, password, bio? })
   │  └─ pre('save') hook → bcrypt.hash(password, 10)
   ▼
MongoDB inserts document to `users` collection
   │
   ▼
JWT token generated (userId payload, 7d expiry)
   │
   ▼
Response: { success, token, user: { id, name, email, bio, role, createdAt, updatedAt } }
```

---

## Sample Document

```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
  "name": "Maya Fernandes",
  "email": "maya@example.com",
  "password": "$2a$10$hashedpasswordstringhere",
  "bio": "Software engineer passionate about scalable backend microservices.",
  "role": "user",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z",
  "__v": 0
}
```
