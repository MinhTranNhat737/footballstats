import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'football-app-secret-key-change-in-production';

// GET favorite clubs
export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if token is valid format (should have 3 parts separated by dots)
    if (token.split('.').length !== 3) {
      console.log('❌ Token malformed:', token.substring(0, 20) + '...');
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    console.log('🔑 Verifying token with JWT_SECRET...');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    console.log('✅ Token verified, userId:', decoded.userId);
    
    const [rows] = await pool.query(
      'SELECT favorite_clubs FROM users WHERE user_id = ?',
      [decoded.userId]
    );

    const users = rows as any[];
    
    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const favoriteClubs = users[0].favorite_clubs 
      ? JSON.parse(users[0].favorite_clubs)
      : [];

    console.log('📋 Favorite clubs:', favoriteClubs);

    return NextResponse.json({ 
      success: true, 
      favoriteClubs 
    });
  } catch (error) {
    console.error('Get favorite clubs error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// POST/PUT favorite clubs
export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      console.log('❌ No token provided');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if token is valid format
    if (token.split('.').length !== 3) {
      console.log('❌ Token malformed:', token.substring(0, 20) + '...');
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    console.log('🔑 Verifying token for POST...');
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    console.log('✅ Token verified, userId:', decoded.userId);
    
    const { favoriteClubs } = await request.json();
    console.log('💾 Saving favorite clubs:', favoriteClubs);

    if (!Array.isArray(favoriteClubs)) {
      return NextResponse.json({ 
        error: 'favoriteClubs must be an array' 
      }, { status: 400 });
    }

    console.log('✅ Đã thêm CLB thành công! User:', decoded.userId, 'Clubs:', favoriteClubs.length);

    await pool.query(
      'UPDATE users SET favorite_clubs = ? WHERE user_id = ?',
      [JSON.stringify(favoriteClubs), decoded.userId]
    );

    return NextResponse.json({ 
      success: true,
      message: 'Favorite clubs updated successfully',
      favoriteClubs
    });
  } catch (error) {
    console.error('Update favorite clubs error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
