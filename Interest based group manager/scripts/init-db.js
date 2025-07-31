const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function initializeDatabase() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("interest-groups")

    // Create collections with indexes
    const collections = ["users", "groups", "memberships", "notifications", "group_activities"]

    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName)
        console.log(`Created collection: ${collectionName}`)
      } catch (error) {
        if (error.code === 48) {
          console.log(`Collection ${collectionName} already exists`)
        } else {
          throw error
        }
      }
    }

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true })
    await db.collection("groups").createIndex({ adminId: 1 })
    await db.collection("groups").createIndex({ category: 1 })
    await db.collection("groups").createIndex({ visibility: 1 })
    await db.collection("groups").createIndex({ createdAt: -1 })
    await db.collection("memberships").createIndex({ userId: 1, groupId: 1 }, { unique: true })
    await db.collection("memberships").createIndex({ groupId: 1 })
    await db.collection("memberships").createIndex({ status: 1 })
    await db.collection("notifications").createIndex({ userId: 1 })
    await db.collection("notifications").createIndex({ createdAt: -1 })

    console.log("Database initialized successfully!")

    // Insert sample data
    const sampleGroups = [
      {
        title: "React Developers",
        description:
          "A community for React developers to share knowledge, discuss best practices, and collaborate on projects.",
        category: "Technology",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-01-15T10:00:00.000Z"),
      },
      {
        title: "Photography Enthusiasts",
        description: "Share your photos, get feedback, and learn new techniques from fellow photography lovers.",
        category: "Art",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-01-20T14:30:00.000Z"),
      },
      {
        title: "Local Hiking Group",
        description: "Join us for weekend hikes and outdoor adventures in the local area. All skill levels welcome!",
        category: "Sports",
        visibility: "private",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-01-25T09:15:00.000Z"),
      },
    ]

    const existingGroups = await db.collection("groups").countDocuments()
    if (existingGroups === 0) {
      await db.collection("groups").insertMany(sampleGroups)
      console.log("Sample groups inserted")
    }

    // Create admin user
    const adminEmail = "admin"
    const adminPassword = "admin123"
    const adminName = "Administrator"

    const existingAdmin = await db.collection("users").findOne({ email: adminEmail })
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 12)
      await db.collection("users").insertOne({
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
        createdAt: new Date(),
      })
      console.log("Admin user created successfully!")
      console.log(`Admin credentials - Email: ${adminEmail}, Password: ${adminPassword}`)
    } else {
      console.log("Admin user already exists")
    }
  } catch (error) {
    console.error("Error initializing database:", error)
  } finally {
    await client.close()
  }
}

if (require.main === module) {
  initializeDatabase()
}

module.exports = { initializeDatabase }
