import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const dayNumber = formData.get('dayNumber') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Generate a unique filename using the day number and current timestamp
    const filename = `bhunu-quest-day-${dayNumber}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;

    const blob = await put(filename, file, {
      access: 'public',
    });

    return NextResponse.json(blob);
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
}
