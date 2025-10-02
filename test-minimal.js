// Minimal test to isolate the issue
const testMinimal = async () => {
  console.log('🧪 Testing minimal endpoint...\n');
  
  try {
    // Test a simple endpoint first
    const response = await fetch('http://localhost:3000/api/auth/me');
    const data = await response.json();
    console.log('✅ Auth endpoint working:', data.message);
    
    // Now test if the issue is in the OpenAI service
    console.log('\n🔍 Testing OpenAI service directly...');
    
    // Let's try to call the OpenAI service function directly
    // by creating a simple test endpoint
    const testResponse = await fetch('http://localhost:3000/api/test-openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: true })
    });
    
    if (testResponse.ok) {
      const testData = await testResponse.json();
      console.log('✅ Test endpoint working');
    } else {
      console.log('❌ Test endpoint failed:', testResponse.status);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testMinimal();
