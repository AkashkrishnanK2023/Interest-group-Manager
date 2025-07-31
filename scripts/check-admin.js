const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function checkAdminUser() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("interest-groups")
    const users = db.collection("users")

    // Find admin user
    const adminUser = await users.findOne({ email: "admin" })
    
    if (adminUser) {
      console.log("✅ Admin user found in database:")
      console.log(`ID: ${adminUser._id}`)
      console.log(`Email: ${adminUser.email}`)
      console.log(`Name: ${adminUser.name}`)
      console.log(`Created: ${adminUser.createdAt}`)
      console.log(`Password hash: ${adminUser.password}`)
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare("admin123", adminUser.password)
      console.log(`Password verification: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`)
      
      // List all users
      const allUsers = await users.find({}).toArray()
      console.log(`\nTotal users in database: ${allUsers.length}`)
      allUsers.forEach((user, index) => {
        console.log(`${index + 1}. ${user.email} (${user.name})`)
      })
      
    } else {
      console.log("❌ Admin user not found in database")
      
      // List all users to see what's there
      const allUsers = await users.find({}).toArray()
      console.log(`Total users in database: ${allUsers.length}`)
      if (allUsers.length > 0) {
        console.log("Existing users:")
        allUsers.forEach((user, index) => {
          console.log(`${index + 1}. ${user.email} (${user.name})`)
        })
      }
    }

  } catch (error) {
    console.error("Error checking admin user:", error)
  } finally {
    await client.close()
    console.log("Database connection closed")
  }
}

checkAdminUser()