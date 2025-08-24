// Advanced AI Personalization and Learning Analytics Types

export interface LearningPattern {
  userId: string;
  sessionDuration: number;
  optimalStudyTimes: TimeSlot[];
  preferredLessonTypes: LessonTypePreference[];
  mistakeFrequency: MistakePattern[];
  engagementLevels: EngagementMetric[];
  progressVelocity: ProgressMetric[];
  retentionPatterns: RetentionPattern[];
  cognitiveLoad: CognitiveLoadMetric[];
}

export interface TimeSlot {
  dayOfWeek: number; // 0-6
  startHour: number; // 0-23
  endHour: number;
  effectiveness: number; // 0-1
  consistency: number; // 0-1
}

export interface LessonTypePreference {
  type: 'conversation' | 'grammar' | 'vocabulary' | 'listening' | 'reading' | 'writing' | 'pronunciation';
  preference: number; // 0-1
  effectiveness: number; // 0-1
  engagement: number; // 0-1
  completion_rate: number; // 0-1
}

export interface MistakePattern {
  category: string;
  frequency: number;
  improvement_rate: number;
  persistence: number; // how long mistakes persist
  context: string[];
  difficulty_level: number;
}

export interface EngagementMetric {
  session_id: string;
  timestamp: number;
  duration: number;
  interaction_frequency: number;
  response_time: number;
  initiation_rate: number; // how often user starts interactions
  completion_rate: number;
  emotional_indicators: EmotionalState;
}

export interface ProgressMetric {
  skill: string;
  start_level: number;
  current_level: number;
  velocity: number; // improvement per unit time
  acceleration: number; // change in velocity
  plateau_indicators: PlateauIndicator[];
  breakthrough_moments: BreakthroughMoment[];
}

export interface RetentionPattern {
  content_type: string;
  initial_acquisition: number; // 0-1
  short_term_retention: number; // after 1 day
  medium_term_retention: number; // after 1 week
  long_term_retention: number; // after 1 month
  optimal_review_interval: number; // days
  forgetting_curve: ForgettingCurvePoint[];
}

export interface CognitiveLoadMetric {
  task_type: string;
  cognitive_load: number; // 0-1
  performance_under_load: number;
  optimal_complexity: number;
  fatigue_indicators: FatigueIndicator[];
}

export interface EmotionalState {
  frustration: number; // 0-1
  confidence: number; // 0-1
  engagement: number; // 0-1
  motivation: number; // 0-1
  anxiety: number; // 0-1
  satisfaction: number; // 0-1
  detected_from: ('text' | 'voice' | 'behavior')[];
}

export interface PlateauIndicator {
  skill: string;
  duration: number; // days in plateau
  severity: number; // 0-1
  potential_causes: string[];
  recommended_interventions: string[];
}

export interface BreakthroughMoment {
  timestamp: number;
  skill: string;
  previous_level: number;
  new_level: number;
  catalyst: string; // what caused the breakthrough
  confidence_boost: number;
}

export interface ForgettingCurvePoint {
  time_elapsed: number; // hours
  retention_rate: number; // 0-1
}

export interface FatigueIndicator {
  type: 'mental' | 'motivational' | 'physical';
  severity: number; // 0-1
  duration: number; // minutes
  recovery_time: number; // minutes
}

export interface AdaptiveLearningEngine {
  personalizationAlgorithm: PersonalizationAlgorithm;
  difficultyAdaptation: DifficultyAdaptation;
  learningPathOptimization: LearningPathOptimization;
}

export interface PersonalizationAlgorithm {
  userId: string;
  learningProfile: LearningProfile;
  curriculumRecommendations: CurriculumRecommendation[];
  adaptationRules: AdaptationRule[];
  updateFrequency: number; // minutes
}

export interface LearningProfile {
  cognitive_style: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  learning_pace: 'slow' | 'medium' | 'fast' | 'variable';
  attention_span: number; // minutes
  motivation_factors: MotivationFactor[];
  stress_indicators: StressIndicator[];
  optimal_challenge_level: number; // 0-1
  social_learning_preference: number; // 0-1
}

export interface CurriculumRecommendation {
  lesson_id: string;
  priority: number; // 0-1
  rationale: string;
  expected_difficulty: number; // 0-1
  estimated_duration: number; // minutes
  prerequisites_met: boolean;
  alignment_score: number; // 0-1 with user goals
}

export interface AdaptationRule {
  condition: string;
  action: string;
  confidence: number; // 0-1
  success_rate: number; // historical effectiveness
  context: string[];
}

export interface MotivationFactor {
  type: 'progress_tracking' | 'social_interaction' | 'gamification' | 'achievement' | 'cultural_connection';
  effectiveness: number; // 0-1
  frequency_preference: 'high' | 'medium' | 'low';
}

export interface StressIndicator {
  type: 'time_pressure' | 'complexity_overload' | 'performance_anxiety' | 'cultural_disconnect';
  sensitivity: number; // 0-1
  mitigation_strategies: string[];
}

export interface DifficultyAdaptation {
  realTimeModification: RealTimeModification;
  vocabularyComplexity: VocabularyComplexity;
  conversationSpeed: ConversationSpeed;
  grammarComplexity: GrammarComplexity;
  culturalContextDepth: CulturalContextDepth;
}

export interface RealTimeModification {
  currentDifficulty: number; // 0-1
  targetDifficulty: number; // 0-1
  adaptationSpeed: number; // how quickly to adapt
  performanceThresholds: PerformanceThreshold[];
  modifications: DifficultyModification[];
}

export interface PerformanceThreshold {
  metric: string;
  lower_bound: number;
  upper_bound: number;
  action: 'increase_difficulty' | 'decrease_difficulty' | 'maintain' | 'review';
}

export interface DifficultyModification {
  component: string;
  original_value: number;
  modified_value: number;
  rationale: string;
  success_prediction: number; // 0-1
}

export interface VocabularyComplexity {
  currentLevel: number; // 0-1
  frequencyBand: 'top_1000' | 'top_3000' | 'top_5000' | 'academic' | 'specialized';
  contextualComplexity: number; // how complex the usage context is
  cognateAdvantage: number; // 0-1, benefit from Arabic cognates
}

export interface ConversationSpeed {
  wordsPerMinute: number;
  pauseFrequency: number;
  complexityAdjustment: number;
  culturalPaceAdaptation: number;
}

export interface GrammarComplexity {
  structureLevel: number; // 1-10
  tenseComplexity: number; // 1-10
  clauseComplexity: number; // 1-10
  idiomatic_usage: number; // 0-1
}

export interface CulturalContextDepth {
  explicitness: number; // 0-1, how explicit cultural explanations are
  comparison_frequency: number; // how often to compare with Arabic culture
  context_richness: number; // amount of cultural context provided
  sensitivity_level: number; // cultural sensitivity awareness
}

export interface LearningPathOptimization {
  studySchedule: StudySchedule;
  lessonSequencing: LessonSequencing;
  spacedRepetition: SpacedRepetition;
  weaknessFocused: WeaknessFocusedLearning;
  strengthBased: StrengthBasedLearning;
}

export interface StudySchedule {
  userId: string;
  availableTimeSlots: TimeSlot[];
  goalDeadlines: GoalDeadline[];
  optimal_sessions: OptimalSession[];
  adaptive_scheduling: boolean;
  buffer_time: number; // minutes
}

export interface GoalDeadline {
  goal: string;
  deadline: Date;
  priority: number; // 0-1
  current_progress: number; // 0-1
  required_velocity: number; // to meet deadline
}

export interface OptimalSession {
  start_time: Date;
  duration: number; // minutes
  content_focus: string[];
  difficulty_level: number; // 0-1
  energy_requirement: number; // 0-1
}

export interface LessonSequencing {
  prerequisites: PrerequisiteMap;
  dependency_graph: DependencyNode[];
  optimal_order: string[];
  alternative_paths: AlternativePath[];
}

export interface PrerequisiteMap {
  [lessonId: string]: string[];
}

export interface DependencyNode {
  lesson_id: string;
  dependencies: string[];
  unlocks: string[];
  importance: number; // 0-1
}

export interface AlternativePath {
  goal: string;
  paths: LearningPath[];
  recommendation: string; // which path to recommend
}

export interface LearningPath {
  lessons: string[];
  estimated_duration: number; // hours
  difficulty_progression: number[];
  success_probability: number; // 0-1
}

export interface SpacedRepetition {
  algorithm: 'SM2' | 'FSRS' | 'custom';
  intervals: ReviewInterval[];
  ease_factors: EaseFactor[];
  success_rates: SuccessRate[];
}

export interface ReviewInterval {
  content_id: string;
  current_interval: number; // days
  next_review: Date;
  ease_factor: number;
  consecutive_successes: number;
}

export interface EaseFactor {
  content_id: string;
  factor: number;
  adjustments: EaseAdjustment[];
}

export interface EaseAdjustment {
  timestamp: Date;
  old_factor: number;
  new_factor: number;
  performance_quality: number; // 0-5
}

export interface SuccessRate {
  interval_days: number;
  success_rate: number; // 0-1
  confidence_interval: [number, number];
}

export interface WeaknessFocusedLearning {
  identifiedWeaknesses: IdentifiedWeakness[];
  targetedExercises: TargetedExercise[];
  progressTracking: WeaknessProgressTracking;
}

export interface IdentifiedWeakness {
  skill: string;
  sub_skill: string;
  severity: number; // 0-1
  frequency: number; // how often it appears
  impact: number; // impact on overall fluency
  addressability: number; // how easily it can be fixed
}

export interface TargetedExercise {
  weakness_id: string;
  exercise_type: string;
  difficulty: number; // 0-1
  expected_improvement: number; // 0-1
  estimated_sessions: number;
}

export interface WeaknessProgressTracking {
  weakness_id: string;
  initial_severity: number;
  current_severity: number;
  improvement_rate: number;
  sessions_completed: number;
  mastery_prediction: Date;
}

export interface StrengthBasedLearning {
  identifiedStrengths: IdentifiedStrength[];
  leveragingStrategies: LeveragingStrategy[];
  confidenceBuilding: ConfidenceBuildingActivity[];
}

export interface IdentifiedStrength {
  skill: string;
  sub_skill: string;
  proficiency: number; // 0-1
  consistency: number; // 0-1
  transferability: number; // how well it transfers to other skills
  motivational_value: number; // confidence boost potential
}

export interface LeveragingStrategy {
  strength_id: string;
  target_weakness: string;
  strategy: string;
  effectiveness: number; // 0-1
  implementation_steps: string[];
}

export interface ConfidenceBuildingActivity {
  strength_id: string;
  activity_type: string;
  complexity_level: number; // 0-1
  confidence_boost: number; // expected 0-1
  duration: number; // minutes
}

export interface ConversationIntelligence {
  gapAnalysis: LearningGapAnalysis;
  topicAdaptation: TopicAdaptation;
  memoryManagement: ConversationMemoryManagement;
  challengeProgression: ChallengeProgression;
}

export interface LearningGapAnalysis {
  identifiedGaps: LearningGap[];
  analysisMethod: 'conversation_mining' | 'error_analysis' | 'performance_tracking';
  confidence: number; // 0-1
  updateFrequency: number; // hours
}

export interface LearningGap {
  skill: string;
  gap_type: 'knowledge' | 'application' | 'fluency' | 'confidence';
  severity: number; // 0-1
  evidence: Evidence[];
  recommended_practice: PracticeRecommendation[];
}

export interface Evidence {
  type: 'conversation_pattern' | 'error_frequency' | 'avoidance_behavior' | 'hesitation_pattern';
  description: string;
  confidence: number; // 0-1
  frequency: number;
}

export interface PracticeRecommendation {
  activity_type: string;
  focus_area: string;
  duration: number; // minutes
  frequency: string; // e.g., "daily", "3x per week"
  expected_improvement: number; // 0-1
}

export interface TopicAdaptation {
  userInterests: UserInterest[];
  conversationHistory: ConversationTopicHistory[];
  adaptationRules: TopicAdaptationRule[];
  culturalRelevance: CulturalRelevanceScore[];
}

export interface ConversationTopicHistory {
  session_id: string;
  topics_discussed: string[];
  engagement_scores: number[];
  duration_per_topic: number[];
  user_initiated_topics: string[];
  conversation_flow: ConversationFlowEvent[];
}

export interface ConversationFlowEvent {
  timestamp: number;
  event_type: 'topic_introduction' | 'topic_change' | 'deep_dive' | 'topic_conclusion';
  topic: string;
  engagement_level: number; // 0-1
}

export interface UserInterest {
  topic: string;
  interest_level: number; // 0-1
  engagement_history: EngagementHistory[];
  language_level: number; // vocabulary level for this topic
  cultural_familiarity: number; // 0-1
}

export interface EngagementHistory {
  session_id: string;
  topic: string;
  engagement_score: number; // 0-1
  duration: number; // minutes
  questions_asked: number;
  initiative_taken: number; // 0-1
}

export interface TopicAdaptationRule {
  condition: string;
  topic_suggestions: string[];
  adaptation_strategy: string;
  success_rate: number; // 0-1
}

export interface CulturalRelevanceScore {
  topic: string;
  cultural_relevance: number; // 0-1
  cross_cultural_learning: number; // educational value
  sensitivity_level: number; // cultural sensitivity required
}

export interface ConversationMemoryManagement {
  shortTermMemory: ConversationMemory;
  longTermMemory: ConversationMemory;
  contextualMemory: ContextualMemory;
  personalizedRecall: PersonalizedRecall;
}

export interface ConversationMemory {
  capacity: number; // number of interactions
  retention_policy: 'FIFO' | 'importance_based' | 'relevance_based';
  compression_strategy: string;
  retrieval_triggers: string[];
}

export interface ContextualMemory {
  context_type: string;
  memory_items: MemoryItem[];
  relevance_scoring: RelevanceScoring;
  decay_function: DecayFunction;
}

export interface MemoryItem {
  id: string;
  content: string;
  importance: number; // 0-1
  relevance: number; // 0-1
  timestamp: Date;
  access_count: number;
  last_accessed: Date;
}

export interface RelevanceScoring {
  algorithm: string;
  factors: RelevanceFactor[];
  weights: number[];
}

export interface RelevanceFactor {
  factor: string;
  weight: number; // 0-1
  calculation_method: string;
}

export interface DecayFunction {
  type: 'exponential' | 'linear' | 'logarithmic';
  parameters: number[];
  half_life: number; // days
}

export interface PersonalizedRecall {
  user_specific_triggers: string[];
  recall_preferences: RecallPreference[];
  memory_associations: MemoryAssociation[];
}

export interface RecallPreference {
  trigger_type: string;
  preference_strength: number; // 0-1
  context_specificity: number; // 0-1
}

export interface MemoryAssociation {
  primary_concept: string;
  associated_concepts: string[];
  association_strength: number; // 0-1
  cultural_context: string;
}

export interface ChallengeProgression {
  currentChallengeLevel: number; // 0-1
  progressionRate: number;
  adaptationTriggers: ChallengeAdaptationTrigger[];
  sophisticationMetrics: SophisticationMetric[];
}

export interface ChallengeAdaptationTrigger {
  metric: string;
  threshold: number;
  action: 'increase' | 'decrease' | 'maintain' | 'plateau_break';
  confidence: number; // 0-1
}

export interface SophisticationMetric {
  dimension: string;
  current_level: number; // 0-1
  target_level: number; // 0-1
  progression_strategy: string;
  milestones: Milestone[];
}

export interface Milestone {
  level: number; // 0-1
  description: string;
  achievement_criteria: string[];
  reward_type: string;
}

export interface EmotionalIntelligence {
  frustrationDetection: FrustrationDetection;
  confidenceAssessment: ConfidenceAssessment;
  optimalLearningMoments: OptimalLearningMoments;
  progressCelebration: ProgressCelebration;
}

export interface FrustrationDetection {
  detectionMethods: FrustrationDetectionMethod[];
  mitigationStrategies: FrustrationMitigationStrategy[];
  preventionTactics: FrustrationPreventionTactic[];
}

export interface FrustrationDetectionMethod {
  method: 'text_analysis' | 'voice_analysis' | 'behavioral_patterns' | 'performance_decline';
  indicators: FrustrationIndicator[];
  accuracy: number; // 0-1
  response_time: number; // milliseconds
}

export interface FrustrationIndicator {
  type: string;
  severity_threshold: number;
  confidence_threshold: number;
  false_positive_rate: number;
}

export interface FrustrationMitigationStrategy {
  trigger_level: number; // 0-1
  strategy: string;
  effectiveness: number; // 0-1
  implementation_steps: string[];
  recovery_time: number; // minutes
}

export interface FrustrationPreventionTactic {
  prevention_type: string;
  timing: 'proactive' | 'early_warning' | 'threshold_based';
  effectiveness: number; // 0-1
  resource_cost: number; // computational/time cost
}

export interface ConfidenceAssessment {
  confidenceMetrics: ConfidenceMetric[];
  assessmentFrequency: number; // per session
  boostingStrategies: ConfidenceBoostingStrategy[];
  trackingHistory: ConfidenceTrackingHistory[];
}

export interface ConfidenceMetric {
  metric: 'response_time' | 'hesitation_frequency' | 'self_correction' | 'initiative_taking';
  weight: number; // 0-1
  calculation_method: string;
  accuracy: number; // 0-1
}

export interface ConfidenceBoostingStrategy {
  confidence_level_range: [number, number];
  strategy: string;
  expected_boost: number; // 0-1
  duration: number; // minutes
  sustainability: number; // how long the boost lasts
}

export interface ConfidenceTrackingHistory {
  timestamp: Date;
  confidence_level: number; // 0-1
  contributing_factors: string[];
  session_context: string;
}

export interface OptimalLearningMoments {
  detectionCriteria: LearningMomentCriteria;
  conceptIntroduction: ConceptIntroductionStrategy;
  timingOptimization: TimingOptimization;
}

export interface LearningMomentCriteria {
  cognitive_readiness: number; // 0-1
  emotional_state: string;
  attention_level: number; // 0-1
  success_streak: number;
  fatigue_level: number; // 0-1
}

export interface ConceptIntroductionStrategy {
  prerequisite_mastery: number; // 0-1 required
  cognitive_load_limit: number; // 0-1
  connection_strategy: string;
  scaffolding_level: number; // 0-1
}

export interface TimingOptimization {
  optimal_session_time: TimeRange;
  concept_spacing: number; // minutes between new concepts
  reinforcement_timing: number[]; // minutes after introduction
  review_schedule: ReviewSchedule;
}

export interface TimeRange {
  start: number; // minutes into session
  end: number; // minutes into session
  confidence: number; // 0-1
}

export interface ReviewSchedule {
  immediate: number; // minutes
  short_term: number; // hours
  medium_term: number; // days
  long_term: number; // weeks
}

export interface ProgressCelebration {
  celebrationTriggers: CelebrationTrigger[];
  personalizationFactors: CelebrationPersonalizationFactor[];
  culturalAdaptation: CelebrationCulturalAdaptation;
}

export interface CelebrationTrigger {
  achievement_type: string;
  threshold: number;
  celebration_level: 'small' | 'medium' | 'large' | 'milestone';
  frequency_limit: number; // max per session
}

export interface CelebrationPersonalizationFactor {
  factor: 'cultural_background' | 'personality_type' | 'achievement_history' | 'confidence_level';
  weight: number; // 0-1
  adaptation_rules: string[];
}

export interface CelebrationCulturalAdaptation {
  arabic_cultural_elements: string[];
  celebration_style: 'enthusiastic' | 'measured' | 'respectful' | 'family_oriented';
  language_mixing: boolean; // Arabic phrases in celebration
  religious_sensitivity: boolean;
}

export interface SmartContentRecommendations {
  lessonSuggestions: LessonSuggestionEngine;
  vocabularyPrioritization: VocabularyPrioritizationEngine;
  practiceRecommendations: PracticeRecommendationEngine;
}

export interface LessonSuggestionEngine {
  recommendationAlgorithm: RecommendationAlgorithm;
  learningSequence: LearningSequenceOptimizer;
  adaptiveFiltering: AdaptiveFiltering;
}

export interface RecommendationAlgorithm {
  algorithm_type: 'collaborative_filtering' | 'content_based' | 'hybrid' | 'deep_learning';
  confidence_threshold: number; // 0-1
  diversification_factor: number; // 0-1
  novelty_bias: number; // 0-1
}

export interface LearningSequenceOptimizer {
  prerequisite_enforcement: boolean;
  difficulty_progression: ProgressionStrategy;
  interest_integration: number; // 0-1
  goal_alignment: number; // 0-1
}

export interface ProgressionStrategy {
  type: 'linear' | 'spiral' | 'adaptive' | 'mastery_based';
  progression_rate: number; // 0-1
  review_frequency: number; // 0-1
  challenge_injection: number; // 0-1
}

export interface AdaptiveFiltering {
  performance_based: boolean;
  time_constraint_aware: boolean;
  interest_weighted: boolean;
  cultural_relevance_filtered: boolean;
}

export interface VocabularyPrioritizationEngine {
  impactScoring: VocabularyImpactScoring;
  contextualRelevance: ContextualRelevance;
  unlockingPotential: UnlockingPotential;
  goalAlignment: VocabularyGoalAlignment;
}

export interface VocabularyImpactScoring {
  frequency_weight: number; // 0-1
  utility_weight: number; // 0-1
  difficulty_penalty: number; // 0-1
  cultural_bonus: number; // 0-1
}

export interface ContextualRelevance {
  conversation_context: string[];
  topic_relevance: number; // 0-1
  immediate_utility: number; // 0-1
  transferability: number; // 0-1
}

export interface UnlockingPotential {
  prerequisite_for: string[];
  enabling_score: number; // 0-1
  cascade_effect: number; // 0-1
  network_centrality: number; // 0-1
}

export interface VocabularyGoalAlignment {
  professional_relevance: number; // 0-1
  academic_relevance: number; // 0-1
  social_relevance: number; // 0-1
  cultural_relevance: number; // 0-1
}

export interface PracticeRecommendationEngine {
  performanceAnalysis: PerformanceAnalysis;
  interestAlignment: InterestAlignment;
  retentionOptimization: RetentionOptimization;
  challengeCalibration: ChallengeCalibration;
}

export interface PerformanceAnalysis {
  recent_performance: PersonalizationPerformanceMetric[];
  trend_analysis: TrendAnalysis;
  weakness_identification: WeaknessIdentification;
  strength_leveraging: StrengthLeveraging;
}

export interface PersonalizationPerformanceMetric {
  skill: string;
  score: number; // 0-1
  timestamp: Date;
  session_context: string;
  improvement_rate: number;
}

export interface TrendAnalysis {
  direction: 'improving' | 'declining' | 'stable' | 'volatile';
  velocity: number;
  acceleration: number;
  prediction_confidence: number; // 0-1
}

export interface WeaknessIdentification {
  skill: string;
  severity: number; // 0-1
  urgency: number; // 0-1
  addressability: number; // 0-1
}

export interface StrengthLeveraging {
  skill: string;
  proficiency: number; // 0-1
  transferability: number; // 0-1
  motivation_potential: number; // 0-1
}

export interface InterestAlignment {
  topic_preferences: TopicPreference[];
  activity_preferences: ActivityPreference[];
  learning_style_preferences: LearningStylePreference[];
}

export interface TopicPreference {
  topic: string;
  interest_level: number; // 0-1
  engagement_history: number; // 0-1
  learning_effectiveness: number; // 0-1
}

export interface ActivityPreference {
  activity_type: string;
  preference_score: number; // 0-1
  completion_rate: number; // 0-1
  satisfaction_score: number; // 0-1
}

export interface LearningStylePreference {
  style: string;
  effectiveness: number; // 0-1
  preference: number; // 0-1
  context_dependency: number; // 0-1
}

export interface RetentionOptimization {
  forgetting_curve_analysis: ForgettingCurveAnalysis;
  review_timing: ReviewTimingOptimization;
  reinforcement_strategies: ReinforcementStrategy[];
}

export interface ForgettingCurveAnalysis {
  content_type: string;
  decay_rate: number;
  retention_half_life: number; // days
  individual_variation: number; // 0-1
}

export interface ReviewTimingOptimization {
  optimal_intervals: number[]; // days
  success_probability: number[]; // 0-1 for each interval
  efficiency_score: number; // 0-1
}

export interface ReinforcementStrategy {
  strategy: string;
  effectiveness: number; // 0-1
  resource_cost: number; // 0-1
  applicability: string[];
}

export interface ChallengeCalibration {
  current_ability: number; // 0-1
  optimal_challenge: number; // 0-1
  flow_state_indicators: FlowStateIndicator[];
  adaptation_sensitivity: number; // 0-1
}

export interface FlowStateIndicator {
  indicator: string;
  threshold: number;
  weight: number; // 0-1
  measurement_method: string;
}