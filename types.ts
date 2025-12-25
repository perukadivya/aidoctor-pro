// ==========================================
// AIDoctor Pro - Type Definitions
// ==========================================

// Medical Conditions
export type MedicalCondition =
    | 'Diabetes'
    | 'Hypertension'
    | 'Heart Disease'
    | 'Asthma'
    | 'COPD'
    | 'Kidney Disease'
    | 'Liver Disease'
    | 'Thyroid Disorder'
    | 'Arthritis'
    | 'Depression'
    | 'Anxiety'
    | 'Migraine'
    | 'Epilepsy'
    | 'Cancer'
    | 'None';

// Severity Levels
export type Severity = 'Mild' | 'Moderate' | 'Severe' | 'Critical';

// Urgency Levels
export type Urgency = 'Low' | 'Medium' | 'High' | 'Emergency';

// Gender
export type Gender = 'Male' | 'Female' | 'Other' | 'Prefer not to say';

// Patient Profile
export interface PatientProfile {
    id: string;
    age: number;
    gender: Gender;
    weight: number; // in kg
    height: number; // in cm
    conditions: MedicalCondition[];
    medications: string[];
    allergies: string[];
    familyHistory: string[];
    lifestyle: {
        smoking: boolean;
        alcohol: boolean;
        exercise: 'Sedentary' | 'Light' | 'Moderate' | 'Active';
    };
    lastUpdated: string;
}

// Symptom Entry
export interface Symptom {
    id: string;
    name: string;
    duration: string;
    severity: Severity;
    location?: string;
    description?: string;
    triggers?: string[];
    relievedBy?: string[];
}

// AI Analysis Result
export interface DiagnosisResult {
    possibleConditions: PossibleCondition[];
    urgencyLevel: Urgency;
    recommendedActions: string[];
    warningSignsToWatch: string[];
    questionsForDoctor: string[];
    disclaimer: string;
}

// Possible Condition
export interface PossibleCondition {
    name: string;
    likelihood: 'Low' | 'Moderate' | 'High';
    confidenceScore: number; // 0-100
    description: string;
    commonSymptoms: string[];
    riskFactors: string[];
    typicalTreatments: string[];
    whenToSeek: string;
}

// Second Opinion Request
export interface SecondOpinionRequest {
    existingDiagnosis: string;
    diagnosedBy: string;
    diagnosisDate?: string;
    currentSymptoms: Symptom[];
    treatmentPrescribed?: string;
    patientConcerns?: string;
}

// Second Opinion Result
export interface SecondOpinionResult {
    originalDiagnosis: string;
    analysisConfidence: number; // 0-100
    agreement: 'Fully Agrees' | 'Partially Agrees' | 'Suggests Review';
    analysis: string;
    alternativeConsiderations: AlternativeCondition[];
    additionalTestsSuggested: string[];
    questionsToAsk: string[];
    secondOpinionSummary: string;
    disclaimer: string;
}

// Alternative Condition
export interface AlternativeCondition {
    name: string;
    reason: string;
    differentiatingFactors: string[];
}

// Chat Message
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: string;
}

// Consultation Session
export interface ConsultationSession {
    id: string;
    startTime: string;
    symptoms: Symptom[];
    messages: ChatMessage[];
    diagnosis?: DiagnosisResult;
    secondOpinion?: SecondOpinionResult;
    patientProfile?: PatientProfile;
}

// Health Recommendation
export interface HealthRecommendation {
    category: 'Lifestyle' | 'Diet' | 'Exercise' | 'Mental Health' | 'Preventive Care';
    title: string;
    description: string;
    priority: 'High' | 'Medium' | 'Low';
    actionItems: string[];
}

// App View State
export type ViewState = 'home' | 'drug-compare' | 'second-opinion' | 'profile' | 'history' | 'diet-plan';

// Loading State
export interface LoadingState {
    isLoading: boolean;
    message?: string;
}

// Error State
export interface AppError {
    code: string;
    message: string;
    details?: string;
}

// Diet Plan Types
export type WeightGoal = 'lose' | 'gain' | 'maintain';

export interface DietPlanRequest {
    goal: WeightGoal;
    targetWeight: number;
    timeframe: string;
    dietaryRestrictions: string[];
    foodPreferences: string[];
    mealsPerDay: number;
}

export interface Meal {
    name: string;
    time: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    ingredients: string[];
    instructions: string;
    alternatives?: string[];
}

export interface DailyMealPlan {
    day: string;
    totalCalories: number;
    meals: Meal[];
    snacks: string[];
    waterIntake: string;
}

export interface DietPlanResult {
    goal: WeightGoal;
    currentWeight: number;
    targetWeight: number;
    dailyCalorieTarget: number;
    macroBreakdown: {
        protein: number;
        carbs: number;
        fats: number;
    };
    weeklyPlan: DailyMealPlan[];
    groceryList: string[];
    tips: string[];
    warnings: string[];
    progressMilestones: { week: number; expectedWeight: number }[];
    disclaimer: string;
}

// Drug Comparison Types
export interface DrugInfo {
    name: string;
    genericName: string;
    drugClass: string;
    commonUses: string[];
    sideEffects: string[];
    warnings: string[];
    averageCost: string;
    prescription: boolean;
}

export interface DrugAlternative {
    name: string;
    genericName: string;
    safetyRating: 'Safer' | 'Similar' | 'Use Caution';
    reason: string;
    costComparison: 'Cheaper' | 'Similar' | 'More Expensive';
    sideEffectComparison: string;
    effectiveness: string;
}

export interface NaturalAlternative {
    name: string;
    type: 'Food' | 'Herb' | 'Supplement' | 'Lifestyle';
    benefits: string[];
    howToUse: string;
    evidenceLevel: 'Strong' | 'Moderate' | 'Limited';
    warnings: string[];
    foodSources?: string[];
}

export interface DrugComparisonResult {
    originalDrug: DrugInfo;
    saferAlternatives: DrugAlternative[];
    naturalAlternatives: NaturalAlternative[];
    interactionWarnings: string[];
    generalAdvice: string[];
    disclaimer: string;
}
