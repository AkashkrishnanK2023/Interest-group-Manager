const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testGroupDetails() {
  try {
    // First, login as admin to get token
    console.log("🔐 Logging in as admin...")
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
      console.log('❌ Admin login failed')
      return
    }

    const loginData = await loginResponse.json()
    const token = loginData.token
    console.log('✅ Admin login successful')

    // Get list of groups
    console.log("\n📋 Fetching groups...")
    const groupsResponse = await fetch('http://localhost:3000/api/groups', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!groupsResponse.ok) {
      console.log('❌ Failed to fetch groups')
      return
    }

    const groups = await groupsResponse.json()
    console.log(`✅ Found ${groups.length} groups`)

    if (groups.length === 0) {
      console.log('❌ No groups found to test')
      return
    }

    // Test the first group
    const testGroup = groups[0]
    console.log(`\n🔍 Testing group details for: "${testGroup.title}"`)
    console.log(`   Group ID: ${testGroup._id}`)

    // Get group details
    const groupDetailResponse = await fetch(`http://localhost:3000/api/groups/${testGroup._id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!groupDetailResponse.ok) {
      console.log('❌ Failed to fetch group details')
      return
    }

    const groupDetails = await groupDetailResponse.json()
    console.log('✅ Group details fetched successfully')
    console.log(`   Title: ${groupDetails.title}`)
    console.log(`   Description: ${groupDetails.description.substring(0, 100)}...`)
    console.log(`   Category: ${groupDetails.category}`)
    console.log(`   Visibility: ${groupDetails.visibility}`)
    console.log(`   Member Count: ${groupDetails.memberCount}`)
    console.log(`   Admin: ${groupDetails.adminName}`)
    console.log(`   Members in response: ${groupDetails.members ? groupDetails.members.length : 0}`)

    // Test members API
    console.log(`\n👥 Testing members API for group: "${testGroup.title}"`)
    const membersResponse = await fetch(`http://localhost:3000/api/groups/${testGroup._id}/members`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!membersResponse.ok) {
      console.log('❌ Failed to fetch members')
      return
    }

    const members = await membersResponse.json()
    console.log(`✅ Members fetched successfully: ${members.length} members`)
    
    members.forEach((member, index) => {
      console.log(`   ${index + 1}. ${member.userId.name} (${member.status}) - ${member.role || 'member'}`)
    })

    console.log('\n🎉 All tests passed! Group details functionality is working correctly.')
    console.log('\n📝 You can now:')
    console.log('   1. Visit http://localhost:3000/groups')
    console.log('   2. Click "View Details" on any group')
    console.log('   3. See comprehensive group information and member lists')
    console.log('   4. Switch between Overview, Members, and other tabs')

  } catch (error) {
    console.error('❌ Error testing group details:', error.message)
  }
}

testGroupDetails()