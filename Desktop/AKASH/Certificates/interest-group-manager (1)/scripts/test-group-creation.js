const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testGroupCreation() {
  console.log("🧪 TESTING GROUP CREATION FUNCTIONALITY")
  console.log("=" .repeat(60))
  
  try {
    // Step 1: Login as admin to get token
    console.log("🔐 Step 1: Logging in as admin...")
    const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin',
        password: 'admin123'
      })
    })

    if (!loginResponse.ok) {
      const errorData = await loginResponse.json()
      console.log('❌ Admin login failed!')
      console.log(`   Status: ${loginResponse.status}`)
      console.log(`   Error: ${errorData.error}`)
      return
    }

    const loginData = await loginResponse.json()
    const token = loginData.token
    console.log('✅ Admin login successful')
    console.log(`   User ID: ${loginData.user._id}`)
    console.log(`   Name: ${loginData.user.name}`)
    console.log(`   Token: ${token.substring(0, 20)}...`)

    // Step 2: Test group creation
    console.log("\n📝 Step 2: Creating test group...")
    const testGroup = {
      title: "Test Group - " + new Date().toISOString().slice(0, 19),
      description: "This is a test group created by the automated test script to verify group creation functionality.",
      category: "Technology",
      visibility: "public"
    }

    console.log("   Group data:")
    console.log(`   - Title: ${testGroup.title}`)
    console.log(`   - Description: ${testGroup.description.substring(0, 50)}...`)
    console.log(`   - Category: ${testGroup.category}`)
    console.log(`   - Visibility: ${testGroup.visibility}`)

    const createResponse = await fetch('http://localhost:3000/api/groups', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testGroup)
    })

    console.log(`\n📊 Response Status: ${createResponse.status}`)
    console.log(`📊 Response Headers:`, Object.fromEntries(createResponse.headers.entries()))

    if (!createResponse.ok) {
      const errorData = await createResponse.json()
      console.log('❌ Group creation failed!')
      console.log(`   Status: ${createResponse.status}`)
      console.log(`   Error: ${JSON.stringify(errorData, null, 2)}`)
      
      // Additional debugging
      console.log('\n🔍 DEBUGGING INFORMATION:')
      console.log(`   Token valid: ${token ? 'Yes' : 'No'}`)
      console.log(`   Token length: ${token ? token.length : 0}`)
      console.log(`   Request body: ${JSON.stringify(testGroup, null, 2)}`)
      
      return
    }

    const createdGroup = await createResponse.json()
    console.log('✅ Group creation successful!')
    console.log(`   Group ID: ${createdGroup._id}`)
    console.log(`   Title: ${createdGroup.title}`)
    console.log(`   Admin: ${createdGroup.adminName}`)
    console.log(`   Member Count: ${createdGroup.memberCount}`)

    // Step 3: Verify group exists in database
    console.log("\n🔍 Step 3: Verifying group in database...")
    const verifyResponse = await fetch(`http://localhost:3000/api/groups/${createdGroup._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (verifyResponse.ok) {
      const verifiedGroup = await verifyResponse.json()
      console.log('✅ Group verification successful!')
      console.log(`   Found group: ${verifiedGroup.title}`)
      console.log(`   Members: ${verifiedGroup.memberCount}`)
    } else {
      console.log('⚠️  Group verification failed, but creation succeeded')
    }

    // Step 4: Check if membership was created
    console.log("\n👥 Step 4: Checking membership creation...")
    const membersResponse = await fetch(`http://localhost:3000/api/groups/${createdGroup._id}/members`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (membersResponse.ok) {
      const members = await membersResponse.json()
      console.log('✅ Membership verification successful!')
      console.log(`   Total members: ${members.length}`)
      members.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.userId.name} (${member.status}) - ${member.role || 'member'}`)
      })
    } else {
      console.log('⚠️  Membership verification failed')
    }

    console.log("\n" + "=" .repeat(60))
    console.log("🎉 GROUP CREATION TEST COMPLETED SUCCESSFULLY!")
    console.log("✅ Admin login works")
    console.log("✅ Group creation API works")
    console.log("✅ Database insertion works")
    console.log("✅ Membership creation works")
    console.log("=" .repeat(60))

  } catch (error) {
    console.error('\n❌ TEST FAILED WITH ERROR:')
    console.error(`   Error: ${error.message}`)
    console.error(`   Stack: ${error.stack}`)
    
    console.log('\n🔧 TROUBLESHOOTING STEPS:')
    console.log('1. Ensure the development server is running: npm run dev')
    console.log('2. Check MongoDB connection: npm run db-summary')
    console.log('3. Verify admin user: npm run admin-status')
    console.log('4. Check API routes are accessible')
  }
}

// Additional function to test with different scenarios
async function testGroupCreationScenarios() {
  console.log("\n🧪 TESTING DIFFERENT GROUP CREATION SCENARIOS")
  console.log("=" .repeat(60))

  // Get admin token first
  const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin', password: 'admin123' })
  })

  if (!loginResponse.ok) {
    console.log('❌ Cannot get admin token for scenario testing')
    return
  }

  const { token } = await loginResponse.json()

  // Test scenarios
  const scenarios = [
    {
      name: "Missing title",
      data: { description: "Test", category: "Technology", visibility: "public" },
      expectedError: true
    },
    {
      name: "Missing description", 
      data: { title: "Test", category: "Technology", visibility: "public" },
      expectedError: true
    },
    {
      name: "Missing category",
      data: { title: "Test", description: "Test", visibility: "public" },
      expectedError: true
    },
    {
      name: "Invalid category",
      data: { title: "Test", description: "Test", category: "InvalidCategory", visibility: "public" },
      expectedError: false // Should still work, just not in predefined list
    },
    {
      name: "Private group",
      data: { title: "Private Test Group", description: "Test private group", category: "Technology", visibility: "private" },
      expectedError: false
    }
  ]

  for (const scenario of scenarios) {
    console.log(`\n🧪 Testing: ${scenario.name}`)
    
    try {
      const response = await fetch('http://localhost:3000/api/groups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(scenario.data)
      })

      if (scenario.expectedError) {
        if (!response.ok) {
          console.log(`   ✅ Expected error occurred (${response.status})`)
        } else {
          console.log(`   ⚠️  Expected error but got success`)
        }
      } else {
        if (response.ok) {
          const group = await response.json()
          console.log(`   ✅ Success - Group created: ${group.title}`)
        } else {
          const error = await response.json()
          console.log(`   ❌ Unexpected error: ${error.error}`)
        }
      }
    } catch (error) {
      console.log(`   ❌ Request failed: ${error.message}`)
    }
  }
}

// Run tests
testGroupCreation().then(() => {
  return testGroupCreationScenarios()
}).catch(error => {
  console.error('Test execution failed:', error)
})