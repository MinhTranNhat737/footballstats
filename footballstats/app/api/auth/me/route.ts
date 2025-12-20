import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader) {
      // Không log error vì đây là trạng thái bình thường khi chưa login
      return NextResponse.json(
        { success: false, message: 'No authorization token' },
        { status: 401 }
      );
    }

    const response = await fetch(`${BACKEND_URL}/api/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    // Chỉ log error nếu không phải 401 (unauthorized)
    if (!response.ok && response.status !== 401) {
      console.error('Get user API error:', response.status, data);
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Get user API error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi kết nối server' },
      { status: 500 }
    );
  }
}
