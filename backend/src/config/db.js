import mongoose from 'mongoose'

let isConnected = false
const localFallbackUri = 'mongodb://127.0.0.1:27017/profile_management_system'

export const connectDb = async () => {
  const primaryUri = (process.env.MONGO_URI || process.env.MONGODB_URI || localFallbackUri).trim()

  try {
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 8000,
    })

    isConnected = true
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`)
    return conn.connection
  } catch (primaryError) {
    console.warn(`⚠️ Primary MongoDB Connection Error: ${primaryError.message}`)

    // If cloud Atlas fails due to IP Whitelist / Network Access, attempt local MongoDB fallback
    if (primaryUri !== localFallbackUri) {
      console.warn('⚡ Attempting fallback to local MongoDB instance...')
      try {
        const fallbackConn = await mongoose.connect(localFallbackUri, {
          serverSelectionTimeoutMS: 5000,
        })
        isConnected = true
        console.log(`✅ Connected to Local MongoDB Fallback: ${fallbackConn.connection.host}/${fallbackConn.connection.name}`)
        return fallbackConn.connection
      } catch (fallbackError) {
        console.warn(`⚠️ Local MongoDB Fallback Error: ${fallbackError.message}`)
      }
    }

    isConnected = false
    throw primaryError
  }
}

export const getIsConnected = () => isConnected

export default connectDb