const { MongoClient } = require("mongodb")

async function addMoreGroups() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("interest-groups")
    const groups = db.collection("groups")

    // Get admin user ID for some groups
    const users = db.collection("users")
    const adminUser = await users.findOne({ email: "admin" })
    const adminId = adminUser ? adminUser._id.toString() : "admin_user_id"

    const newGroups = [
      // Education Category
      {
        title: "Online Learning Community",
        description: "Share resources, discuss courses, and support each other in online learning journeys. From MOOCs to certification programs.",
        category: "Education",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-01T09:00:00.000Z"),
      },
      {
        title: "Study Group - Data Science",
        description: "Weekly study sessions for data science concepts, machine learning algorithms, and statistical analysis.",
        category: "Education",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-05T14:30:00.000Z"),
      },
      {
        title: "Language Exchange Circle",
        description: "Practice different languages with native speakers. Currently supporting English, Spanish, French, and Mandarin.",
        category: "Education",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-02-10T11:15:00.000Z"),
      },

      // Entertainment Category
      {
        title: "Movie Night Club",
        description: "Weekly movie screenings and discussions. We explore different genres from classic cinema to latest releases.",
        category: "Entertainment",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-01-28T19:00:00.000Z"),
      },
      {
        title: "Board Game Enthusiasts",
        description: "Meet up for board game nights! From strategy games to party games, all skill levels welcome.",
        category: "Entertainment",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-03T16:45:00.000Z"),
      },
      {
        title: "Book Club - Sci-Fi & Fantasy",
        description: "Monthly book discussions focusing on science fiction and fantasy literature. Currently reading 'Dune'.",
        category: "Entertainment",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-02-07T13:20:00.000Z"),
      },
      {
        title: "Gaming Community",
        description: "Connect with fellow gamers! Discuss latest releases, organize multiplayer sessions, and share gaming tips.",
        category: "Entertainment",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-12T20:30:00.000Z"),
      },

      // Sports Category
      {
        title: "Morning Runners Club",
        description: "Join us for early morning runs around the city. All paces welcome, from beginners to marathon runners.",
        category: "Sports",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-01-30T06:00:00.000Z"),
      },
      {
        title: "Weekend Cyclists",
        description: "Explore scenic routes on two wheels! Weekend cycling trips for all skill levels with safety as our priority.",
        category: "Sports",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-04T08:30:00.000Z"),
      },
      {
        title: "Basketball Pickup Games",
        description: "Regular basketball games at the local court. Come play, improve your skills, and make new friends.",
        category: "Sports",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-02-08T17:00:00.000Z"),
      },
      {
        title: "Yoga & Mindfulness",
        description: "Weekly yoga sessions focusing on flexibility, strength, and mindfulness. Suitable for all levels.",
        category: "Sports",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-11T07:30:00.000Z"),
      },

      // Technology Category
      {
        title: "Python Developers Hub",
        description: "Python enthusiasts sharing knowledge, discussing frameworks like Django/Flask, and collaborating on projects.",
        category: "Technology",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-01-29T15:00:00.000Z"),
      },
      {
        title: "AI & Machine Learning",
        description: "Explore the latest in artificial intelligence and machine learning. Share research, discuss algorithms, and build projects.",
        category: "Technology",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-02-02T10:45:00.000Z"),
      },
      {
        title: "Web Development Bootcamp",
        description: "Learn modern web development together. HTML, CSS, JavaScript, and popular frameworks like React and Vue.",
        category: "Technology",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-06T12:00:00.000Z"),
      },
      {
        title: "Cybersecurity Network",
        description: "Discuss cybersecurity trends, share best practices, and learn about protecting digital assets.",
        category: "Technology",
        visibility: "private",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-02-09T14:15:00.000Z"),
      },

      // Music Category
      {
        title: "Local Musicians Collective",
        description: "Connect with local musicians, share original compositions, and organize jam sessions and performances.",
        category: "Music",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-01-31T18:00:00.000Z"),
      },
      {
        title: "Classical Music Appreciation",
        description: "Explore the world of classical music through listening sessions, concert discussions, and composer studies.",
        category: "Music",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-05T19:30:00.000Z"),
      },
      {
        title: "Guitar Learning Circle",
        description: "Learn guitar together! From basic chords to advanced techniques. Acoustic and electric players welcome.",
        category: "Music",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-02-10T16:00:00.000Z"),
      },
      {
        title: "Electronic Music Production",
        description: "Create electronic music using DAWs like Ableton, FL Studio. Share beats, get feedback, collaborate on tracks.",
        category: "Music",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-13T21:00:00.000Z"),
      },

      // Art Category
      {
        title: "Digital Art Studio",
        description: "Digital artists sharing techniques, software tips, and showcasing artwork. Photoshop, Illustrator, Procreate, and more.",
        category: "Art",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-02-01T13:45:00.000Z"),
      },
      {
        title: "Watercolor Painting Group",
        description: "Weekly watercolor painting sessions. Learn techniques, share tips, and paint together in a supportive environment.",
        category: "Art",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-06T10:30:00.000Z"),
      },
      {
        title: "Street Art & Graffiti",
        description: "Appreciate and discuss street art culture. Share photos, techniques, and organize legal wall painting events.",
        category: "Art",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-02-11T15:20:00.000Z"),
      },
      {
        title: "Sculpture & 3D Art",
        description: "Explore three-dimensional art forms. Clay, metal, wood, and digital 3D modeling. Share projects and techniques.",
        category: "Art",
        visibility: "private",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-14T11:00:00.000Z"),
      },

      // Business Category
      {
        title: "Startup Founders Network",
        description: "Connect with fellow entrepreneurs, share experiences, discuss challenges, and support each other's ventures.",
        category: "Business",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-02-02T09:15:00.000Z"),
      },
      {
        title: "Digital Marketing Professionals",
        description: "Stay updated with digital marketing trends, share strategies, and discuss tools for SEO, social media, and analytics.",
        category: "Business",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-07T14:00:00.000Z"),
      },
      {
        title: "Freelancers United",
        description: "Support network for freelancers across all industries. Share tips, find collaborators, and discuss client management.",
        category: "Business",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-02-12T16:30:00.000Z"),
      },
      {
        title: "Investment Club",
        description: "Learn about investing together. Discuss stocks, bonds, real estate, and cryptocurrency. Educational focus only.",
        category: "Business",
        visibility: "private",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-15T10:45:00.000Z"),
      },

      // Health Category
      {
        title: "Healthy Cooking Club",
        description: "Share healthy recipes, cooking tips, and meal prep ideas. Focus on nutritious, delicious, and easy-to-make meals.",
        category: "Health",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-02-03T12:00:00.000Z"),
      },
      {
        title: "Mental Health Support",
        description: "Safe space for mental health discussions, sharing resources, and supporting each other's wellness journeys.",
        category: "Health",
        visibility: "private",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-08T09:30:00.000Z"),
      },
      {
        title: "Fitness Motivation Group",
        description: "Stay motivated on your fitness journey! Share workouts, progress photos, and encourage each other to reach goals.",
        category: "Health",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-02-13T07:00:00.000Z"),
      },
      {
        title: "Meditation & Wellness",
        description: "Explore mindfulness practices, meditation techniques, and holistic wellness approaches for better living.",
        category: "Health",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-16T18:15:00.000Z"),
      },

      // Travel Category
      {
        title: "Backpackers Community",
        description: "Share backpacking experiences, travel tips, budget advice, and connect with fellow adventure travelers.",
        category: "Travel",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-02-04T11:30:00.000Z"),
      },
      {
        title: "Local Travel Explorers",
        description: "Discover hidden gems in our local area. Day trips, weekend getaways, and exploring nearby attractions.",
        category: "Travel",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-09T13:45:00.000Z"),
      },
      {
        title: "Photography Travel",
        description: "Combine travel and photography! Share travel photos, discuss photography techniques, and plan photo trips.",
        category: "Travel",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-02-14T15:00:00.000Z"),
      },
      {
        title: "Cultural Exchange Travelers",
        description: "Focus on cultural immersion while traveling. Share experiences, language tips, and cultural insights.",
        category: "Travel",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-17T10:20:00.000Z"),
      },

      // Food Category
      {
        title: "Home Bakers Guild",
        description: "Share baking recipes, techniques, and photos of your creations. From bread to pastries, all skill levels welcome.",
        category: "Food",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-02-05T16:00:00.000Z"),
      },
      {
        title: "International Cuisine Club",
        description: "Explore world cuisines together! Share authentic recipes, cooking techniques, and cultural food stories.",
        category: "Food",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-10T12:30:00.000Z"),
      },
      {
        title: "Coffee Connoisseurs",
        description: "For coffee lovers! Discuss brewing methods, bean origins, cafe reviews, and share the perfect cup experiences.",
        category: "Food",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-02-15T08:45:00.000Z"),
      },
      {
        title: "Vegetarian & Vegan Recipes",
        description: "Plant-based cooking community. Share delicious vegetarian and vegan recipes, nutrition tips, and lifestyle advice.",
        category: "Food",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-18T14:15:00.000Z"),
      },

      // Other Category
      {
        title: "Pet Lovers Community",
        description: "Share photos, stories, and advice about our beloved pets. All animals welcome - dogs, cats, birds, and more!",
        category: "Other",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-02-06T17:30:00.000Z"),
      },
      {
        title: "Gardening Enthusiasts",
        description: "Green thumbs unite! Share gardening tips, plant photos, seasonal advice, and grow together as gardeners.",
        category: "Other",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-11T09:00:00.000Z"),
      },
      {
        title: "DIY & Crafts Corner",
        description: "Share DIY projects, craft ideas, and handmade creations. From woodworking to knitting, all crafts welcome.",
        category: "Other",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-02-16T13:20:00.000Z"),
      },
      {
        title: "Volunteer Network",
        description: "Connect with local volunteer opportunities, organize community service projects, and make a positive impact together.",
        category: "Other",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-02-19T11:45:00.000Z"),
      },
    ]

    // Check which groups already exist to avoid duplicates
    const existingGroups = await groups.find({}).toArray()
    const existingTitles = existingGroups.map(group => group.title)
    
    const groupsToAdd = newGroups.filter(group => !existingTitles.includes(group.title))
    
    if (groupsToAdd.length > 0) {
      await groups.insertMany(groupsToAdd)
      console.log(`\n✅ Added ${groupsToAdd.length} new groups to the database!`)
      
      // Show summary by category
      const groupsByCategory = {}
      groupsToAdd.forEach(group => {
        if (!groupsByCategory[group.category]) {
          groupsByCategory[group.category] = 0
        }
        groupsByCategory[group.category]++
      })
      
      console.log("\n📊 Groups added by category:")
      Object.keys(groupsByCategory).forEach(category => {
        console.log(`   ${category}: ${groupsByCategory[category]} groups`)
      })
      
    } else {
      console.log("\n✅ All groups already exist in the database!")
    }

    // Show final count
    const totalGroups = await groups.countDocuments()
    console.log(`\n🎯 Total groups in database: ${totalGroups}`)

  } catch (error) {
    console.error("Error adding groups:", error)
  } finally {
    await client.close()
    console.log("Database connection closed")
  }
}

addMoreGroups()