
export type TargetLanguage = 'ASL' | 'BSL' | 'NSL';

export interface FacialExpression {
  timestamp: number;
  type: string;
  intensity: number;
}

export interface HandshapeParams {
  sign: string;
  dominant_hand: 'left' | 'right';
  location: string;
  movement: string;
}

export interface SignLanguageOutput {
  sign_language: string;
  gloss_sequence: string[];
  facial_expressions: FacialExpression[];
  handshape_params: HandshapeParams[];
  emotion_register: string;
  duration_estimate_ms: number;
  pace?: "slow" | "normal";
  clarification_needed?: string | null;
  error_context?: string | null;
}

export const SYSTEM_INSTRUCTIONS = `
You are the Motion-S Translation Engine. Your goal is to translate natural language into precise 3D sign language descriptors.

Rules:
- Translate the input text into a sequence of Glosses (canonical sign names).
- For each Gloss, provide specific handshape, location, and movement descriptors.
- Always return valid handshape_params entries for EVERY gloss in gloss_sequence. Arrays must be same length.
- For location values, only use these strings exactly: chest, face, head, forehead, chin, neutral, shoulder_left, shoulder_right, body.
- Include facial expressions (non-manual markers) with timestamps relative to the total duration.
- If input is medical or legal, set "pace": "slow".
- If input is ambiguous, set "clarification_needed" to one clear question.
- Respond ONLY with valid JSON matching the provided schema.
`;

// Joint rotation targets (radians) for specific signing locations
export const SIGN_POSITIONS: Record<string, { shoulder: [number, number, number], elbow: [number, number, number] }> = {
  'chest':    { shoulder: [-0.3, 0, 0.2], elbow: [1.2, 0, 0] },
  'face':     { shoulder: [-0.8, 0, 0.4], elbow: [1.8, 0, 0] },
  'head':     { shoulder: [-1.2, 0, 0.5], elbow: [2.0, 0, 0] },
  'forehead': { shoulder: [-1.4, 0, 0.6], elbow: [2.2, 0, 0] },
  'chin':     { shoulder: [-0.6, 0, 0.3], elbow: [1.6, 0, 0] },
  'neutral':  { shoulder: [0.1, 0, 0.3],  elbow: [0.4, 0, 0] },
  'body':     { shoulder: [-0.2, 0, 0.2], elbow: [1.0, 0, 0] },
  'shoulder_left':  { shoulder: [-0.4, 0, -0.2], elbow: [1.1, 0, 0] },
  'shoulder_right': { shoulder: [-0.4, 0, 0.6],  elbow: [1.1, 0, 0] },
};
