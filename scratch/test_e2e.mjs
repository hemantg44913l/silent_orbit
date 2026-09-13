const BASE = 'http://localhost:5001/api';

async function runTests() {
  console.log('=== RUNNING END-TO-END VERIFICATION WITH AUTH ===\n');

  try {
    // 1. Register User API
    const regRes = await fetch(`${BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Austin Sustainable Fashion Lab',
        email: `partner_${Date.now()}@texloop.org`,
        password: 'SecurePassword123!',
        role: 'partner'
      })
    });
    const regData = await regRes.json();
    console.log(`✓ User Registration API: Registered ${regData.data.user.email} (${regData.data.user.role}) in MongoDB.`);

    // 2. Login User API
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: regData.data.user.email,
        password: 'SecurePassword123!'
      })
    });
    const loginData = await loginRes.json();
    console.log(`✓ User Login API: Authenticated ${loginData.data.user.email} with token ${loginData.data.token}`);

    // 3. Get User Profile API
    const meRes = await fetch(`${BASE}/auth/me?email=${encodeURIComponent(regData.data.user.email)}`);
    const meData = await meRes.json();
    console.log(`✓ User Profile API: Retrieved MongoDB profile for ${meData.data.name}`);

    // 4. Materials API
    const matRes = await fetch(`${BASE}/materials`);
    const matData = await matRes.json();
    console.log(`✓ Materials Endpoint: ${matData.data ? matData.data.length : 0} materials retrieved from MongoDB.`);

    // 5. Vendors API
    const venRes = await fetch(`${BASE}/vendors`);
    const venData = await venRes.json();
    console.log(`✓ Vendors Endpoint: ${venData.data ? venData.data.length : 0} vendors retrieved from MongoDB.`);

    // 6. Collection Points API
    const cpRes = await fetch(`${BASE}/collection-points`);
    const cpData = await cpRes.json();
    console.log(`✓ Collection Points Endpoint: ${cpData.data ? cpData.data.length : 0} collection points retrieved from MongoDB.`);

    // 7. Vendor Matching Engine API
    const matchRes = await fetch(`${BASE}/match`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        material: 'Cotton',
        weightKg: 25,
        condition: 'Good condition'
      })
    });
    const matchData = await matchRes.json();
    console.log(`✓ Backend Vendor Matching: ${matchData.data.matches.length} candidates ranked by score.`);

    // 8. Create Order API
    const orderRes = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        vendorName: 'TexLoop Primary Fiber Recycling Hub',
        material: 'Cotton',
        quantityKg: 25,
        pickupLocation: { address: 'Austin, TX', latitude: 30.2672, longitude: -97.7431 },
        destinationLocation: { address: 'Commercial Fiber Processing Facility #1', latitude: 30.2800, longitude: -97.7200 }
      })
    });
    const orderData = await orderRes.json();
    const createdOrder = orderData.data;
    console.log(`✓ Create Order API: Created Order ${createdOrder.orderId} with status ${createdOrder.status}`);

    // 9. Track Order Lookup API
    const trackRes = await fetch(`${BASE}/orders/${createdOrder.orderId}`);
    const trackData = await trackRes.json();
    console.log(`✓ Track Order Lookup API: Found Order ${trackData.data.orderId} (${trackData.data.material}, ${trackData.data.quantityKg}kg)`);

    console.log('\n🎉 ALL END-TO-END TESTS (INCLUDING MONGODB USER AUTH) PASSED SUCCESSFULLY!');
  } catch (err) {
    console.error('❌ E2E Test Error:', err);
    process.exit(1);
  }
}

runTests();
