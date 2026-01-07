import { NextResponse } from "next/server";

const API_BASE_URL = "http://localhost:8080"; // Your Fastify server URL

// Handle GET /api/key-value/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await fetch(`${API_BASE_URL}/api/key-value/${id}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { message: "Key value not found" },
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching key value:", error);
    return NextResponse.json(
      { message: "Failed to fetch key value" },
      { status: 500 }
    );
  }
}

// Handle PUT /api/key-value/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json(
        { message: 'Authorization header is required' },
        { status: 401 }
      );
    }

    const response = await fetch(`${API_BASE_URL}/api/key-value/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(
        { message: data.message || 'Failed to update key value' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating key value:', error);
    return NextResponse.json(
      { 
        message: 'Failed to update key value',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Handle DELETE /api/key-value/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const response = await fetch(`${API_BASE_URL}/api/key-value/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting key value:", error);
    return NextResponse.json(
      { message: "Failed to delete key value" },
      { status: 500 }
    );
  }
}
