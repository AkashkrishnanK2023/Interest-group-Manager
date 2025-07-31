const { MongoClient } = require("mongodb")

async function showDatabaseSummary() {
  console.log("🗄️  DATABASE SUMMARY")
  console.log("=" .repeat(60))
  
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("✅ Connected to MongoDB: interest-groups")

    const db = client.db("interest-groups")
    
    // Users Summary
    const users = db.collection("users")
    const totalUsers = await users.countDocuments()
    const adminUser = await users.findOne({ email: "admin" })
    
    console.log("\n👥 USERS:")
    console.log(`   Total Users: ${totalUsers}`)
    console.log(`   Admin User: ${adminUser ? '✅ Exists' : '❌ Missing'}`)
    if (adminUser) {
      console.log(`   Admin Email: ${adminUser.email}`)
      console.log(`   Admin Name: ${adminUser.name}`)
    }

    // Groups Summary
    const groups = db.collection("groups")
    const totalGroups = await groups.countDocuments()
    const publicGroups = await groups.countDocuments({ visibility: "public" })
    const privateGroups = await groups.countDocuments({ visibility: "private" })
    
    console.log("\n🏢 GROUPS:")
    console.log(`   Total Groups: ${totalGroups}`)
    console.log(`   Public Groups: ${publicGroups}`)
    console.log(`   Private Groups: ${privateGroups}`)

    // Groups by Category
    const categories = [
      "Education", "Entertainment", "Sports", "Technology", 
      "Music", "Art", "Business", "Health", "Travel", "Food", "Other"
    ]
    
    console.log("\n📊 GROUPS BY CATEGORY:")
    for (const category of categories) {
      const count = await groups.countDocuments({ category })
      const categoryGroups = await groups.find({ category }).toArray()
      console.log(`   ${category}: ${count} groups`)
      
      if (count > 0) {
        categoryGroups.forEach(group => {
          const visibility = group.visibility === "private" ? "🔒" : "🌐"
          console.log(`     ${visibility} ${group.title}`)
        })
      }
    }

    // Other Collections
    const memberships = db.collection("memberships")
    const notifications = db.collection("notifications")
    const activities = db.collection("group_activities")
    
    const totalMemberships = await memberships.countDocuments()
    const totalNotifications = await notifications.countDocuments()
    const totalActivities = await activities.countDocuments()
    
    console.log("\n📋 OTHER COLLECTIONS:")
    console.log(`   Memberships: ${totalMemberships}`)
    console.log(`   Notifications: ${totalNotifications}`)
    console.log(`   Group Activities: ${totalActivities}`)

  } catch (error) {
    console.error("❌ Error connecting to MongoDB:", error.message)
  } finally {
    await client.close()
  }

  console.log("\n" + "=" .repeat(60))
  console.log("🎯 QUICK ACCESS:")
  console.log("   Admin Login: http://localhost:3000/login")
  console.log("   Username: admin")
  console.log("   Password: admin123")
  console.log("\n📝 Available Scripts:")
  console.log("   npm run dev          - Start development server")
  console.log("   npm run admin-status - Check admin user status")
  console.log("   npm run check-groups - List all groups")
  console.log("   npm run add-groups   - Add more sample groups")
  console.log("   npm run init-db      - Initialize database")
  console.log("=" .repeat(60))
}

showDatabaseSummary()