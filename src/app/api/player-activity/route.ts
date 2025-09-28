import { NextResponse } from 'next/server';
import { mockPlayerActivity } from '@/lib/data';

export async function GET() {
  // In a real application, you would fetch this data from a database
  // that is populated by a cron job.
  return NextResponse.json(mockPlayerActivity);
}
