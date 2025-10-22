// test-jwt.js
const jwt = require('jsonwebtoken');

const SECRET = '3f7a8b2c9d1e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9';

try {
  const token = jwt.sign(
    { userId: 1, email: 'test@example.com' },
    SECRET,
    { expiresIn: '1h' }
  );
  
  console.log('✅ Token generated:', token.substring(0, 50) + '...');
  
  const decoded = jwt.verify(token, SECRET);
  console.log('✅ Token verified:', decoded);
} catch (error) {
  console.log('❌ Error:', error.message);
}