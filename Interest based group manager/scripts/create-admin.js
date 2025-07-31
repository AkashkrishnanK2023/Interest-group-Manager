const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function createAdminUser() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("interest-groups")
    const users = db.collection("users")

    // Admin credentials
    const adminEmail = "admin"
    const adminPassword = "admin123"
    const adminName = "Administrator"

    // Check if admin user already exists
    const existingAdmin = await users.findOne({ email: adminEmail })
    if (existingAdmin) {
      console.log("Admin user already exists!")
      console.log(`Admin credentials - Email: ${adminEmail}, Password: ${adminPassword}`)
      return
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(adminPassword, 12)

    // Create admin user
    const result = await users.insertOne({
      email: adminEmail,
      password: hashedPassword,
      name: adminName,
      createdAt: new Date(),
    })

    console.log("Admin user created successfully!")
    console.log(`Admin ID: ${result.insertedId}`)
    console.log(`Admin credentials - Email: ${adminEmail}, Password: ${adminPassword}`)
    console.log("\nYou can now login with these credentials:")
    console.log(`Username: ${adminEmail}`)
    console.log(`Password: ${adminPassword}`)

  } catch (error) {
    console.error("Error creating admin user:", error)
  } finally {
    await client.close()
    console.log("Database connection closed")
  }
}

if (require.main === module) {
  createAdminUser()
}

module.exports = { createAdminUser }