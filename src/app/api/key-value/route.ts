import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function to generate a unique key
const generateKey = () => `key_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

// Handle GET /api/key-value
export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization");

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const response = await fetch(`${API_BASE_URL}/api/key-value`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || "Failed to fetch key-value pairs" },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching key-value pairs:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const auth = request.headers.get("authorization");

    if (!auth) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Generate a unique key for the first attempt
    const key = generateKey();
    
    // First attempt
    let response = await fetch(`${API_BASE_URL}/api/key-value`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify({
        key,
        value: body.value,
        price: body.price,
      }),
    });

    let data = await response.json().catch(() => ({}));

    // If we get a duplicate key error, try once more with a new key
    if (response.status === 400 && data.error?.includes('duplicate key')) {
      const newKey = generateKey();
      response = await fetch(`${API_BASE_URL}/api/key-value`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth,
        },
        body: JSON.stringify({
          key: newKey,
          value: body.value,
          price: body.price,
        }),
      });
      data = await response.json().catch(() => ({}));
    }

    if (!response.ok) {
      const errorMessage = data.message || 'Failed to create key-value pair';
      return NextResponse.json(
        { message: errorMessage, error: data.error },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error('Error in POST /api/key-value:', err);
    return NextResponse.json(
      { 
        message: "Internal server error",
        error: err instanceof Error ? err.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
