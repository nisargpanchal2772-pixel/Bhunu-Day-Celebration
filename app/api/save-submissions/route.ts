import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const submissions = await request.json();
    
    // Save to Vercel Blob store with addRandomSuffix: false to overwrite
    const blob = await put('bhunu-quest-submissions.json', JSON.stringify(submissions, null, 2), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });

    return NextResponse.json({ success: true, url: blob.url });
  } catch (error) {
    console.error('Error syncing submissions to Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to sync submissions to cloud' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    // Read the password from the headers or query parameters
    const { searchParams } = new URL(request.url);
    const password = request.headers.get('x-admin-password') || searchParams.get('password');
    
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // List blobs to find the JSON file
    const { blobs } = await list();
    const submissionsBlob = blobs.find((b) => b.pathname === 'bhunu-quest-submissions.json');

    if (!submissionsBlob) {
      return NextResponse.json({}, { status: 200 }); // Return empty if not found yet
    }

    // Fetch the contents of the blob
    const res = await fetch(submissionsBlob.url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to fetch blob contents: ${res.statusText}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching submissions from Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to retrieve submissions' }, { status: 500 });
  }
}
