import { NextRequest, NextResponse } from 'next/server';
import {
  getQuestion,
  submitAnswer,
  getFollowUpQuestion,
  getInterviewSummary,
  Role,
  Category,
  Difficulty
} from '@/lib/interview';

interface InterviewRequest {
  mode: 'question' | 'feedback' | 'followup' | 'summary';
  question?: string;
  answer?: string;
  role?: string;
  difficulty?: string;
  category?: string;
  sessionId?: string;
}

// Map display roles to internal role keys
const roleMapping: Record<string, Role> = {
  'Software Developer': 'software-developer',
  'Frontend Developer': 'frontend-developer',
  'Backend Developer': 'backend-developer',
  'Full Stack Developer': 'fullstack-developer',
  'DevOps Engineer': 'devops-engineer',
  'Data Scientist': 'data-scientist',
  'Data Analyst': 'data-analyst',
  'Product Manager': 'product-manager',
  'Engineering Manager': 'engineering-manager',
  'Mobile Developer': 'mobile-developer',
  'QA Engineer': 'qa-engineer',
  'System Architect': 'system-architect',
  // Also support direct keys
  'software-developer': 'software-developer',
  'frontend-developer': 'frontend-developer',
  'backend-developer': 'backend-developer',
  'fullstack-developer': 'fullstack-developer',
  'devops-engineer': 'devops-engineer',
  'data-scientist': 'data-scientist',
  'data-analyst': 'data-analyst',
  'product-manager': 'product-manager',
  'engineering-manager': 'engineering-manager',
  'mobile-developer': 'mobile-developer',
  'qa-engineer': 'qa-engineer',
  'system-architect': 'system-architect'
};

export async function POST(request: NextRequest) {
  try {
    let body: InterviewRequest;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return NextResponse.json(
        { success: false, error: 'Invalid request format. Please refresh and try again.' },
        { status: 400 }
      );
    }
    
    const {
      mode = 'question',
      question,
      answer,
      role = 'Software Developer',
      difficulty = 'mid',
      category = 'behavioral',
      sessionId
    } = body;

    // Map the role to internal key
    const internalRole = roleMapping[role] || 'software-developer';
    const internalCategory = (category || 'behavioral') as Category;
    const internalDifficulty = (difficulty || 'mid') as Difficulty;

    switch (mode) {
      case 'question': {
        try {
          const result = getQuestion(
            internalRole,
            internalCategory,
            internalDifficulty,
            sessionId
          );

          return NextResponse.json({
            success: true,
            mode: 'question',
            content: result.question.question,
            questionData: result.question,
            session: result.session,
            hints: result.question.hints
          });
        } catch (qError: any) {
          console.error('Question generation error:', qError);
          return NextResponse.json(
            { success: false, error: 'Failed to generate question. Please try again.' },
            { status: 500 }
          );
        }
      }

      case 'feedback': {
        if (!question || !answer) {
          return NextResponse.json(
            { success: false, error: 'Question and answer are required for feedback mode' },
            { status: 400 }
          );
        }

        let result;
        try {
          result = submitAnswer(
            question,
            answer,
            internalRole,
            internalCategory,
            internalDifficulty,
            sessionId
          );
        } catch (evalError: any) {
          console.error('Interview evaluation error:', evalError);
          console.error('Stack:', evalError?.stack);
          return NextResponse.json(
            { success: false, error: 'Failed to evaluate answer. Please try again.' },
            { status: 500 }
          );
        }

        if (!result.success) {
          return NextResponse.json(
            { success: false, error: result.error || 'Failed to evaluate answer. Please try again.' },
            { status: 400 }
          );
        }

        return NextResponse.json({
          success: true,
          mode: 'feedback',
          score: Math.round(result.evaluation.overallScore),
          relevanceScore: result.evaluation.relevanceScore,
          qualityScore: result.evaluation.qualityScore,
          depthScore: result.evaluation.depthScore,
          isRelevant: result.evaluation.isRelevant,
          strengths: result.evaluation.strengths,
          improvements: result.evaluation.improvements,
          coveredConcepts: result.evaluation.coveredConcepts,
          missedConcepts: result.evaluation.missedConcepts,
          detailedFeedback: result.evaluation.feedback,
          sampleAnswer: result.evaluation.sampleAnswer,
          followUpSuggestion: result.evaluation.followUpSuggestion,
          session: result.session,
          suggestedDifficulty: result.suggestedDifficulty
        });
      }

      case 'followup': {
        if (!question || !answer) {
          return NextResponse.json(
            { success: false, error: 'Question and answer are required for followup mode' },
            { status: 400 }
          );
        }

        try {
          const result = getFollowUpQuestion(
            question,
            answer,
            internalRole,
            internalCategory,
            internalDifficulty,
            sessionId
          );

          return NextResponse.json({
            success: true,
            mode: 'followup',
            content: result.question.question,
            questionData: result.question,
            session: result.session
          });
        } catch (fuError: any) {
          console.error('Follow-up generation error:', fuError);
          return NextResponse.json(
            { success: false, error: 'Failed to generate follow-up. Please try again.' },
            { status: 500 }
          );
        }
      }

      case 'summary': {
        if (!sessionId) {
          return NextResponse.json(
            { success: false, error: 'Session ID is required for summary mode' },
            { status: 400 }
          );
        }

        try {
          const summary = getInterviewSummary(sessionId);

          if (!summary) {
            return NextResponse.json(
              { success: false, error: 'Session not found. Please start a new interview.' },
              { status: 404 }
            );
          }

          return NextResponse.json({
            success: true,
            mode: 'summary',
            summary
          });
        } catch (sError: any) {
          console.error('Summary generation error:', sError);
          return NextResponse.json(
            { success: false, error: 'Failed to generate summary. Please try again.' },
            { status: 500 }
          );
        }
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid mode. Use "question", "feedback", "followup", or "summary"' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Interview API unhandled error:', error);
    console.error('Stack:', error?.stack);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please refresh and try again.' },
      { status: 500 }
    );
  }
}
