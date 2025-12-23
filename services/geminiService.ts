// ==========================================
// AIDoctor Pro - Gemini AI Service
// ==========================================

import { GoogleGenAI, Type } from "@google/genai";
import type {
    DiagnosisResult,
    SecondOpinionResult,
    Symptom,
    PatientProfile,
    HealthRecommendation
} from "../types";

// Initialize Gemini AI
const getAI = () => {
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("Gemini API key not configured. Please set GEMINI_API_KEY in .env.local");
    }
    return new GoogleGenAI({ apiKey });
};

// Format symptoms for AI prompt
const formatSymptoms = (symptoms: Symptom[]): string => {
    return symptoms.map(s =>
        `- ${s.name} (${s.severity} severity, duration: ${s.duration})${s.location ? ` at ${s.location}` : ''}${s.description ? `: ${s.description}` : ''}`
    ).join('\n');
};

// Format patient profile for AI prompt
const formatProfile = (profile: PatientProfile | null): string => {
    if (!profile) return "No patient profile provided.";

    return `
PATIENT PROFILE:
- Age: ${profile.age} years old
- Gender: ${profile.gender}
- Weight: ${profile.weight} kg, Height: ${profile.height} cm
- Existing Conditions: ${profile.conditions.length > 0 ? profile.conditions.join(', ') : 'None reported'}
- Current Medications: ${profile.medications.length > 0 ? profile.medications.join(', ') : 'None'}
- Known Allergies: ${profile.allergies.length > 0 ? profile.allergies.join(', ') : 'None'}
- Family History: ${profile.familyHistory.length > 0 ? profile.familyHistory.join(', ') : 'None reported'}
- Lifestyle: ${profile.lifestyle.smoking ? 'Smoker' : 'Non-smoker'}, ${profile.lifestyle.alcohol ? 'Drinks alcohol' : 'No alcohol'}, ${profile.lifestyle.exercise} activity level
`.trim();
};

/**
 * Analyze symptoms and provide possible conditions
 */
export const analyzeSymptoms = async (
    symptoms: Symptom[],
    profile: PatientProfile | null = null,
    additionalNotes: string = ''
): Promise<DiagnosisResult> => {
    const ai = getAI();
    const modelId = "gemini-2.0-flash";

    const prompt = `
You are a helpful AI medical assistant. A patient is describing their symptoms and needs guidance.

${formatProfile(profile)}

REPORTED SYMPTOMS:
${formatSymptoms(symptoms)}

${additionalNotes ? `ADDITIONAL NOTES: ${additionalNotes}` : ''}

IMPORTANT GUIDELINES:
1. Use simple, everyday language that anyone can understand
2. Be helpful but always recommend consulting a real doctor
3. Consider the patient's profile when assessing risk factors
4. Provide practical, actionable recommendations
5. Be caring and reassuring while being honest about potential concerns

Analyze these symptoms and provide:
1. Possible conditions that could explain these symptoms (ranked by likelihood)
2. The overall urgency level (Low/Medium/High/Emergency)
3. Recommended actions the patient should take
4. Warning signs to watch for
5. Questions they should ask their doctor

Remember: You are providing information to help someone prepare for a doctor visit, NOT replacing medical diagnosis.
`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                systemInstruction: "You are AIDoctor Pro, a compassionate AI health assistant. Explain medical concepts in everyday language as if talking to a concerned family member. Always emphasize the importance of professional medical care while providing helpful, accurate information.",
                temperature: 0.3,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        possibleConditions: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    likelihood: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
                                    confidenceScore: { type: Type.NUMBER, description: "0-100 confidence percentage" },
                                    description: { type: Type.STRING, description: "Simple explanation of what this condition is" },
                                    commonSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    riskFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    typicalTreatments: { type: Type.ARRAY, items: { type: Type.STRING } },
                                    whenToSeek: { type: Type.STRING, description: "When to seek immediate care" }
                                },
                                required: ['name', 'likelihood', 'confidenceScore', 'description']
                            }
                        },
                        urgencyLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Emergency'] },
                        recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                        warningSignsToWatch: { type: Type.ARRAY, items: { type: Type.STRING } },
                        questionsForDoctor: { type: Type.ARRAY, items: { type: Type.STRING } },
                        disclaimer: { type: Type.STRING }
                    },
                    required: ['possibleConditions', 'urgencyLevel', 'recommendedActions', 'disclaimer']
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as DiagnosisResult;

    } catch (error) {
        console.error("Symptom analysis failed:", error);
        throw error;
    }
};

/**
 * Get a second opinion on an existing diagnosis
 */
export const getSecondOpinion = async (
    existingDiagnosis: string,
    symptoms: Symptom[],
    treatmentPrescribed: string = '',
    patientConcerns: string = '',
    profile: PatientProfile | null = null
): Promise<SecondOpinionResult> => {
    const ai = getAI();
    const modelId = "gemini-2.0-flash";

    const prompt = `
You are a thoughtful AI medical assistant helping a patient understand their diagnosis better.

${formatProfile(profile)}

EXISTING DIAGNOSIS: ${existingDiagnosis}
${treatmentPrescribed ? `PRESCRIBED TREATMENT: ${treatmentPrescribed}` : ''}

CURRENT SYMPTOMS:
${formatSymptoms(symptoms)}

${patientConcerns ? `PATIENT'S CONCERNS: ${patientConcerns}` : ''}

TASK: Provide a thoughtful second opinion analysis.

GUIDELINES:
1. Be respectful of the original diagnosis - doctors have examined the patient
2. Explain whether the diagnosis aligns with the reported symptoms
3. Mention if there are other conditions worth considering
4. Suggest questions the patient can ask for clarity
5. Recommend additional tests that might be helpful
6. Use simple, clear language

This is meant to help the patient have a more informed conversation with their healthcare provider, not to undermine their doctor.
`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                systemInstruction: "You are AIDoctor Pro, providing thoughtful second opinion analysis. Be balanced - acknowledge the original diagnosis while offering additional perspectives. Never tell a patient their doctor is wrong, instead empower them with questions and considerations.",
                temperature: 0.3,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        originalDiagnosis: { type: Type.STRING },
                        analysisConfidence: { type: Type.NUMBER, description: "0-100 confidence in analysis" },
                        agreement: { type: Type.STRING, enum: ['Fully Agrees', 'Partially Agrees', 'Suggests Review'] },
                        analysis: { type: Type.STRING, description: "Detailed but simple analysis of the diagnosis" },
                        alternativeConsiderations: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    name: { type: Type.STRING },
                                    reason: { type: Type.STRING },
                                    differentiatingFactors: { type: Type.ARRAY, items: { type: Type.STRING } }
                                },
                                required: ['name', 'reason']
                            }
                        },
                        additionalTestsSuggested: { type: Type.ARRAY, items: { type: Type.STRING } },
                        questionsToAsk: { type: Type.ARRAY, items: { type: Type.STRING } },
                        secondOpinionSummary: { type: Type.STRING },
                        disclaimer: { type: Type.STRING }
                    },
                    required: ['originalDiagnosis', 'analysisConfidence', 'agreement', 'analysis', 'disclaimer']
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as SecondOpinionResult;

    } catch (error) {
        console.error("Second opinion analysis failed:", error);
        throw error;
    }
};

/**
 * Generate personalized health recommendations
 */
export const generateHealthRecommendations = async (
    profile: PatientProfile
): Promise<HealthRecommendation[]> => {
    const ai = getAI();
    const modelId = "gemini-2.0-flash";

    const prompt = `
Based on this patient's health profile, provide personalized wellness recommendations.

${formatProfile(profile)}

Generate practical, actionable health recommendations across these categories:
- Lifestyle improvements
- Diet suggestions  
- Exercise recommendations
- Mental health tips
- Preventive care reminders

Focus on simple changes that can make a real difference. Prioritize based on their conditions and risk factors.
`;

    try {
        const response = await ai.models.generateContent({
            model: modelId,
            contents: prompt,
            config: {
                systemInstruction: "Provide friendly, encouraging health recommendations. Focus on achievable goals and positive changes.",
                temperature: 0.5,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            category: { type: Type.STRING, enum: ['Lifestyle', 'Diet', 'Exercise', 'Mental Health', 'Preventive Care'] },
                            title: { type: Type.STRING },
                            description: { type: Type.STRING },
                            priority: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
                            actionItems: { type: Type.ARRAY, items: { type: Type.STRING } }
                        },
                        required: ['category', 'title', 'description', 'priority', 'actionItems']
                    }
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as HealthRecommendation[];

    } catch (error) {
        console.error("Recommendations generation failed:", error);
        throw error;
    }
};
