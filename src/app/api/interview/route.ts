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
      ]
    });

    const responseContent = completion.choices?.[0]?.message?.content;

    if (!responseContent) {
      // Return fallback response instead of error
      if (mode === 'question') {
        return NextResponse.json({
          mode: 'question',
          content: getFallbackQuestion(category, role, difficulty)
        });
      }
      return NextResponse.json(
        { error: 'Failed to generate response. Please try again.' },
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
    
    // Return fallback for question mode
    const body = await request.clone().json().catch(() => ({}));
    if (body.mode === 'question') {
      return NextResponse.json({
        mode: 'question',
        content: getFallbackQuestion(body.category || 'behavioral', body.role || 'Software Developer', body.difficulty || 'mid')
      });
    }
    
    return NextResponse.json(
      { error: 'An error occurred while processing your request. Please try again.' },
      { status: 500 }
    );
  }
}

// Fallback questions in case API fails
function getFallbackQuestion(category: string, role: string, difficulty: string): string {
  const questions: Record<string, Record<string, string[]>> = {
    behavioral: {
      entry: [
        `Tell me about a time you had to learn something new quickly. How did you approach it?`,
        `Describe a situation where you had to work with a difficult team member. How did you handle it?`,
        `Give me an example of a project you're particularly proud of. What was your role?`
      ],
      mid: [
        `Tell me about a time you had to influence a team decision without formal authority.`,
        `Describe a situation where you had to balance multiple competing priorities. How did you manage?`,
        `Give me an example of how you've mentored or helped a junior colleague grow.`
      ],
      senior: [
        `Tell me about a time you had to make a difficult decision with incomplete information.`,
        `Describe a situation where you had to drive organizational change. What was your approach?`,
        `Give me an example of how you've built or transformed a team culture.`
      ]
    },
    technical: {
      entry: [
        `Explain the difference between let, const, and var in JavaScript. When would you use each?`,
        `What is REST API? Can you explain the basic principles?`,
        `How do you handle errors in your code? Give me an example.`
      ],
      mid: [
        `How would you design a caching strategy for a high-traffic web application?`,
        `Explain the concept of database indexing. When should you create an index?`,
        `What's your approach to writing maintainable and testable code?`
      ],
      senior: [
        `How would you architect a microservices system for an e-commerce platform?`,
        `Explain your approach to technical debt. How do you balance new features vs. refactoring?`,
        `How would you design a system that needs to handle 10x traffic spikes?`
      ]
    },
    system: {
      entry: [
        `How would you design a simple URL shortener service?`,
        `Design a basic chat application. What components would you need?`,
        `How would you structure a simple e-commerce product catalog?`
      ],
      mid: [
        `Design a real-time notification system for a social media platform.`,
        `How would you design a rate limiter for a public API?`,
        `Design a content delivery system for a media streaming service.`
      ],
      senior: [
        `Design a distributed job scheduling system that can handle millions of jobs.`,
        `How would you architect a multi-region database system with low latency requirements?`,
        `Design a system that can process and analyze real-time streaming data at scale.`
      ]
    }
  };

  const categoryQuestions = questions[category] || questions.behavioral;
  const difficultyQuestions = categoryQuestions[difficulty] || categoryQuestions.mid;
  const randomIndex = Math.floor(Math.random() * difficultyQuestions.length);
  
  return difficultyQuestions[randomIndex];
}
