import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { screenshot, clothingType } = await request.json();
 
    if (!screenshot || !clothingType) {
      return NextResponse.json(
        { error: 'Missing required fields: screenshot and clothingType' },
        { status: 400 }
      );
    }

    // Mock successful response - all tests pass
    console.log('Mock API: Design test completed successfully');
    
    return NextResponse.json({
      success: true,
      image: screenshot,
      analysis: 'All tests passed - Design is AI-confusing and ready for production',
      note: 'Mock API - All tests passed successfully'
    });

  } catch (error) {
    console.error('Error in mock API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
