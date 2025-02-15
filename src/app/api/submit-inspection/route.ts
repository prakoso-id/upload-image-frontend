import { NextResponse } from 'next/server';
import { InspectionForm } from '@/types/inspection';

export async function POST(request: Request) {
  try {
    const data: InspectionForm = await request.json();

    // In a real application, you would save this data to a database
    console.log('Received inspection data:', data);

    return NextResponse.json({
      message: 'Inspection form submitted successfully',
    });
  } catch (error) {
    console.error('Error submitting inspection form:', error);
    return NextResponse.json(
      { error: 'Failed to submit inspection form' },
      { status: 500 }
    );
  }
}
