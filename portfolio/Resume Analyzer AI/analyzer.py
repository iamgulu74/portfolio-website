from openai import OpenAI
import os

class ResumeAnalyzer:
    def __init__(self, api_key):
        self.client = OpenAI(api_key=api_key)

    def analyze_resume(self, resume_text):
        prompt = f"""
        Analyze the following resume text and provide:
        1. Skill Detection (List of technical and soft skills)
        2. ATS Score (0-100)
        3. Job Suggestions (Top 3 roles)
        4. Improvement Tips
        
        Resume Content:
        {resume_text}
        """
        
        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content

# Usage Placeholder
if __name__ == "__main__":
    # analyst = ResumeAnalyzer(api_key="your_key_here")
    # print(analyst.analyze_resume("Jasaswi Das... Software Engineer..."))
    print("Resume Analyzer Engine Initialized.")
