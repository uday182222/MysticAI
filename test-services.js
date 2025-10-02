// Quick test script to verify all services are working
const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing MysticAI Services...\n');
  
  // Test 1: Server is running
  try {
    const response = await fetch(`${baseUrl}`);
    console.log('✅ Server is running');
  } catch (error) {
    console.log('❌ Server is not running:', error.message);
    return;
  }
  
  // Test 2: Auth endpoint
  try {
    const response = await fetch(`${baseUrl}/api/auth/me`);
    const data = await response.json();
    console.log('✅ Auth endpoint working:', data.message);
  } catch (error) {
    console.log('❌ Auth endpoint failed:', error.message);
  }
  
  // Test 3: Numerology endpoint
  try {
    const response = await fetch(`${baseUrl}/api/numerology/analyze`, {
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
    } else {
      const error = await response.text();
      console.log('❌ Numerology service failed:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Numerology service error:', error.message);
  }
  
  // Test 4: Astrology endpoint
  try {
    const response = await fetch(`${baseUrl}/api/astrology/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        birthDate: '1990-01-01',
        birthTime: '12:00',
        birthPlace: 'New York'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Astrology service working');
    } else {
      const error = await response.text();
      console.log('❌ Astrology service failed:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Astrology service error:', error.message);
  }
  
  // Test 5: Tarot endpoint
  try {
    const response = await fetch(`${baseUrl}/api/tarot/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        spreadType: 'three-card',
        question: 'What does the future hold?',
        drawnCards: [
          { cardName: 'The Fool', suit: 'Major Arcana', position: 'Past', reversed: false },
          { cardName: 'The Magician', suit: 'Major Arcana', position: 'Present', reversed: false },
          { cardName: 'The World', suit: 'Major Arcana', position: 'Future', reversed: false }
        ]
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Tarot service working');
    } else {
      const error = await response.text();
      console.log('❌ Tarot service failed:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Tarot service error:', error.message);
  }
  
  console.log('\n🎯 Service test complete!');
};

testEndpoints();
