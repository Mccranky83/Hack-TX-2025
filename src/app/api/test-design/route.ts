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

    // Mock successful test results - all tests pass
    console.log('Mock API: Design test completed - all tests passed');
    
    return NextResponse.json({
      success: true,
      testResults: {
        success: true,
        score: 95, // High confusion score - excellent privacy protection
        detectionCount: 0, // No detections - perfect confusion
        confidence: 0.1, // Very low confidence - AI is confused
        detections: [], // No detections found
        annotatedImage: screenshot, // Use original as annotated
        generatedImage: screenshot // Use original as generated
      }
    });

  } catch (error) {
    console.error('Error in mock test API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
