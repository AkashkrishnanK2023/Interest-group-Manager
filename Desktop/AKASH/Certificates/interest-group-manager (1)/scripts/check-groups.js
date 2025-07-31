const { MongoClient } = require("mongodb")

async function checkCurrentGroups() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("interest-groups")
    const groups = db.collection("groups")

    const allGroups = await groups.find({}).toArray()
    console.log(`\nTotal groups in database: ${allGroups.length}`)
    
    if (allGroups.length > 0) {
      console.log("\nExisting groups:")
      allGroups.forEach((group, index) => {
        console.log(`${index + 1}. ${group.title} (${group.category}) - ${group.visibility}`)
      })
      
      // Group by category
      const groupsByCategory = {}
      allGroups.forEach(group => {
        if (!groupsByCategory[group.category]) {
          groupsByCategory[group.category] = []
        }
        groupsByCategory[group.category].push(group.title)
      })
      
      console.log("\nGroups by category:")
      Object.keys(groupsByCategory).forEach(category => {
        console.log(`${category}: ${groupsByCategory[category].length} groups`)
        groupsByCategory[category].forEach(title => {
          console.log(`  - ${title}`)
        })
      })
    }

  } catch (error) {
    console.error("Error checking groups:", error)
  } finally {
    await client.close()
  }
}

checkCurrentGroups()