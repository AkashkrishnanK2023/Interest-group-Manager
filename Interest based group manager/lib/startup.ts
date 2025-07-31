import { MongoClient } from "mongodb"
import bcrypt from "bcryptjs"

/**
 * Startup initialization that runs automatically when the application starts
 * Ensures admin user exists in the database with correct credentials
 */

interface AdminUser {
  _id?: string
  email: string
  password: string
  name: string
  createdAt: Date
}

let initializationPromise: Promise<void> | null = null

export async function ensureAdminExists(): Promise<void> {
  // Prevent multiple simultaneous initializations
  if (initializationPromise) {
    return initializationPromise
  }

  initializationPromise = performAdminInitialization()
  return initializationPromise
}

async function performAdminInitialization(): Promise<void> {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("interest-groups")
    const users = db.collection("users")

    // Admin credentials based on project requirements
    const adminCredentials = {
      email: "admin",
      password: "admin123",
      name: "Administrator"
    }

    // Check if admin user exists
    const existingAdmin = await users.findOne({ email: adminCredentials.email })

    if (existingAdmin) {
      // Verify password is correct
      const passwordMatch = await bcrypt.compare(adminCredentials.password, existingAdmin.password)
      
      if (!passwordMatch) {
        // Update password to ensure it's admin123
        const hashedPassword = await bcrypt.hash(adminCredentials.password, 12)
        await users.updateOne(
          { email: adminCredentials.email },
          { 
            $set: { 
              password: hashedPassword,
              name: adminCredentials.name,
              updatedAt: new Date()
            }
          }
        )
        console.log("🔧 Admin password updated to admin123")
      }
      
      console.log("✅ Admin user verified and ready")
      return
    }

    // Create admin user if doesn't exist
    const hashedPassword = await bcrypt.hash(adminCredentials.password, 12)
    
    const adminUser: AdminUser = {
      email: adminCredentials.email,
      password: hashedPassword,
      name: adminCredentials.name,
      createdAt: new Date()
    }

    await users.insertOne(adminUser)
    console.log("✅ Admin user created automatically")
    console.log("🔐 Login credentials: admin / admin123")

  } catch (error) {
    console.error("❌ Failed to initialize admin user:", error)
    // Don't throw error to prevent app from crashing
  } finally {
    await client.close()
  }
}

/**
 * Initialize admin user on application startup
 * This runs automatically when the module is imported
 */
if (typeof window === 'undefined') { // Only run on server side
  // Run initialization but don't block app startup
  ensureAdminExists().catch(error => {
    console.error("❌ Admin initialization failed:", error)
  })
}