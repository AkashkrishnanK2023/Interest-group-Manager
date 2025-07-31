const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")

async function addSampleMembers() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("interest-groups")
    const users = db.collection("users")
    const groups = db.collection("groups")
    const memberships = db.collection("memberships")

    // First, let's add some sample users
    const sampleUsers = [
      {
        email: "john.doe@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "John Doe",
        createdAt: new Date("2024-01-10T10:00:00.000Z"),
      },
      {
        email: "jane.smith@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "Jane Smith",
        createdAt: new Date("2024-01-12T14:30:00.000Z"),
      },
      {
        email: "mike.johnson@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "Mike Johnson",
        createdAt: new Date("2024-01-15T09:15:00.000Z"),
      },
      {
        email: "sarah.wilson@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "Sarah Wilson",
        createdAt: new Date("2024-01-18T16:45:00.000Z"),
      },
      {
        email: "david.brown@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "David Brown",
        createdAt: new Date("2024-01-20T11:20:00.000Z"),
      },
      {
        email: "emily.davis@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "Emily Davis",
        createdAt: new Date("2024-01-22T13:10:00.000Z"),
      },
      {
        email: "alex.garcia@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "Alex Garcia",
        createdAt: new Date("2024-01-25T08:30:00.000Z"),
      },
      {
        email: "lisa.martinez@example.com",
        password: await bcrypt.hash("password123", 12),
        name: "Lisa Martinez",
        createdAt: new Date("2024-01-28T15:00:00.000Z"),
      }
    ]

    // Check which users already exist
    const existingUsers = await users.find({}).toArray()
    const existingEmails = existingUsers.map(user => user.email)
    
    const usersToAdd = sampleUsers.filter(user => !existingEmails.includes(user.email))
    
    let addedUsers = []
    if (usersToAdd.length > 0) {
      const result = await users.insertMany(usersToAdd)
      addedUsers = usersToAdd.map((user, index) => ({
        ...user,
        _id: result.insertedIds[index].toString()
      }))
      console.log(`✅ Added ${usersToAdd.length} new users`)
    } else {
      console.log("✅ All sample users already exist")
    }

    // Get all users (existing + newly added)
    const allUsers = await users.find({}).toArray()
    const regularUsers = allUsers.filter(user => user.email !== "admin")
    
    // Get all groups
    const allGroups = await groups.find({}).toArray()
    console.log(`Found ${allGroups.length} groups to add members to`)

    // Clear existing memberships to avoid duplicates
    await memberships.deleteMany({})
    console.log("Cleared existing memberships")

    const sampleMemberships = []
    let membershipIdCounter = 1

    // Add memberships for each group
    allGroups.forEach((group, groupIndex) => {
      // Randomly select 3-8 users for each group
      const numMembers = Math.floor(Math.random() * 6) + 3 // 3-8 members
      const shuffledUsers = [...regularUsers].sort(() => 0.5 - Math.random())
      const selectedUsers = shuffledUsers.slice(0, Math.min(numMembers, regularUsers.length))

      selectedUsers.forEach((user, userIndex) => {
        // Some members are approved, some are pending
        const status = Math.random() > 0.2 ? "approved" : "pending" // 80% approved, 20% pending
        
        sampleMemberships.push({
          _id: (membershipIdCounter++).toString(),
          userId: user._id.toString(),
          userName: user.name,
          groupId: group._id.toString(),
          status: status,
          joinedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
          role: userIndex === 0 && status === "approved" ? "moderator" : "member" // First approved member becomes moderator
        })
      })
    })

    if (sampleMemberships.length > 0) {
      await memberships.insertMany(sampleMemberships)
      console.log(`✅ Added ${sampleMemberships.length} memberships`)

      // Update member counts in groups
      for (const group of allGroups) {
        const approvedCount = sampleMemberships.filter(
          m => m.groupId === group._id.toString() && m.status === "approved"
        ).length
        
        await groups.updateOne(
          { _id: group._id },
          { $set: { memberCount: approvedCount + 1 } } // +1 for admin
        )
      }
      console.log("✅ Updated group member counts")
    }

    // Show summary
    const membershipsByStatus = {}
    sampleMemberships.forEach(membership => {
      if (!membershipsByStatus[membership.status]) {
        membershipsByStatus[membership.status] = 0
      }
      membershipsByStatus[membership.status]++
    })

    console.log("\n📊 Membership Summary:")
    Object.keys(membershipsByStatus).forEach(status => {
      console.log(`   ${status}: ${membershipsByStatus[status]} memberships`)
    })

    const totalMemberships = await memberships.countDocuments()
    const totalUsers = await users.countDocuments()
    const totalGroups = await groups.countDocuments()

    console.log(`\n🎯 Database Summary:`)
    console.log(`   Users: ${totalUsers}`)
    console.log(`   Groups: ${totalGroups}`)
    console.log(`   Memberships: ${totalMemberships}`)

  } catch (error) {
    console.error("Error adding sample members:", error)
  } finally {
    await client.close()
    console.log("Database connection closed")
  }
}

addSampleMembers()