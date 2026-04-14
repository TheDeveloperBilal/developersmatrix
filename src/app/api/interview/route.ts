import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

interface InterviewRequest {
  question: string;
  answer?: string;
  role?: string;
  difficulty?: 'entry' | 'mid' | 'senior';
  mode: 'question' | 'feedback' | 'followup';
  category?: 'behavioral' | 'technical' | 'system';
}

export async function POST(request: NextRequest) {
  try {
    const body: InterviewRequest = await request.json();
    const { question, answer, role = 'Software Developer', difficulty = 'mid', mode, category = 'behavioral' } = body;

    if (!mode) {
      return NextResponse.json(
        { error: 'Mode is required (question, feedback, or followup)' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    let systemPrompt = '';
    let userPrompt = '';

    switch (mode) {
      case 'question':
        systemPrompt = `You are an experienced interviewer for ${role} positions. Generate a realistic, challenging ${category} interview question for a ${difficulty}-level candidate. 

IMPORTANT GUIDELINES:
- Make questions specific and relevant to the role
- For behavioral: Focus on real-world scenarios, teamwork, problem-solving
- For technical: Focus on practical knowledge, not just definitions
- For system design: Focus on scalability, trade-offs, real-world constraints

Return ONLY the question text, nothing else. No explanations, no labels, just the question.`;
        
        userPrompt = `Generate a ${category} interview question for a ${difficulty}-level ${role} position. Make it specific and realistic.`;
        break;

      case 'feedback':
        if (!question || !answer) {
          return NextResponse.json(
            { error: 'Question and answer are required for feedback mode' },
            { status: 400 }
          );
        }
        
        systemPrompt = `You are a supportive but honest interview coach. Provide constructive feedback on interview answers.

FEEDBACK GUIDELINES:
- Be encouraging but honest about weaknesses
- Give specific, actionable improvement suggestions
- For behavioral answers: Check if STAR method was used effectively
- For technical answers: Check accuracy, depth, and clarity
- For system design: Check requirements gathering, trade-off discussion

RESPONSE FORMAT (use this exact JSON structure):
{
  "score": <number 1-10>,
  "strengths": ["<strength1>", "<strength2>"],
  "improvements": ["<improvement1>", "<improvement2>"],
  "detailedFeedback": "<2-3 sentence personalized feedback>",
  "sampleAnswer": "<brief example of a stronger answer approach>"
}

Be conversational and human-like. Avoid robotic or overly formal language.`;
        
        userPrompt = `I was asked this interview question for a ${role} position:

"${question}"

My answer was:
"${answer}"

Please provide feedback on my answer.`;
        break;

      case 'followup':
        if (!question || !answer) {
          return NextResponse.json(
            { error: 'Question and answer are required for followup mode' },
            { status: 400 }
          );
        }
        
        systemPrompt = `You are an experienced interviewer who asks insightful follow-up questions based on candidate answers.

FOLLOW-UP GUIDELINES:
- Dig deeper into specific points mentioned
- Challenge assumptions or explore edge cases
- Ask about trade-offs or alternatives
- Make it feel like a natural conversation

Return ONLY the follow-up question text, nothing else.`;
        
        userPrompt = `The candidate answered this ${category} question for a ${role} position:

Question: "${question}"

Their answer: "${answer}"

What would be a good follow-up question to dig deeper?`;
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid mode. Use "question", "feedback", or "followup"' },
          { status: 400 }
        );
    }

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: false,
      thinking: { type: 'disabled' }
    });

    const responseContent = completion.choices?.[0]?.message?.content;

    if (!responseContent) {
      return NextResponse.json(
        { error: 'Failed to generate response' },
        { status: 500 }
      );
    }

    // For feedback mode, try to parse as JSON
    if (mode === 'feedback') {
      try {
        // Try to extract JSON from the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return NextResponse.json({
            mode: 'feedback',
            ...parsed
          });
        }
      } catch {
        // If JSON parsing fails, return as text feedback
        return NextResponse.json({
          mode: 'feedback',
          score: 7,
          strengths: ['Clear communication'],
          improvements: ['Could provide more specific examples'],
          detailedFeedback: responseContent,
          sampleAnswer: ''
        });
      }
    }

    return NextResponse.json({
      mode,
      content: responseContent
    });

  } catch (error) {
    console.error('Interview API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}
