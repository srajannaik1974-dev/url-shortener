'use strict';

const prisma = require('./src/config/database');

const BASE_URL = 'http://localhost:3000';
const TEST_USER = {
    name: 'Test Verifier',
    email: 'verifier@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
};

const TEST_USER_2 = {
    name: 'Test Verifier Second',
    email: 'verifier2@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!'
};

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    console.log('🚀 Starting URL Shortener Verification Tests...');

    // 1. Auth Setup
    let token1, token2;

    // Register or login first user
    try {
        console.log('\n--- Setting up User 1 ---');
        let res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER)
        });
        let data = await res.json();
        if (res.status === 201) {
            console.log('✅ User 1 registered successfully');
            token1 = data.data.token;
        } else {
            // Try log in
            res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: TEST_USER.email, password: TEST_USER.password })
            });
            data = await res.json();
            if (res.status === 200) {
                console.log('✅ User 1 logged in successfully');
                token1 = data.data.token;
            } else {
                throw new Error('User 1 setup failed: ' + JSON.stringify(data));
            }
        }
    } catch (e) {
        console.error('❌ User 1 setup failed:', e.message);
        process.exit(1);
    }

    // Register or login second user
    try {
        console.log('\n--- Setting up User 2 ---');
        let res = await fetch(`${BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(TEST_USER_2)
        });
        let data = await res.json();
        if (res.status === 201) {
            console.log('✅ User 2 registered successfully');
            token2 = data.data.token;
        } else {
            // Try log in
            res = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: TEST_USER_2.email, password: TEST_USER_2.password })
            });
            data = await res.json();
            if (res.status === 200) {
                console.log('✅ User 2 logged in successfully');
                token2 = data.data.token;
            } else {
                throw new Error('User 2 setup failed: ' + JSON.stringify(data));
            }
        }
    } catch (e) {
        console.error('❌ User 2 setup failed:', e.message);
        process.exit(1);
    }

    // Clean any prior testing URLs for these users
    await prisma.url.deleteMany({
        where: {
            user: {
                email: { in: [TEST_USER.email, TEST_USER_2.email] }
            }
        }
    });
    console.log('🧹 Cleaned existing URLs for test users');

    let shortUrlData1;
    let shortUrlData2;

    // 2. Create URL for User 1 (Anonymous/Without Custom Alias)
    try {
        console.log('\n--- Test 2.1: Create Standard URL ---');
        const res = await fetch(`${BASE_URL}/api/urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token1}`
            },
            body: JSON.stringify({
                originalUrl: 'https://github.com/google'
            })
        });
        const data = await res.json();
        if (res.status === 201) {
            console.log('✅ Standard URL created successfully!');
            console.log('   Short Code:', data.data.shortCode);
            console.log('   Shortened URL:', data.data.shortenedUrl);
            shortUrlData1 = data.data;
        } else {
            console.error('❌ Test failed:', data);
        }
    } catch (e) {
        console.error('❌ Test 2.1 Error:', e);
    }

    // 3. Create URL for User 1 (With Custom Alias)
    try {
        console.log('\n--- Test 2.2: Create URL with Custom Alias ---');
        const res = await fetch(`${BASE_URL}/api/urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token1}`
            },
            body: JSON.stringify({
                originalUrl: 'https://news.ycombinator.com',
                customAlias: 'hn-custom-alias'
            })
        });
        const data = await res.json();
        if (res.status === 201) {
            console.log('✅ URL with Custom Alias created successfully!');
            console.log('   Alias:', data.data.customAlias);
            console.log('   Shortened URL:', data.data.shortenedUrl);
            shortUrlData2 = data.data;
        } else {
            console.error('❌ Test failed:', data);
        }
    } catch (e) {
        console.error('❌ Test 2.2 Error:', e);
    }

    // 4. Try to create duplicate custom alias
    try {
        console.log('\n--- Test 3: Create Duplicate Custom Alias (Should Fail) ---');
        const res = await fetch(`${BASE_URL}/api/urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token2}`
            },
            body: JSON.stringify({
                originalUrl: 'https://google.com',
                customAlias: 'hn-custom-alias'
            })
        });
        const data = await res.json();
        if (res.status === 409) {
            console.log('✅ Success: Properly rejected duplicate alias with 409 Conflict!');
            console.log('   Message:', data.message);
        } else {
            console.error('❌ Fail: Did not reject duplicate alias or returned incorrect status:', res.status, data);
        }
    } catch (e) {
        console.error('❌ Test 3 Error:', e);
    }

    // 5. Try creating a URL with invalid body
    try {
        console.log('\n--- Test 4: Create URL with Invalid Inputs (Should Fail) ---');
        const res = await fetch(`${BASE_URL}/api/urls`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token1}`
            },
            body: JSON.stringify({
                originalUrl: 'not_a_valid_url',
                customAlias: 'a' // too short
            })
        });
        const data = await res.json();
        if (res.status === 400) {
            console.log('✅ Success: Properly rejected invalid inputs with 400 Bad Request!');
            console.log('   Errors:', data.errors || data);
        } else {
            console.error('❌ Fail: Did not return 400 for validation errors:', res.status, data);
        }
    } catch (e) {
        console.error('❌ Test 4 Error:', e);
    }

    // 6. Redirect test for standard URL
    if (shortUrlData1) {
        try {
            console.log('\n--- Test 5.1: Redirect Standard URL ---');
            const res = await fetch(`${BASE_URL}/${shortUrlData1.shortCode}`, {
                redirect: 'manual'
            });
            if (res.status === 302) {
                console.log('✅ Success: Received 302 Redirect!');
                console.log('   Redirect Location:', res.headers.get('location'));
            } else {
                console.error('❌ Fail: Expected 302 redirect but got:', res.status);
            }
        } catch (e) {
            console.error('❌ Test 5.1 Error:', e);
        }
    }

    // 7. Redirect test for Custom Alias
    if (shortUrlData2) {
        try {
            console.log('\n--- Test 5.2: Redirect Custom Alias ---');
            const res = await fetch(`${BASE_URL}/${shortUrlData2.customAlias}`, {
                redirect: 'manual'
            });
            if (res.status === 302) {
                console.log('✅ Success: Received 302 Redirect for Custom Alias!');
                console.log('   Redirect Location:', res.headers.get('location'));
            } else {
                console.error('❌ Fail: Expected 302 redirect but got:', res.status);
            }
        } catch (e) {
            console.error('❌ Test 5.2 Error:', e);
        }
    }

    // 8. List URLs and verify click count incremented
    try {
        console.log('\n--- Test 6: List User URLs and Verify Click Counts ---');
        const res = await fetch(`${BASE_URL}/api/urls?page=1&limit=5`, {
            headers: {
                'Authorization': `Bearer ${token1}`
            }
        });
        const data = await res.json();
        if (res.status === 200) {
            console.log('✅ Success: Fetched list of URLs');
            console.log('   Meta:', data.meta);
            data.data.forEach(item => {
                console.log(`   Shortened URL: ${item.shortenedUrl} | Clicks: ${item.clicks} | Expiry: ${item.expiresAt}`);
            });
            // Double check click count increments
            const url1 = data.data.find(item => item.id === shortUrlData1.id);
            const url2 = data.data.find(item => item.id === shortUrlData2.id);
            if (url1 && url1.clicks === 1 && url2 && url2.clicks === 1) {
                console.log('✅ Success: Clicks incremented correctly for both redirects!');
            } else {
                console.error('❌ Fail: Click count increment mismatch. Got:', {
                    url1Clicks: url1 ? url1.clicks : 'not found',
                    url2Clicks: url2 ? url2.clicks : 'not found'
                });
            }
        } else {
            console.error('❌ Fail:', data);
        }
    } catch (e) {
        console.error('❌ Test 6 Error:', e);
    }

    // 9. Verify redirection of Expired and Inactive URL
    if (shortUrlData1) {
        try {
            console.log('\n--- Test 7: Expired and Inactive Redirect Flow ---');

            // Set expired and inactive directly in Prisma db
            console.log('   Updating DB using Prisma directly to make URL inactive/expired...');
            const pastDate = new Date(Date.now() - 3600000); // 1 hour ago

            await prisma.url.update({
                where: { id: shortUrlData1.id },
                data: { isActive: false }
            });

            let res = await fetch(`${BASE_URL}/${shortUrlData1.shortCode}`, { redirect: 'manual' });
            let data = await res.json().catch(() => ({}));

            if (res.status === 400 || res.status === 404) {
                console.log(`✅ Success: Inactive URL redirection rejected with ${res.status}!`);
                console.log('   Message:', data.message);
            } else {
                console.error('❌ Fail: Inactive URL redirect did not abort with 4xx, got:', res.status, data);
            }

            // Test expired URL (make active, but expired)
            await prisma.url.update({
                where: { id: shortUrlData1.id },
                data: { isActive: true, expiresAt: pastDate }
            });

            res = await fetch(`${BASE_URL}/${shortUrlData1.shortCode}`, { redirect: 'manual' });
            data = await res.json().catch(() => ({}));

            if (res.status === 410) {
                console.log('✅ Success: Expired URL redirection rejected with 410 Gone!');
                console.log('   Message:', data.message);
            } else {
                console.error('❌ Fail: Expired URL redirect did not return 410, got:', res.status, data);
            }
        } catch (e) {
            console.error('❌ Test 7 Error:', e);
        }
    }

    // 10. Delete URLs and test unauthorized deletion
    if (shortUrlData1 && shortUrlData2) {
        try {
            console.log('\n--- Test 8.1: Unauthorized Deletion ---');
            // Try deleting User 1's URL using User 2's token
            let res = await fetch(`${BASE_URL}/api/urls/${shortUrlData1.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token2}`
                }
            });
            let data = await res.json();
            if (res.status === 403) {
                console.log('✅ Success: Properly rejected unauthorized delete with 403 Forbidden!');
                console.log('   Message:', data.message);
            } else {
                console.error('❌ Fail: Did not reject unauthorized deletion with 403, got:', res.status, data);
            }

            console.log('\n--- Test 8.2: Authorized Deletion ---');
            // Delete User 1's URL 1 using User 1's token
            res = await fetch(`${BASE_URL}/api/urls/${shortUrlData1.id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token1}`
                }
            });
            data = await res.json();
            if (res.status === 200) {
                console.log('✅ Success: URL deleted by owner successfully!');
                console.log('   Message:', data.meta.message);
            } else {
                console.error('❌ Fail: Owner deletion failed:', res.status, data);
            }

            // Verify deleted URL redirection returns 404
            res = await fetch(`${BASE_URL}/${shortUrlData1.shortCode}`, { redirect: 'manual' });
            data = await res.json().catch(() => ({}));
            if (res.status === 404) {
                console.log('✅ Success: Redirection to deleted URL returns 404!');
            } else {
                console.error('❌ Fail: Redirection to deleted URL did not return 404, got:', res.status);
            }

        } catch (e) {
            console.error('❌ Test 8 Error:', e);
        }
    }

    console.log('\n📊 All Verifications Finished!');
    process.exit(0);
}

runTests();
