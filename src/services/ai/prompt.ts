/**
 * Shared prompt for career gap analysis - used by all AI providers
 */
export function buildGapAnalysisPrompt(
  resumeText: string,
  jobDescriptionText: string
): string {
  return `You are a career gap analysis expert. Analyze the gap between this resume and job description.

**RESUME:**
${resumeText}

**JOB DESCRIPTION:**
${jobDescriptionText}

**INSTRUCTIONS:**
1. Identify skills present in the JD but missing from the resume
2. Create exactly 3 concrete, actionable learning steps to bridge the gap (each step should include specific actions, timeline, and resources)
3. Generate exactly 3 interview questions targeting the identified gaps
4. Write a detailed markdown roadmap (minimum 200 words) with timeline, milestones, and resources

**OUTPUT FORMAT:**
You must respond with ONLY valid JSON (no markdown code blocks, no explanations). Use this exact structure:

{
  "missing_skills": ["skill1", "skill2", "skill3"],
  "learning_steps": [
    "Step 1: Specific action with timeline and resource",
    "Step 2: Specific action with timeline and resource",
    "Step 3: Specific action with timeline and resource"
  ],
  "interview_questions": [
    "Question 1 about missing skill",
    "Question 2 about missing skill",
    "Question 3 about missing skill"
  ],
  "roadmap_markdown": "# Your Learning Roadmap\\n\\n## Overview\\n...detailed markdown here..."
}

CRITICAL RULES:
- Respond with ONLY the JSON object, no other text before or after
- Do not use markdown code blocks (\`\`\`json)
- Ensure all JSON strings are properly escaped
- Make the roadmap detailed and actionable (minimum 200 words)
- Include specific resources, courses, and timelines in the roadmap`;
}
