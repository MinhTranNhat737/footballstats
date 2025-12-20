// Test script để kiểm tra login API
// Chạy: node backend/database/test_login.js

const fetch = require('node-fetch');

async function testLogin() {
    console.log('🧪 Testing login API...\n');

    try {
        // Test 1: Login với admin
        console.log('1️⃣ Testing admin login...');
        const adminResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'admin',
                password: 'admin123'
            })
        });

        const adminData = await adminResponse.json();
        console.log('Response status:', adminResponse.status);
        console.log('Response data:', JSON.stringify(adminData, null, 2));

        if (adminData.success) {
            console.log('✅ Admin login successful!');
            console.log('Token:', adminData.data.token.substring(0, 50) + '...');
            
            // Test 2: Get current user với token
            console.log('\n2️⃣ Testing getCurrentUser with token...');
            const meResponse = await fetch('http://localhost:3000/api/auth/me', {
                headers: {
                    'Authorization': `Bearer ${adminData.data.token}`
                }
            });

            const meData = await meResponse.json();
            console.log('Response status:', meResponse.status);
            console.log('Response data:', JSON.stringify(meData, null, 2));

            if (meData.success) {
                console.log('✅ Get current user successful!');
            } else {
                console.log('❌ Get current user failed!');
            }
        } else {
            console.log('❌ Admin login failed!');
        }

        // Test 3: Login với user
        console.log('\n3️⃣ Testing regular user login...');
        const userResponse = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: 'user',
                password: 'user123'
            })
        });

        const userData = await userResponse.json();
        console.log('Response status:', userResponse.status);
        console.log('Response data:', JSON.stringify(userData, null, 2));

        if (userData.success) {
            console.log('✅ User login successful!');
        } else {
            console.log('❌ User login failed!');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

testLogin();
