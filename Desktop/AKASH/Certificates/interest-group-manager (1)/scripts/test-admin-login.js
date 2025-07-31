const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args))

async function testAdminLogin() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin',
        password: 'admin123'
      })
    })

    const data = await response.json()

    if (response.ok) {
      console.log('✅ Admin login successful!')
      console.log('User data:', {
        id: data.user._id,
        email: data.user.email,
        name: data.user.name,
        createdAt: data.user.createdAt
      })
      console.log('Token received:', data.token ? 'Yes' : 'No')
    } else {
      console.log('❌ Admin login failed!')
      console.log('Error:', data.error)
    }
  } catch (error) {
    console.error('❌ Error testing admin login:', error.message)
    console.log('Make sure the Next.js application is running on http://localhost:3000')
  }
}

testAdminLogin()