import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Request Format (POST /api/analyze)
 *
 * Request Body:
 * {
 *   "beanName": string,        // e.g., "Ethiopian Yirgacheffe"
 *   "roastLevel": number,      // 0-4 (0=Light, 1=Light-Medium, 2=Medium, 3=Medium-Dark, 4=Dark)
 *   "grinderModel": string,    // e.g., "Comandante C40"
 *   "grindSize": number,       // e.g., 20
 *   "grindUnit": string        // "clicks" | "microns"
 * }
 *
 * Response Format:
 * {
 *   "success": boolean,
 *   "data": {
 *     "tasteProfile": {
 *       "acidity": number,      // 0-100
 *       "sweetness": number,    // 0-100
 *       "bitterness": number,   // 0-100
 *       "body": number,         // 0-100
 *       "balance": number       // 0-100
 *     },
 *     "overallScore": number,   // 0-100
 *     "comment": string,        // AI-generated detailed analysis (1-2 sentences)
 *     "recommendations": {
 *       "waterTemp": string,    // e.g., "93-96°C (higher range)"
 *       "grindAdjustment": string,  // e.g., "Decrease grind size by 1-2 clicks"
 *       "brewTime": string      // e.g., "Extend to 3:30-4:00 min"
 *     }
 *   },
 *   "error"?: string            // Only present if success is false
 * }
 */

interface CoffeeAnalysisRequest {
  beanName: string;
  roastLevel: number;
  grinderModel: string;
  grindSize: number;
  grindUnit: 'clicks' | 'microns';
}

interface TasteProfile {
  acidity: number;
  sweetness: number;
  bitterness: number;
  body: number;
  balance: number;
}

interface Recommendations {
  waterTemp: string;
  grindAdjustment: string;
  brewTime: string;
}

interface AnalysisResult {
  tasteProfile: TasteProfile;
  overallScore: number;
  comment: string;
  recommendations: Recommendations;
}

const roastLevelNames = ['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'];

export async function POST(request: NextRequest) {
  try {
    const body: CoffeeAnalysisRequest = await request.json();

    // Validation
    if (!body.beanName || body.roastLevel === undefined || !body.grinderModel || !body.grindSize) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check for API key
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in environment variables');
      // Return mock data if no API key is set
      return NextResponse.json({
        success: true,
        data: generateMockResult(body),
      });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(apiKey);
    // Using Gemini 2.5 Flash for fast, high-quality analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create detailed prompt for Gemini
    const prompt = `You are a professional coffee expert and barista with deep knowledge of coffee extraction science, flavor profiles, and brewing parameters.

Analyze the following coffee brewing setup and provide a detailed taste prediction:

Coffee Bean: ${body.beanName}
Roast Level: ${roastLevelNames[body.roastLevel]} (${body.roastLevel}/4)
Grinder: ${body.grinderModel}
Grind Size: ${body.grindSize} ${body.grindUnit}

Based on this information, predict the taste profile and provide brewing recommendations.

You MUST respond with ONLY a valid JSON object in this EXACT format (no markdown, no code blocks, no explanations):

{
  "tasteProfile": {
    "acidity": <number between 20-95>,
    "sweetness": <number between 20-95>,
    "bitterness": <number between 20-95>,
    "body": <number between 20-95>,
    "balance": <number between 20-95>
  },
  "overallScore": <number between 50-95>,
  "comment": "<1-2 sentences analyzing the extraction quality and expected taste, mentioning the bean name>",
  "recommendations": {
    "waterTemp": "<specific temperature range in °C with brief context>",
    "grindAdjustment": "<specific advice on grind size adjustment>",
    "brewTime": "<specific brew time range in minutes>"
  }
}

Consider these brewing science principles:
- Light roasts: Higher acidity, more delicate sweetness, need higher water temp (93-96°C), finer grind
- Dark roasts: Lower acidity, more bitterness and body, need lower water temp (88-92°C), coarser grind
- Finer grind = more extraction = more bitterness/body
- Coarser grind = less extraction = more acidity/brightness
- Balance score should reflect how well the profile works together

Make the comment insightful and reference the specific bean and grinder settings.`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response
    let analysisData: AnalysisResult;
    try {
      // Remove markdown code blocks if present
      const cleanedText = text.replace(/```json\n?|\n?```/g, '').trim();
      analysisData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Fallback to mock data if parsing fails
      return NextResponse.json({
        success: true,
        data: generateMockResult(body),
      });
    }

    return NextResponse.json({
      success: true,
      data: analysisData,
    });

  } catch (error) {
    console.error('Error in /api/analyze:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Mock result generator (fallback when API key is not set or API fails)
function generateMockResult(inputData: CoffeeAnalysisRequest): AnalysisResult {
  const roastImpact = inputData.roastLevel;

  const baseAcidity = 85 - roastImpact * 10;
  const baseSweetness = 60 + roastImpact * 5;
  const baseBitterness = 40 + roastImpact * 12;
  const baseBody = 50 + roastImpact * 8;

  const acidity = Math.max(20, Math.min(95, baseAcidity + (Math.random() * 10 - 5)));
  const sweetness = Math.max(20, Math.min(95, baseSweetness + (Math.random() * 10 - 5)));
  const bitterness = Math.max(20, Math.min(95, baseBitterness + (Math.random() * 10 - 5)));
  const body = Math.max(20, Math.min(95, baseBody + (Math.random() * 10 - 5)));
  const balance = Math.max(
    20,
    Math.min(95, (acidity + sweetness + (100 - bitterness) + body) / 4)
  );

  const overallScore = Math.round((acidity + sweetness + body + balance - bitterness * 0.5) / 4);

  let comment = '';
  let waterTemp = '';
  let grindAdjustment = '';
  let brewTime = '';

  if (inputData.roastLevel >= 3) {
    comment = `Your ${inputData.beanName} with dark roast profile shows prominent bitterness and body. The current grind setting at ${inputData.grindSize} ${inputData.grindUnit} may lead to over-extraction. Consider adjusting your parameters for better balance.`;
    waterTemp = '88-92°C (lower range)';
    grindAdjustment = 'Increase grind size by 2-3 clicks';
    brewTime = 'Reduce to 2:30-3:00 min';
  } else if (inputData.roastLevel <= 1) {
    comment = `The light roast profile of ${inputData.beanName} brings bright acidity and delicate sweetness. Your current ${inputData.grinderModel} settings should preserve the nuanced flavors well. This is approaching an optimal extraction window.`;
    waterTemp = '93-96°C (higher range)';
    grindAdjustment = 'Decrease grind size by 1-2 clicks';
    brewTime = 'Extend to 3:30-4:00 min';
  } else {
    comment = `Your ${inputData.beanName} at medium roast offers excellent balance potential. The grind setting of ${inputData.grindSize} ${inputData.grindUnit} on your ${inputData.grinderModel} is in a good range. Fine-tune extraction for peak flavor.`;
    waterTemp = '90-94°C (medium range)';
    grindAdjustment = 'Current setting is optimal';
    brewTime = '3:00-3:30 min';
  }

  return {
    tasteProfile: {
      acidity: Math.round(acidity),
      sweetness: Math.round(sweetness),
      bitterness: Math.round(bitterness),
      body: Math.round(body),
      balance: Math.round(balance),
    },
    overallScore,
    comment,
    recommendations: {
      waterTemp,
      grindAdjustment,
      brewTime,
    },
  };
}
