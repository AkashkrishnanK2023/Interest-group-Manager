const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function checkAdminStatus() {
  console.log("🔍 Checking Admin User Status")
  console.log("=" .repeat(50))
  
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB")

    const db = client.db("interest-groups")
    const users = db.collection("users")

    // Find admin user
    const adminUser = await users.findOne({ email: "admin" })
    
    if (adminUser) {
      console.log("\n✅ Admin user found in MongoDB:")
      console.log(`   📧 Email: ${adminUser.email}`)
      console.log(`   👤 Name: ${adminUser.name}`)
      console.log(`   🆔 ID: ${adminUser._id}`)
      console.log(`   📅 Created: ${adminUser.createdAt}`)
      
      // Test password verification
      const isPasswordValid = await bcrypt.compare("admin123", adminUser.password)
      console.log(`   🔐 Password: ${isPasswordValid ? '✅ Valid' : '❌ Invalid'}`)
      
    } else {
      console.log("❌ Admin user not found in MongoDB")
    }

    // Show total users
    const totalUsers = await users.countDocuments()
    console.log(`\n📊 Total users in database: ${totalUsers}`)

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message)
    console.log("🔧 Application will fall back to mock database")
  } finally {
    await client.close()
  }

  console.log("\n" + "=" .repeat(50))
  console.log("🎯 ADMIN LOGIN CREDENTIALS:")
  console.log("   Username: admin")
  console.log("   Password: admin123")
  console.log("=" .repeat(50))
  console.log("\n📝 Available Scripts:")
  console.log("   npm run create-admin  - Create admin user")
  console.log("   npm run init-db       - Initialize database")
  console.log("   npm run dev           - Start development server")
  console.log("\n🌐 Login URL: http://localhost:3000/login")
}

checkAdminStatus()