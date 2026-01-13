import { Survey } from '@/types/survey';

export const preWorkshopSurvey: Survey = {
  id: 'pre-workshop-2026',
  type: 'pre-workshop',
  title: 'Pre-Workshop Survey',
  description: 'Help us understand your AI knowledge and expectations for the workshop',
  sections: [
    {
      id: 'demographics',
      title: 'About You',
      description: 'Tell us a bit about yourself',
      questions: [
        {
          id: 'name',
          text: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: 'email',
          text: 'Email Address',
          type: 'text',
          required: true,
          placeholder: 'your.email@company.com'
        },
        {
          id: 'organization',
          text: 'Organization',
          type: 'text',
          required: true,
          placeholder: 'Your company or organization'
        },
        {
          id: 'role',
          text: 'Current Role',
          type: 'multiple-choice',
          required: true,
          options: [
            'Executive / C-Suite',
            'Senior Manager',
            'Manager',
            'Team Lead',
            'Individual Contributor',
            'Consultant',
            'Other'
          ]
        }
      ]
    },
    {
      id: 'ai-knowledge',
      title: 'AI Knowledge & Experience',
      description: 'Help us understand your current level of AI knowledge',
      questions: [
        {
          id: 'ai-familiarity',
          text: 'How familiar are you with AI and machine learning concepts?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not familiar at all',
            high: 'Very familiar'
          }
        },
        {
          id: 'ai-tools-used',
          text: 'Which AI tools or platforms have you used? (Select all that apply)',
          type: 'multiple-choice',
          required: false,
          allowMultiple: true,
          options: [
            'ChatGPT / GPT-4',
            'Claude',
            'Gemini',
            'Copilot',
            'Custom AI solutions',
            'Machine Learning platforms (e.g., TensorFlow, PyTorch)',
            'Business Intelligence AI tools',
            'None',
            'Other'
          ]
        },
        {
          id: 'ai-business-exposure',
          text: 'How much exposure have you had to AI in a business context?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'No exposure',
            high: 'Extensive exposure'
          }
        },
        {
          id: 'ai-implementation',
          text: 'Have you been involved in implementing AI solutions in your organization?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Yes, led implementation',
            'Yes, participated in implementation',
            'Observed but not involved',
            'No, not yet',
            'Not applicable'
          ]
        }
      ]
    },
    {
      id: 'expectations',
      title: 'Workshop Expectations',
      description: 'What are you hoping to gain from this workshop?',
      questions: [
        {
          id: 'main-goals',
          text: 'What are your main goals for attending this workshop? (Select up to 3)',
          type: 'multiple-choice',
          required: true,
          allowMultiple: true,
          options: [
            'Understand AI fundamentals and capabilities',
            'Learn how to apply AI in business contexts',
            'Develop an AI strategy for my organization',
            'Identify AI use cases for my industry',
            'Network with other professionals',
            'Stay current with AI trends',
            'Understand ethical and regulatory considerations',
            'Learn about change management for AI adoption'
          ]
        },
        {
          id: 'specific-challenges',
          text: 'What specific challenges related to AI are you facing in your role?',
          type: 'text',
          required: false,
          multiline: true,
          placeholder: 'Describe any challenges or questions you have...'
        },
        {
          id: 'confidence-before',
          text: 'How confident do you feel about leading AI initiatives in your organization?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not confident',
            high: 'Very confident'
          }
        },
        {
          id: 'learning-preference',
          text: 'What learning format do you prefer?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Interactive discussions and group work',
            'Case studies and real-world examples',
            'Hands-on exercises and activities',
            'Lectures and presentations',
            'Mix of all formats'
          ]
        }
      ]
    },
    {
      id: 'organization-context',
      title: 'Organization Context',
      description: 'Help us understand your organizational context',
      questions: [
        {
          id: 'org-size',
          text: 'What is the size of your organization?',
          type: 'multiple-choice',
          required: true,
          options: [
            '1-50 employees',
            '51-200 employees',
            '201-1000 employees',
            '1001-5000 employees',
            '5000+ employees'
          ]
        },
        {
          id: 'industry',
          text: 'Which industry does your organization operate in?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Technology',
            'Financial Services',
            'Healthcare',
            'Retail / E-commerce',
            'Manufacturing',
            'Professional Services',
            'Education',
            'Government / Public Sector',
            'Non-profit',
            'Other'
          ]
        },
        {
          id: 'ai-maturity',
          text: 'What is your organization\'s current AI maturity level?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Just starting to explore AI',
            'Running pilot projects',
            'Have some AI solutions in production',
            'AI integrated across multiple functions',
            'AI-first organization',
            'Not sure'
          ]
        }
      ]
    }
  ]
};

export const postWorkshopSurvey: Survey = {
  id: 'post-workshop-2026',
  type: 'post-workshop',
  title: 'Post-Workshop Survey',
  description: 'Share your feedback and learnings from the workshop',
  sections: [
    {
      id: 'participant-info',
      title: 'Participant Information',
      questions: [
        {
          id: 'name',
          text: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name'
        },
        {
          id: 'email',
          text: 'Email Address',
          type: 'text',
          required: true,
          placeholder: 'your.email@company.com'
        }
      ]
    },
    {
      id: 'satisfaction',
      title: 'Overall Satisfaction',
      description: 'How would you rate your workshop experience?',
      questions: [
        {
          id: 'overall-satisfaction',
          text: 'Overall, how satisfied were you with the workshop?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not satisfied',
            high: 'Extremely satisfied'
          }
        },
        {
          id: 'recommendation',
          text: 'How likely are you to recommend this workshop to a colleague?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not likely',
            high: 'Very likely'
          }
        },
        {
          id: 'expectations-met',
          text: 'Did the workshop meet your expectations?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Exceeded expectations',
            'Met expectations',
            'Somewhat met expectations',
            'Did not meet expectations'
          ]
        }
      ]
    },
    {
      id: 'learning-outcomes',
      title: 'Learning Outcomes',
      description: 'Tell us what you learned',
      questions: [
        {
          id: 'knowledge-gained',
          text: 'How much did your understanding of AI improve?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'No improvement',
            high: 'Significant improvement'
          }
        },
        {
          id: 'confidence-after',
          text: 'How confident do you now feel about leading AI initiatives in your organization?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not confident',
            high: 'Very confident'
          }
        },
        {
          id: 'key-learnings',
          text: 'What were your top 3 key learnings from the workshop?',
          type: 'text',
          required: true,
          multiline: true,
          placeholder: 'List your key takeaways...'
        },
        {
          id: 'practical-application',
          text: 'How likely are you to apply what you learned in your work?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not likely',
            high: 'Very likely'
          }
        },
        {
          id: 'application-areas',
          text: 'In which areas do you plan to apply your learnings? (Select all that apply)',
          type: 'multiple-choice',
          required: false,
          allowMultiple: true,
          options: [
            'Developing AI strategy',
            'Identifying use cases',
            'Leading AI projects',
            'Change management',
            'Team education and training',
            'Vendor evaluation',
            'Risk and compliance',
            'Other'
          ]
        }
      ]
    },
    {
      id: 'content-evaluation',
      title: 'Content Evaluation',
      description: 'Rate different aspects of the workshop',
      questions: [
        {
          id: 'content-relevance',
          text: 'How relevant was the content to your role and organization?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not relevant',
            high: 'Very relevant'
          }
        },
        {
          id: 'content-depth',
          text: 'Was the depth of content appropriate?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Too basic',
            'Appropriate',
            'Too advanced'
          ]
        },
        {
          id: 'pace',
          text: 'Was the pace of the workshop appropriate?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Too slow',
            'Just right',
            'Too fast'
          ]
        },
        {
          id: 'materials-quality',
          text: 'How would you rate the quality of workshop materials?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Poor',
            high: 'Excellent'
          }
        },
        {
          id: 'most-valuable',
          text: 'What aspect of the workshop did you find most valuable?',
          type: 'text',
          required: false,
          multiline: true,
          placeholder: 'Describe what was most valuable...'
        }
      ]
    },
    {
      id: 'facilitation',
      title: 'Facilitation & Delivery',
      questions: [
        {
          id: 'facilitator-knowledge',
          text: 'How would you rate the facilitator\'s knowledge and expertise?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Poor',
            high: 'Excellent'
          }
        },
        {
          id: 'facilitator-engagement',
          text: 'How engaging was the facilitator?',
          type: 'rating',
          required: true,
          scale: 5,
          labels: {
            low: 'Not engaging',
            high: 'Very engaging'
          }
        },
        {
          id: 'interaction-opportunities',
          text: 'Were there sufficient opportunities for interaction and questions?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Too few opportunities',
            'Right amount',
            'Too many opportunities'
          ]
        }
      ]
    },
    {
      id: 'improvements',
      title: 'Feedback & Suggestions',
      questions: [
        {
          id: 'improvements',
          text: 'What could be improved about the workshop?',
          type: 'text',
          required: false,
          multiline: true,
          placeholder: 'Your suggestions for improvement...'
        },
        {
          id: 'additional-topics',
          text: 'What additional topics would you like to see covered in future workshops?',
          type: 'text',
          required: false,
          multiline: true,
          placeholder: 'Topics you\'d like to learn about...'
        },
        {
          id: 'follow-up-interest',
          text: 'Would you be interested in follow-up sessions or advanced workshops?',
          type: 'multiple-choice',
          required: true,
          options: [
            'Yes, definitely',
            'Maybe',
            'No, not at this time'
          ]
        },
        {
          id: 'additional-comments',
          text: 'Any additional comments or feedback?',
          type: 'text',
          required: false,
          multiline: true,
          placeholder: 'Share any other thoughts...'
        }
      ]
    }
  ]
};

export const surveys = {
  'pre-workshop': preWorkshopSurvey,
  'post-workshop': postWorkshopSurvey
};
