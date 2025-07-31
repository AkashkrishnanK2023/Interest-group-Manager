const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testAdminAutoLogin() {
  console.log("🧪 TESTING AUTOMATIC ADMIN LOGIN")
  console.log("=" .repeat(50))
  
  try {
    console.log("🔐 Testing admin login with auto-created credentials...")
    console.log("   Username: admin")
    console.log("   Password: admin123")
    
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
      return false
    }

    const loginData = await loginResponse.json()
    console.log('✅ Admin login successful!')
    console.log(`   User ID: ${loginData.user._id}`)
    console.log(`   Email: ${loginData.user.email}`)
    console.log(`   Name: ${loginData.user.name}`)
    console.log(`   Token: ${loginData.token.substring(0, 20)}...`)

    // Test token validation by making an authenticated request
    console.log("\n🔍 Testing token validation...")
    const groupsResponse = await fetch('http://localhost:3000/api/groups', {
      headers: {
        'Authorization': `Bearer ${loginData.token}`
      }
    })

    if (groupsResponse.ok) {
      const groups = await groupsResponse.json()
      console.log(`✅ Token validation successful!`)
      console.log(`   Fetched ${groups.length} groups`)
    } else {
      console.log('❌ Token validation failed!')
      return false
    }

    console.log("\n" + "=" .repeat(50))
    console.log("🎉 ADMIN AUTO-LOGIN TEST PASSED!")
    console.log("✅ Admin user is properly created and functional")
    console.log("✅ Login API works with admin credentials")
    console.log("✅ JWT token generation and validation works")
    console.log("✅ Authenticated API requests work")
    console.log("=" .repeat(50))

    return true

  } catch (error) {
    console.error('❌ Test failed with error:', error.message)
    return false
  }
}

// Run the test
testAdminAutoLogin().then(success => {
  if (success) {
    console.log("\n🚀 Ready to use the application!")
    console.log("   Visit: http://localhost:3000/login")
    console.log("   Login: admin / admin123")
  } else {
    console.log("\n❌ Admin setup needs attention")
    console.log("   Run: npm run auto-admin")
    console.log("   Or: npm run init-full")
  }
})