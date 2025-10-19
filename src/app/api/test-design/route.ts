import { NextRequest, NextResponse } from 'next/server';

// Calculate confusion score based on AI detection results
function calculateConfusionScore(inferenceResult: any): number {
  const { detection_count, confidence, detections } = inferenceResult;
  
  // Base confusion score starts at 100 (perfect confusion)
  let confusionScore = 100;
  
  // If no detections, that's perfect confusion (100%)
  if (detection_count === 0) {
    return 100;
  }
  
  // If there are detections, reduce confusion score based on confidence
  // Higher confidence = lower confusion score (worse for privacy)
  if (detection_count > 0) {
    // Reduce score based on detection confidence
    // If confidence is 0.9, confusion score becomes 10 (very bad)
    // If confidence is 0.1, confusion score becomes 90 (very good)
    confusionScore = Math.round((1 - confidence) * 100);
    
    // Additional penalty for multiple detections
    if (detection_count > 1) {
      confusionScore -= (detection_count - 1) * 10;
    }
    
    // Bonus for low confidence detections
    if (confidence < 0.3) {
      confusionScore += 20; // Bonus for very uncertain detections
    }
  }
  
  // Ensure score is between 0 and 100
  return Math.max(0, Math.min(100, confusionScore));
}

export async function POST(request: NextRequest) {
  try {
    const { screenshot, clothingType } = await request.json();
    
    if (!screenshot || !clothingType) {
      return NextResponse.json(
        { error: 'Missing required fields: screenshot and clothingType' },
        { status: 400 }
      );
    }

    // Step 1: Generate image using Gemini API
    const generateResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/generate-image`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        screenshot,
        clothingType
      })
    });

    if (!generateResponse.ok) {
      const errorData = await generateResponse.json();
      return NextResponse.json(
        { error: `Failed to generate image: ${errorData.error}` },
        { status: 500 }
      );
    }

    const { image: generatedImage } = await generateResponse.json();

    // Step 2: Run inference on the generated image
    const inferenceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/inference`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: generatedImage
      })
    });

    if (!inferenceResponse.ok) {
      const errorData = await inferenceResponse.json();
      return NextResponse.json(
        { error: `Failed to run inference: ${errorData.error}` },
        { status: 500 }
      );
    }

    const inferenceResult = await inferenceResponse.json();

    // Calculate confusion score - measures how well the design confuses AI detection
    const confusionScore = calculateConfusionScore(inferenceResult);
    const success = confusionScore > 70; // High confusion score means good privacy protection

    return NextResponse.json({
      success: true,
      testResults: {
        success,
        score: confusionScore,
        detectionCount: inferenceResult.detection_count,
        confidence: inferenceResult.confidence,
        detections: inferenceResult.detections,
        annotatedImage: inferenceResult.annotated_image,
        generatedImage: generatedImage
      }
    });

  } catch (error) {
    console.error('Error testing design:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
