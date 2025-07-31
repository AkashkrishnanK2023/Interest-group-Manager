import { MongoClient, type Db } from "mongodb"
import { getMockDatabase } from "./mock-db"
import { ensureAdminExists } from "./startup"

// Check if MongoDB URI is provided
const uri = process.env.MONGODB_URI
const useMockDb = !uri

const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

if (!useMockDb && uri) {
  if (process.env.NODE_ENV === "development") {
    const globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>
    }

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options)
      globalWithMongo._mongoClientPromise = client.connect()
    }
    clientPromise = globalWithMongo._mongoClientPromise
  } else {
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export async function getDatabase(): Promise<Db | any> {
  // Use mock database for development when MongoDB is not available
  if (useMockDb) {
    console.log("🔧 Using mock database for development")
    return getMockDatabase()
  }

  try {
    const client = await clientPromise
    const db = client.db("interest-groups")
    
    // Ensure admin user exists on first database connection
    ensureAdminExists().catch(error => {
      console.error("❌ Admin initialization failed:", error)
    })
    
    return db
  } catch (error) {
    console.error("Failed to connect to MongoDB, falling back to mock database:", error)
    return getMockDatabase()
  }
}

export default clientPromise
