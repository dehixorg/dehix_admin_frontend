import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Input validation for update
function validateUpdateInput(data: unknown): data is { value: string; price?: number } {
  return (
    typeof data === 'object' &&
    data !== null &&
    'value' in data &&
    typeof (data as { value: unknown }).value === 'string' &&
    (!('price' in data) || typeof (data as { price: unknown }).price === 'number')
  );
}

// Handle GET /api/key-value/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization header is required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/key-value/${encodeURIComponent(params.id)}`,
      {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": authHeader,
          "Cache-Control": "no-cache"
        },
        next: { revalidate: 0 } // Disable cache for GET requests
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const status = response.status;
      const message = errorData.message || 
        status === 404 ? "Key value not found" : "Failed to fetch key-value pair";
      
      return NextResponse.json(
        { message },
        { status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in GET /api/key-value/${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle PUT /api/key-value/[id]
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization header is required" },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    
    if (!validateUpdateInput(body)) {
      return NextResponse.json(
        { message: "Invalid request body" },
        { status: 400 }
      );
    }
    
    const response = await fetch(
      `${API_BASE_URL}/api/key-value/${encodeURIComponent(params.id)}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Failed to update key-value pair" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Error in PUT /api/key-value/${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Handle DELETE /api/key-value/[id]
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader) {
    return NextResponse.json(
      { message: "Authorization header is required" },
      { status: 401 }
    );
  }

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/key-value/${encodeURIComponent(params.id)}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": authHeader,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || "Failed to delete key-value pair" },
        { status: response.status }
      );
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(`Error in DELETE /api/key-value/${params.id}:`, error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
