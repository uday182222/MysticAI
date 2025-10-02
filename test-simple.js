// Simple test to check if the issue is with OpenAI or database
const testOpenAI = async () => {
  console.log('🧪 Testing OpenAI directly...\n');
  
  try {
    // Test a simple OpenAI call without tools
    const response = await fetch('http://localhost:3000/api/numerology/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisType: 'personal',
        name: 'Test User',
        birthDate: '1990-01-01'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Numerology service working');
      console.log('Response keys:', Object.keys(data));
    } else {
      const error = await response.text();
      console.log('❌ Numerology service failed:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

testOpenAI();
