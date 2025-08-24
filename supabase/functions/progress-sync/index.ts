import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth
    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const { action, data: requestData } = await req.json();

    console.log(`[PROGRESS-SYNC] Processing action: ${action} for user: ${user.id}`);

    switch (action) {
      case 'update_skill_progress': {
        const { skill, new_level, evidence } = requestData;
        
        // Get current progress
        const { data: currentProgress, error: fetchError } = await supabase
          .from('progress_tracking')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
          throw fetchError;
        }

        // Calculate new skill levels
        const updates = calculateSkillUpdates(currentProgress, skill, new_level, evidence);
        
        // Update progress tracking
        const { error: updateError } = await supabase
          .from('progress_tracking')
          .upsert({
            user_id: user.id,
            ...updates,
            updated_at: new Date().toISOString()
          });

        if (updateError) throw updateError;

        // Check for milestone achievements
        const milestones = checkMilestoneAchievements(updates);
        
        // Update learning analytics
        await updateLearningAnalytics(supabase, user.id, {
          skill_improvement: skill,
          new_level: new_level,
          evidence: evidence
        });

        return new Response(JSON.stringify({ 
          success: true, 
          updates,
          milestones_achieved: milestones
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'sync_lesson_completion': {
        const { lesson_id, competency, score, mistakes, time_spent } = requestData;
        
        // Record lesson progress
        const { error: lessonError } = await supabase
          .from('lesson_progress')
          .insert({
            user_id: user.id,
            lesson_id: lesson_id,
            competency: competency,
            score: score,
            mistakes_json: mistakes,
            completion_time_seconds: time_spent,
            completed_at: new Date().toISOString(),
            status: 'completed'
          });

        if (lessonError) throw lessonError;

        // Update overall progress based on lesson
        const progressUpdates = calculateLessonProgressImpact(competency, score, mistakes);
        
        await updateProgressFromLesson(supabase, user.id, progressUpdates);

        // Update daily analytics
        await updateDailyAnalytics(supabase, user.id, {
          lessons_completed: 1,
          study_time: Math.round(time_spent / 60),
          competency_practiced: competency
        });

        return new Response(JSON.stringify({ 
          success: true,
          progress_impact: progressUpdates
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'track_conversation_progress': {
        const { conversation_id, performance_metrics, errors, cultural_adaptation } = requestData;
        
        // Analyze conversation for progress insights
        const conversationAnalysis = analyzeConversationProgress(performance_metrics, errors, cultural_adaptation);
        
        // Update speaking and cultural competency
        const { data: currentProgress } = await supabase
          .from('progress_tracking')
          .select('*')
          .eq('user_id', user.id)
          .single();

        const speakingUpdate = calculateSpeakingProgressUpdate(currentProgress, conversationAnalysis);
        
        // Update progress tracking
        const { error: updateError } = await supabase
          .from('progress_tracking')
          .upsert({
            user_id: user.id,
            speaking_level: speakingUpdate.speaking_level,
            cultural_competency: speakingUpdate.cultural_competency,
            overall_proficiency: speakingUpdate.overall_proficiency,
            updated_at: new Date().toISOString()
          });

        if (updateError) throw updateError;

        // Update conversation-specific analytics
        await updateConversationAnalytics(supabase, user.id, conversationAnalysis);

        return new Response(JSON.stringify({ 
          success: true,
          conversation_analysis: conversationAnalysis,
          progress_update: speakingUpdate
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'assess_competency_mastery': {
        const { competency, assessment_data } = requestData;
        
        // Determine mastery level
        const masteryAssessment = assessCompetencyMastery(competency, assessment_data);
        
        // Update competency tracking
        const { data: currentProgress } = await supabase
          .from('progress_tracking')
          .select('mastered_competencies, in_progress_competencies, weak_areas')
          .eq('user_id', user.id)
          .single();

        const updatedCompetencies = updateCompetencyStatus(
          currentProgress,
          competency,
          masteryAssessment
        );

        const { error: updateError } = await supabase
          .from('progress_tracking')
          .update(updatedCompetencies)
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        // Check for level progression
        const levelProgression = checkLevelProgression(updatedCompetencies.mastered_competencies);

        return new Response(JSON.stringify({ 
          success: true,
          mastery_assessment: masteryAssessment,
          competency_updates: updatedCompetencies,
          level_progression: levelProgression
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'update_goal_progress': {
        const { goal_type, progress_data } = requestData;
        
        // Get current goals
        const { data: currentProgress } = await supabase
          .from('progress_tracking')
          .select('short_term_goals, long_term_goals, goal_completion_rate')
          .eq('user_id', user.id)
          .single();

        const goalUpdates = updateGoalProgress(currentProgress, goal_type, progress_data);
        
        const { error: updateError } = await supabase
          .from('progress_tracking')
          .update(goalUpdates)
          .eq('user_id', user.id);

        if (updateError) throw updateError;

        return new Response(JSON.stringify({ 
          success: true,
          goal_updates: goalUpdates
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      case 'sync_assessment_results': {
        const { assessment_type, results, recommendations } = requestData;
        
        // Update progress based on assessment
        const assessmentImpact = processAssessmentResults(assessment_type, results);
        
        // Update progress tracking
        const { error: updateError } = await supabase
          .from('progress_tracking')
          .upsert({
            user_id: user.id,
            last_assessment_date: new Date().toISOString().split('T')[0],
            next_assessment_due: calculateNextAssessmentDate(assessment_type),
            ...assessmentImpact,
            updated_at: new Date().toISOString()
          });

        if (updateError) throw updateError;

        // Store recommendations
        if (recommendations?.length) {
          const { error: recError } = await supabase
            .from('content_recommendations')
            .insert(recommendations.map((rec: any) => ({
              user_id: user.id,
              ...rec,
              created_at: new Date().toISOString()
            })));

          if (recError) console.error('Recommendation storage error:', recError);
        }

        return new Response(JSON.stringify({ 
          success: true,
          assessment_impact: assessmentImpact
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      default:
        throw new Error(`Unknown action: ${action}`);
    }

  } catch (error) {
    console.error('[PROGRESS-SYNC] Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Progress calculation functions
function calculateSkillUpdates(currentProgress: any, skill: string, newLevel: number, evidence: any) {
  const updates = { ...currentProgress };
  
  // Update specific skill level
  updates[`${skill}_level`] = Math.max(updates[`${skill}_level`] || 0, newLevel);
  
  // Recalculate overall proficiency
  const skillLevels = [
    updates.speaking_level || 0,
    updates.listening_level || 0,
    updates.reading_level || 0,
    updates.writing_level || 0,
    updates.grammar_level || 0,
    updates.vocabulary_level || 0,
    updates.pronunciation_level || 0
  ];
  
  updates.overall_proficiency = skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length;
  
  // Update learning velocity
  const previousLevel = currentProgress?.[`${skill}_level`] || 0;
  const improvement = newLevel - previousLevel;
  updates.learning_velocity = (updates.learning_velocity || 0) + improvement;
  
  // Update strength/weakness areas
  if (newLevel > 0.7) {
    const strengths = new Set(updates.strength_areas || []);
    strengths.add(skill);
    updates.strength_areas = Array.from(strengths);
    
    // Remove from weak areas if present
    updates.weak_areas = (updates.weak_areas || []).filter((w: string) => w !== skill);
  } else if (newLevel < 0.4) {
    const weaknesses = new Set(updates.weak_areas || []);
    weaknesses.add(skill);
    updates.weak_areas = Array.from(weaknesses);
    
    // Remove from strengths if present
    updates.strength_areas = (updates.strength_areas || []).filter((s: string) => s !== skill);
  }
  
  return updates;
}

function checkMilestoneAchievements(progressData: any) {
  const milestones = [];
  
  // Overall proficiency milestones
  if (progressData.overall_proficiency >= 0.5 && progressData.overall_proficiency < 0.6) {
    milestones.push({ type: 'proficiency', level: 'intermediate', message: 'Reached intermediate level!' });
  } else if (progressData.overall_proficiency >= 0.7) {
    milestones.push({ type: 'proficiency', level: 'advanced', message: 'Reached advanced level!' });
  }
  
  // Skill-specific milestones
  const skills = ['speaking', 'listening', 'reading', 'writing', 'grammar', 'vocabulary'];
  skills.forEach(skill => {
    const level = progressData[`${skill}_level`];
    if (level >= 0.8) {
      milestones.push({ 
        type: 'skill_mastery', 
        skill: skill, 
        message: `Mastered ${skill} skills!` 
      });
    }
  });
  
  // Cultural competency milestone
  if (progressData.cultural_competency >= 0.7) {
    milestones.push({ 
      type: 'cultural', 
      message: 'Achieved strong cultural competency!' 
    });
  }
  
  return milestones;
}

function calculateLessonProgressImpact(competency: string, score: number, mistakes: any[]) {
  const impact = {
    competency_improvement: 0,
    skill_areas_affected: [],
    learning_efficiency: score / 100 // Convert percentage to 0-1 scale
  };
  
  // Map competency to skill areas
  const competencySkillMap: { [key: string]: string[] } = {
    'grammar': ['grammar_level', 'writing_level'],
    'vocabulary': ['vocabulary_level', 'reading_level'],
    'pronunciation': ['pronunciation_level', 'speaking_level'],
    'listening': ['listening_level'],
    'speaking': ['speaking_level'],
    'cultural': ['cultural_competency']
  };
  
  const affectedSkills = competencySkillMap[competency] || [competency];
  impact.skill_areas_affected = affectedSkills;
  
  // Calculate improvement based on score and mistakes
  const mistakeImpact = mistakes.length / 10; // Reduce impact based on mistakes
  impact.competency_improvement = Math.max(0, (score / 100) - mistakeImpact) * 0.1; // Small incremental improvement
  
  return impact;
}

async function updateProgressFromLesson(supabase: any, userId: string, progressImpact: any) {
  const { data: currentProgress } = await supabase
    .from('progress_tracking')
    .select('*')
    .eq('user_id', userId)
    .single();

  const updates: any = {};
  
  // Update affected skill areas
  progressImpact.skill_areas_affected.forEach((skill: string) => {
    const currentLevel = currentProgress?.[skill] || 0;
    updates[skill] = Math.min(1.0, currentLevel + progressImpact.competency_improvement);
  });
  
  // Update overall proficiency
  if (Object.keys(updates).length > 0) {
    const allSkills = [
      updates.speaking_level || currentProgress?.speaking_level || 0,
      updates.listening_level || currentProgress?.listening_level || 0,
      updates.reading_level || currentProgress?.reading_level || 0,
      updates.writing_level || currentProgress?.writing_level || 0,
      updates.grammar_level || currentProgress?.grammar_level || 0,
      updates.vocabulary_level || currentProgress?.vocabulary_level || 0,
      updates.pronunciation_level || currentProgress?.pronunciation_level || 0
    ];
    
    updates.overall_proficiency = allSkills.reduce((a, b) => a + b, 0) / allSkills.length;
  }
  
  if (Object.keys(updates).length > 0) {
    await supabase
      .from('progress_tracking')
      .upsert({
        user_id: userId,
        ...updates,
        updated_at: new Date().toISOString()
      });
  }
}

async function updateLearningAnalytics(supabase: any, userId: string, data: any) {
  const today = new Date().toISOString().split('T')[0];
  
  await supabase
    .from('learning_analytics')
    .upsert({
      user_id: userId,
      date: today,
      lessons_completed: 1,
      updated_at: new Date().toISOString()
    });
}

async function updateDailyAnalytics(supabase: any, userId: string, data: any) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get existing analytics for today
  const { data: existing } = await supabase
    .from('learning_analytics')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  const updates = {
    user_id: userId,
    date: today,
    lessons_completed: (existing?.lessons_completed || 0) + (data.lessons_completed || 0),
    study_duration_minutes: (existing?.study_duration_minutes || 0) + (data.study_time || 0),
    session_count: (existing?.session_count || 0) + 1,
    updated_at: new Date().toISOString()
  };

  await supabase
    .from('learning_analytics')
    .upsert(updates);
}

function analyzeConversationProgress(performanceMetrics: any, errors: any[], culturalAdaptation: any) {
  return {
    fluency_score: performanceMetrics.fluency_score || 0.5,
    grammar_accuracy: 1 - (errors.filter((e: any) => e.type === 'grammar').length / Math.max(errors.length, 1)),
    vocabulary_usage: performanceMetrics.vocabulary_diversity || 0.5,
    pronunciation_clarity: performanceMetrics.pronunciation_score || 0.5,
    cultural_appropriateness: culturalAdaptation.appropriateness_score || 0.5,
    confidence_level: performanceMetrics.confidence_level || 0.5,
    engagement_level: performanceMetrics.engagement_level || 0.5
  };
}

function calculateSpeakingProgressUpdate(currentProgress: any, conversationAnalysis: any) {
  const currentSpeaking = currentProgress?.speaking_level || 0;
  const currentCultural = currentProgress?.cultural_competency || 0;
  
  // Weight the conversation analysis with current levels
  const speakingImprovement = (conversationAnalysis.fluency_score + 
                              conversationAnalysis.grammar_accuracy + 
                              conversationAnalysis.pronunciation_clarity) / 3;
  
  const newSpeakingLevel = (currentSpeaking * 0.9) + (speakingImprovement * 0.1);
  const newCulturalLevel = (currentCultural * 0.9) + (conversationAnalysis.cultural_appropriateness * 0.1);
  
  // Recalculate overall proficiency
  const skillLevels = [
    newSpeakingLevel,
    currentProgress?.listening_level || 0,
    currentProgress?.reading_level || 0,
    currentProgress?.writing_level || 0,
    currentProgress?.grammar_level || 0,
    currentProgress?.vocabulary_level || 0,
    currentProgress?.pronunciation_level || 0
  ];
  
  return {
    speaking_level: Math.min(1.0, newSpeakingLevel),
    cultural_competency: Math.min(1.0, newCulturalLevel),
    overall_proficiency: skillLevels.reduce((a, b) => a + b, 0) / skillLevels.length
  };
}

async function updateConversationAnalytics(supabase: any, userId: string, analysis: any) {
  const today = new Date().toISOString().split('T')[0];
  
  await supabase
    .from('learning_analytics')
    .upsert({
      user_id: userId,
      date: today,
      conversation_count: 1,
      engagement_score: analysis.engagement_level,
      cultural_confidence_level: analysis.cultural_appropriateness,
      updated_at: new Date().toISOString()
    });
}

function assessCompetencyMastery(competency: string, assessmentData: any) {
  const score = assessmentData.score || 0;
  const consistency = assessmentData.consistency || 0.5;
  const time_efficiency = assessmentData.time_efficiency || 0.5;
  
  const masteryScore = (score * 0.6) + (consistency * 0.25) + (time_efficiency * 0.15);
  
  let masteryLevel = 'beginner';
  if (masteryScore >= 0.8) masteryLevel = 'mastered';
  else if (masteryScore >= 0.6) masteryLevel = 'proficient';
  else if (masteryScore >= 0.4) masteryLevel = 'developing';
  
  return {
    competency,
    mastery_level: masteryLevel,
    mastery_score: masteryScore,
    assessment_date: new Date().toISOString(),
    next_review_needed: masteryLevel !== 'mastered'
  };
}

function updateCompetencyStatus(currentProgress: any, competency: string, masteryAssessment: any) {
  const mastered = new Set(currentProgress?.mastered_competencies || []);
  const inProgress = new Set(currentProgress?.in_progress_competencies || []);
  const weak = new Set(currentProgress?.weak_areas || []);
  
  // Remove from all sets first
  mastered.delete(competency);
  inProgress.delete(competency);
  weak.delete(competency);
  
  // Add to appropriate set based on mastery level
  switch (masteryAssessment.mastery_level) {
    case 'mastered':
      mastered.add(competency);
      break;
    case 'proficient':
    case 'developing':
      inProgress.add(competency);
      break;
    default:
      weak.add(competency);
  }
  
  return {
    mastered_competencies: Array.from(mastered),
    in_progress_competencies: Array.from(inProgress),
    weak_areas: Array.from(weak)
  };
}

function checkLevelProgression(masteredCompetencies: string[]) {
  // Define competency requirements for each level
  const levelRequirements = {
    'A2': ['basic_greetings', 'simple_present', 'basic_vocabulary'],
    'B1': ['past_tense', 'future_tense', 'conversation_basics', 'reading_comprehension'],
    'B2': ['complex_grammar', 'business_communication', 'cultural_awareness'],
    'C1': ['advanced_vocabulary', 'nuanced_expression', 'professional_writing'],
    'C2': ['native_like_fluency', 'cultural_mastery', 'advanced_discourse']
  };
  
  for (const [level, requirements] of Object.entries(levelRequirements)) {
    const hasAllRequirements = requirements.every(req => masteredCompetencies.includes(req));
    if (hasAllRequirements) {
      return {
        eligible_for_level: level,
        progress_percentage: 100,
        recommendation: 'Ready for level assessment'
      };
    }
    
    // Check partial progress
    const completedRequirements = requirements.filter(req => masteredCompetencies.includes(req));
    if (completedRequirements.length > 0) {
      return {
        current_level_progress: level,
        progress_percentage: (completedRequirements.length / requirements.length) * 100,
        missing_requirements: requirements.filter(req => !masteredCompetencies.includes(req))
      };
    }
  }
  
  return { message: 'Continue building foundational competencies' };
}

function updateGoalProgress(currentProgress: any, goalType: string, progressData: any) {
  const updates: any = {};
  
  if (goalType === 'short_term') {
    const goals = currentProgress?.short_term_goals || [];
    updates.short_term_goals = goals.map((goal: any) => 
      goal.id === progressData.goal_id 
        ? { ...goal, progress: progressData.progress, updated_at: new Date().toISOString() }
        : goal
    );
  } else if (goalType === 'long_term') {
    const goals = currentProgress?.long_term_goals || [];
    updates.long_term_goals = goals.map((goal: any) => 
      goal.id === progressData.goal_id 
        ? { ...goal, progress: progressData.progress, updated_at: new Date().toISOString() }
        : goal
    );
  }
  
  // Recalculate overall goal completion rate
  const allGoals = [...(updates.short_term_goals || currentProgress?.short_term_goals || []), 
                    ...(updates.long_term_goals || currentProgress?.long_term_goals || [])];
  
  if (allGoals.length > 0) {
    const totalProgress = allGoals.reduce((sum: number, goal: any) => sum + (goal.progress || 0), 0);
    updates.goal_completion_rate = totalProgress / allGoals.length;
  }
  
  return updates;
}

function processAssessmentResults(assessmentType: string, results: any) {
  const impact: any = {};
  
  // Update skill levels based on assessment results
  if (results.skill_scores) {
    Object.entries(results.skill_scores).forEach(([skill, score]: [string, any]) => {
      impact[`${skill}_level`] = Math.max(0, Math.min(1, score / 100));
    });
  }
  
  // Update overall proficiency
  if (results.overall_score) {
    impact.overall_proficiency = Math.max(0, Math.min(1, results.overall_score / 100));
  }
  
  // Update assessment-specific metrics
  if (assessmentType === 'speaking_assessment') {
    impact.speaking_level = results.speaking_score / 100;
    impact.pronunciation_level = results.pronunciation_score / 100;
  }
  
  return impact;
}

function calculateNextAssessmentDate(assessmentType: string) {
  const intervals: { [key: string]: number } = {
    'weekly_check': 7,
    'monthly_review': 30,
    'skill_assessment': 14,
    'level_test': 90
  };
  
  const interval = intervals[assessmentType] || 14;
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  
  return nextDate.toISOString().split('T')[0];
}