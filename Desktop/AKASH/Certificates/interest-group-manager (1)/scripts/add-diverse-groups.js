const { MongoClient } = require("mongodb")

async function addDiverseGroups() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
  const client = new MongoClient(uri)

  try {
    await client.connect()
    console.log("🌟 Connected to MongoDB")

    const db = client.db("interest-groups")
    const groups = db.collection("groups")

    // Get admin user ID for some groups
    const users = db.collection("users")
    const adminUser = await users.findOne({ email: "admin" })
    const adminId = adminUser ? adminUser._id.toString() : "admin_user_id"

    const diverseGroups = [
      // Education Category - Adding more variety
      {
        title: "Philosophy Discussion Circle",
        description: "Explore philosophical questions, discuss great thinkers, and engage in thoughtful debates about life's big questions.",
        category: "Education",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-01T10:00:00.000Z"),
      },
      {
        title: "History Buffs Society",
        description: "Dive deep into historical events, share fascinating stories, and learn from the past together.",
        category: "Education",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-03-02T14:30:00.000Z"),
      },
      {
        title: "Creative Writing Workshop",
        description: "Improve your writing skills through exercises, peer feedback, and sharing original stories and poems.",
        category: "Education",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-03-03T16:00:00.000Z"),
      },
      {
        title: "Science Enthusiasts Club",
        description: "Explore the wonders of science! Discuss latest discoveries, conduct experiments, and share scientific curiosity.",
        category: "Education",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-04T11:15:00.000Z"),
      },
      {
        title: "Mathematics Study Group",
        description: "Make math fun and accessible! From basic algebra to advanced calculus, learn together and help each other.",
        category: "Education",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-03-05T13:45:00.000Z"),
      },

      // Entertainment Category - More variety
      {
        title: "Comedy Club Enthusiasts",
        description: "Share funny stories, discuss stand-up comedy, and organize comedy show outings. Laughter is the best medicine!",
        category: "Entertainment",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-03-06T19:30:00.000Z"),
      },
      {
        title: "Podcast Discussion Group",
        description: "Discover new podcasts, discuss episodes, and share recommendations across all genres and topics.",
        category: "Entertainment",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-07T12:00:00.000Z"),
      },
      {
        title: "Trivia Night Champions",
        description: "Test your knowledge! Weekly trivia sessions covering everything from pop culture to obscure facts.",
        category: "Entertainment",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-03-08T20:00:00.000Z"),
      },
      {
        title: "Anime & Manga Community",
        description: "Discuss your favorite anime series, manga recommendations, and Japanese pop culture. All otakus welcome!",
        category: "Entertainment",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-03-09T17:15:00.000Z"),
      },
      {
        title: "Theater & Drama Lovers",
        description: "Appreciate theatrical arts, discuss plays, organize theater outings, and maybe even perform together!",
        category: "Entertainment",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-10T18:45:00.000Z"),
      },

      // Sports Category - More activities
      {
        title: "Swimming & Water Sports",
        description: "Dive into aquatic activities! Swimming techniques, water polo, diving, and pool safety discussions.",
        category: "Sports",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-03-11T07:00:00.000Z"),
      },
      {
        title: "Tennis Club Network",
        description: "Find tennis partners, improve your game, discuss techniques, and organize friendly matches.",
        category: "Sports",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-12T08:30:00.000Z"),
      },
      {
        title: "Martial Arts Community",
        description: "Explore various martial arts disciplines, share training tips, and discuss philosophy behind the arts.",
        category: "Sports",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-03-13T18:00:00.000Z"),
      },
      {
        title: "Rock Climbing Adventures",
        description: "Scale new heights! Indoor climbing, outdoor adventures, safety tips, and gear recommendations.",
        category: "Sports",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-03-14T09:15:00.000Z"),
      },
      {
        title: "Dance Fitness Group",
        description: "Get fit while having fun! Zumba, dance workouts, choreography sharing, and dance style discussions.",
        category: "Sports",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-15T19:00:00.000Z"),
      },

      // Technology Category - Clean, professional groups
      {
        title: "Mobile App Developers",
        description: "iOS and Android development community. Share code, discuss frameworks, and collaborate on mobile projects.",
        category: "Technology",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-03-16T10:30:00.000Z"),
      },
      {
        title: "Cloud Computing Professionals",
        description: "AWS, Azure, Google Cloud discussions. Share best practices, certifications, and cloud architecture insights.",
        category: "Technology",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-17T14:00:00.000Z"),
      },
      {
        title: "DevOps & Automation",
        description: "Streamline development workflows. Docker, Kubernetes, CI/CD pipelines, and infrastructure as code.",
        category: "Technology",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-03-18T11:45:00.000Z"),
      },
      {
        title: "Blockchain & Cryptocurrency",
        description: "Explore blockchain technology, cryptocurrency trends, and decentralized applications development.",
        category: "Technology",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-03-19T15:30:00.000Z"),
      },

      // Music Category - More genres
      {
        title: "Jazz Appreciation Society",
        description: "Explore the rich world of jazz music. From bebop to smooth jazz, share favorites and discover new artists.",
        category: "Music",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-20T20:30:00.000Z"),
      },
      {
        title: "Indie Music Discovery",
        description: "Find hidden gems in independent music. Share discoveries, support emerging artists, and discuss indie culture.",
        category: "Music",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-03-21T16:15:00.000Z"),
      },
      {
        title: "Songwriting Circle",
        description: "Create original music together! Share lyrics, melodies, get feedback, and collaborate on songwriting projects.",
        category: "Music",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-03-22T13:00:00.000Z"),
      },
      {
        title: "World Music Explorers",
        description: "Journey through global music traditions. From African drums to Celtic folk, explore diverse musical cultures.",
        category: "Music",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-23T17:45:00.000Z"),
      },

      // Art Category - More mediums
      {
        title: "Portrait Drawing Studio",
        description: "Master the art of portrait drawing. Share techniques, practice together, and improve your figure drawing skills.",
        category: "Art",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-03-24T14:30:00.000Z"),
      },
      {
        title: "Ceramic Arts Workshop",
        description: "Work with clay! Pottery techniques, glazing tips, kiln firing discussions, and ceramic art appreciation.",
        category: "Art",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-25T10:00:00.000Z"),
      },
      {
        title: "Abstract Art Collective",
        description: "Explore non-representational art forms. Share abstract creations, discuss techniques, and push creative boundaries.",
        category: "Art",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-03-26T15:20:00.000Z"),
      },
      {
        title: "Art History & Criticism",
        description: "Study great masters, analyze art movements, and develop critical thinking about visual arts throughout history.",
        category: "Art",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-03-27T12:45:00.000Z"),
      },

      // Business Category - More specializations
      {
        title: "E-commerce Entrepreneurs",
        description: "Online business strategies, dropshipping, Amazon FBA, Shopify tips, and e-commerce growth hacking.",
        category: "Business",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-03-28T09:30:00.000Z"),
      },
      {
        title: "Real Estate Investors",
        description: "Property investment strategies, market analysis, rental property management, and real estate networking.",
        category: "Business",
        visibility: "private",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-03-29T11:00:00.000Z"),
      },
      {
        title: "Small Business Owners",
        description: "Support network for local business owners. Share challenges, solutions, and grow your business together.",
        category: "Business",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-03-30T16:30:00.000Z"),
      },
      {
        title: "Sales & Negotiation Masters",
        description: "Improve sales techniques, negotiation skills, customer relationship management, and closing strategies.",
        category: "Business",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-03-31T13:15:00.000Z"),
      },

      // Health Category - More wellness aspects
      {
        title: "Nutrition Science Group",
        description: "Evidence-based nutrition discussions, meal planning, supplement research, and healthy lifestyle optimization.",
        category: "Health",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-04-01T08:00:00.000Z"),
      },
      {
        title: "Sleep Optimization Club",
        description: "Improve sleep quality through science-backed methods, sleep hygiene tips, and recovery strategies.",
        category: "Health",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-04-02T21:30:00.000Z"),
      },
      {
        title: "Holistic Wellness Circle",
        description: "Explore alternative health approaches, natural remedies, aromatherapy, and mind-body connection practices.",
        category: "Health",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-04-03T10:45:00.000Z"),
      },
      {
        title: "Chronic Illness Support",
        description: "Safe space for those managing chronic conditions. Share experiences, coping strategies, and mutual support.",
        category: "Health",
        visibility: "private",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-04-04T14:20:00.000Z"),
      },

      // Travel Category - More travel styles
      {
        title: "Luxury Travel Experiences",
        description: "Share premium travel experiences, luxury accommodations, fine dining, and exclusive destination recommendations.",
        category: "Travel",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-04-05T12:00:00.000Z"),
      },
      {
        title: "Solo Travel Adventures",
        description: "Empowering solo travelers with safety tips, destination guides, and connecting with fellow solo adventurers.",
        category: "Travel",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-04-06T09:30:00.000Z"),
      },
      {
        title: "Family Travel Planning",
        description: "Kid-friendly destinations, family travel tips, budget planning, and making memories with children.",
        category: "Travel",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-04-07T15:45:00.000Z"),
      },
      {
        title: "Adventure Sports Travel",
        description: "Combine travel with extreme sports! Skiing, surfing, mountain biking, and adrenaline-filled destinations.",
        category: "Travel",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-04-08T11:20:00.000Z"),
      },

      // Food Category - More culinary interests
      {
        title: "Wine Tasting Society",
        description: "Explore wines from around the world, learn tasting techniques, food pairings, and vineyard knowledge.",
        category: "Food",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-04-09T18:30:00.000Z"),
      },
      {
        title: "Fermentation Enthusiasts",
        description: "Master the art of fermentation! Kombucha, kimchi, sourdough, cheese making, and probiotic foods.",
        category: "Food",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-04-10T13:00:00.000Z"),
      },
      {
        title: "BBQ & Grilling Masters",
        description: "Perfect your grilling game! Smoking techniques, rub recipes, BBQ competitions, and outdoor cooking tips.",
        category: "Food",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-04-11T16:15:00.000Z"),
      },
      {
        title: "Molecular Gastronomy Lab",
        description: "Explore scientific cooking techniques, molecular gastronomy experiments, and avant-garde culinary arts.",
        category: "Food",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-04-12T14:45:00.000Z"),
      },

      // Other Category - More diverse interests
      {
        title: "Astronomy & Stargazing",
        description: "Explore the cosmos! Telescope tips, constellation identification, astrophotography, and space science discussions.",
        category: "Other",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-04-13T21:00:00.000Z"),
      },
      {
        title: "Vintage Collectors Club",
        description: "Appreciate vintage items! Antiques, collectibles, restoration tips, and sharing unique finds and their stories.",
        category: "Other",
        visibility: "public",
        adminId: "sample_admin_3",
        adminName: "Mike Johnson",
        memberCount: 1,
        createdAt: new Date("2024-04-14T10:30:00.000Z"),
      },
      {
        title: "Minimalism & Simple Living",
        description: "Embrace minimalist lifestyle, decluttering tips, sustainable living, and finding joy in simplicity.",
        category: "Other",
        visibility: "public",
        adminId: "sample_admin_1",
        adminName: "John Doe",
        memberCount: 1,
        createdAt: new Date("2024-04-15T12:15:00.000Z"),
      },
      {
        title: "Board Game Design Workshop",
        description: "Create your own board games! Game mechanics, playtesting, publishing tips, and collaborative game development.",
        category: "Other",
        visibility: "public",
        adminId: "sample_admin_2",
        adminName: "Jane Smith",
        memberCount: 1,
        createdAt: new Date("2024-04-16T17:30:00.000Z"),
      },
      {
        title: "Urban Exploration Society",
        description: "Discover hidden gems in urban environments. Architecture appreciation, city history, and respectful exploration.",
        category: "Other",
        visibility: "public",
        adminId: adminId,
        adminName: "Administrator",
        memberCount: 1,
        createdAt: new Date("2024-04-17T14:00:00.000Z"),
      },
    ]

    // Check which groups already exist to avoid duplicates
    const existingGroups = await groups.find({}).toArray()
    const existingTitles = existingGroups.map(group => group.title)
    
    const groupsToAdd = diverseGroups.filter(group => !existingTitles.includes(group.title))
    
    if (groupsToAdd.length > 0) {
      await groups.insertMany(groupsToAdd)
      console.log(`\n✅ Added ${groupsToAdd.length} new diverse groups to the database!`)
      
      // Show summary by category
      const groupsByCategory = {}
      groupsToAdd.forEach(group => {
        if (!groupsByCategory[group.category]) {
          groupsByCategory[group.category] = []
        }
        groupsByCategory[group.category].push(group.title)
      })
      
      console.log("\n📊 New groups added by category:")
      Object.keys(groupsByCategory).forEach(category => {
        console.log(`\n🎯 ${category}: ${groupsByCategory[category].length} groups`)
        groupsByCategory[category].forEach(title => {
          console.log(`   • ${title}`)
        })
      })
      
    } else {
      console.log("\n✅ All diverse groups already exist in the database!")
    }

    // Show final count and distribution
    const allGroups = await groups.find({}).toArray()
    const finalDistribution = {}
    
    allGroups.forEach(group => {
      if (!finalDistribution[group.category]) {
        finalDistribution[group.category] = 0
      }
      finalDistribution[group.category]++
    })

    console.log(`\n🎯 Total groups in database: ${allGroups.length}`)
    console.log("\n📈 Final distribution by category:")
    Object.keys(finalDistribution).sort().forEach(category => {
      console.log(`   ${category}: ${finalDistribution[category]} groups`)
    })

  } catch (error) {
    console.error("❌ Error adding diverse groups:", error)
  } finally {
    await client.close()
    console.log("\n🔌 Database connection closed")
  }
}

addDiverseGroups()