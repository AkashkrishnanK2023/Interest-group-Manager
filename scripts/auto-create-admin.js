const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

/**
 * Automatically creates admin user in MongoDB based on the analyzed project structure
 * User Model: { email, password (hashed), name, createdAt }
 * Admin Credentials: username=admin, password=admin123
 */
async function autoCreateAdmin() {
  console.log("🔧 AUTO-CREATING ADMIN USER...")
  console.log("=" .repeat(60))
  
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB: interest-groups")

    const db = client.db("interest-groups")
    const users = db.collection("users")

    // Admin credentials based on project analysis
    const adminCredentials = {
      email: "admin",           // Username field (using email field as per model)
      password: "admin123",     // Plain password (will be hashed)
      name: "Administrator",    // Display name
      createdAt: new Date()     // Creation timestamp
    }

    console.log("\n📋 ANALYZED USER MODEL:")
    console.log("   - email: string (used as username)")
    console.log("   - password: string (bcrypt hashed with salt rounds 12)")
    console.log("   - name: string (display name)")
    console.log("   - createdAt: Date (timestamp)")

    console.log("\n🔐 ADMIN CREDENTIALS TO INSERT:")
    console.log(`   - Username: ${adminCredentials.email}`)
    console.log(`   - Password: ${adminCredentials.password}`)
    console.log(`   - Name: ${adminCredentials.name}`)

    // Check if admin user already exists
    const existingAdmin = await users.findOne({ email: adminCredentials.email })
    
    if (existingAdmin) {
      console.log("\n⚠️  ADMIN USER ALREADY EXISTS!")
      console.log(`   - Admin ID: ${existingAdmin._id}`)
      console.log(`   - Email: ${existingAdmin.email}`)
      console.log(`   - Name: ${existingAdmin.name}`)
      console.log(`   - Created: ${existingAdmin.createdAt}`)
      
      // Verify password works
      const passwordMatch = await bcrypt.compare(adminCredentials.password, existingAdmin.password)
      if (passwordMatch) {
        console.log("   - Password: ✅ Verified (admin123)")
      } else {
        console.log("   - Password: ❌ Mismatch - Updating password...")
        
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
        console.log("   - Password: ✅ Updated to admin123")
      }
      
      return existingAdmin
    }

    // Hash the password using bcryptjs with salt rounds 12 (as per auth.ts)
    console.log("\n🔒 HASHING PASSWORD...")
    const hashedPassword = await bcrypt.hash(adminCredentials.password, 12)
    console.log("   - Salt rounds: 12 (matching auth.ts configuration)")
    console.log("   - Hash algorithm: bcrypt")

    // Create admin user document
    const adminUser = {
      email: adminCredentials.email,
      password: hashedPassword,
      name: adminCredentials.name,
      createdAt: adminCredentials.createdAt
    }

    // Insert admin user into MongoDB
    console.log("\n💾 INSERTING ADMIN USER INTO MONGODB...")
    const result = await users.insertOne(adminUser)
    
    console.log("✅ ADMIN USER CREATED SUCCESSFULLY!")
    console.log(`   - Admin ID: ${result.insertedId}`)
    console.log(`   - Collection: users`)
    console.log(`   - Database: interest-groups`)

    // Verify the insertion
    const insertedAdmin = await users.findOne({ _id: result.insertedId })
    console.log("\n🔍 VERIFICATION:")
    console.log(`   - Document exists: ✅`)
    console.log(`   - Email: ${insertedAdmin.email}`)
    console.log(`   - Name: ${insertedAdmin.name}`)
    console.log(`   - Password hashed: ✅`)
    console.log(`   - Created at: ${insertedAdmin.createdAt}`)

    // Test password verification
    const passwordVerification = await bcrypt.compare(adminCredentials.password, insertedAdmin.password)
    console.log(`   - Password verification: ${passwordVerification ? '✅' : '❌'}`)

    return insertedAdmin

  } catch (error) {
    console.error("❌ ERROR CREATING ADMIN USER:", error)
    throw error
  } finally {
    await client.close()
    console.log("\n🔌 Database connection closed")
  }
}

/**
 * Enhanced function that also ensures database collections exist
 */
async function initializeAdminAndDatabase() {
  console.log("🚀 INITIALIZING DATABASE AND ADMIN USER")
  console.log("=" .repeat(60))
  
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const db = client.db("interest-groups")

    // Ensure collections exist
    const collections = ['users', 'groups', 'memberships', 'notifications', 'group_activities']
    console.log("\n📁 ENSURING COLLECTIONS EXIST:")
    
    for (const collectionName of collections) {
      const collectionExists = await db.listCollections({ name: collectionName }).hasNext()
      if (!collectionExists) {
        await db.createCollection(collectionName)
        console.log(`   ✅ Created collection: ${collectionName}`)
      } else {
        console.log(`   ✅ Collection exists: ${collectionName}`)
      }
    }

    await client.close()

    // Create admin user
    const admin = await autoCreateAdmin()

    console.log("\n" + "=" .repeat(60))
    console.log("🎉 INITIALIZATION COMPLETE!")
    console.log("=" .repeat(60))
    console.log("🌐 LOGIN INFORMATION:")
    console.log("   URL: http://localhost:3000/login")
    console.log("   Username: admin")
    console.log("   Password: admin123")
    console.log("\n📊 DATABASE STATUS:")
    console.log("   Database: interest-groups")
    console.log("   Collections: users, groups, memberships, notifications, group_activities")
    console.log("   Admin User: ✅ Ready")
    console.log("=" .repeat(60))

    return admin

  } catch (error) {
    console.error("❌ INITIALIZATION FAILED:", error)
    throw error
  }
}

// Export functions for use in other scripts
module.exports = { 
  autoCreateAdmin, 
  initializeAdminAndDatabase 
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2)
  if (args.includes('--full-init')) {
    initializeAdminAndDatabase()
  } else {
    autoCreateAdmin()
  }
}