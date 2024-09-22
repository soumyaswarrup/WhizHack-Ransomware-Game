export const QUESTIONS = [
  {
    question:
      "A major stock trading platform has been hit by a ransomware attack. What's our first step?",
    options: [
      "Wait and see if the system resolves the issue on its own.",
      "Conduct an immediate audit to identify the source and scope of the breach.",
      "Shut down all network access to prevent further spread.",
    ],
    answer: 1,
  },
  {
    question:
      "The audit points to a phishing attack as the entry vector. Multiple workstations are affected. How do we proceed?",
    options: [
      "Isolate affected systems and cut internet access to critical assets.",
      "Engage with the attackers to buy time.",
      "Immediately inform all employees via email about the breach.",
    ],
    answer: 0,
  },
  {
    question:
      "Investors are panicking, and the media is calling. We need a communication strategy. Your advice?",
    options: [
      "Release a detailed report of the incident to the media.",
      "Prepare a controlled statement emphasizing the containment and resolution efforts.",
      "Stay silent until more information is available.",
    ],
    answer: 1,
  },
  {
    question:
      "We've stabilized the system, but recovery is pending. How should we proceed with system restoration?",
    options: [
      "Begin system recovery using secure backups.",
      "Attempt to decrypt affected files using available tools.",
      "Negotiate with attackers for decryption keys.",
    ],
    answer: 0,
  },
  {
    question:
      "With the immediate crisis managed, we need to address future security. What should be our focus?",
    options: [
      "Enhance employee training on cybersecurity best practices.",
      "Invest in advanced threat detection systems.",
      "Implement a comprehensive security policy overhaul and incident response plan.",
    ],
    answer: 2,
  },
  {
    question:
      "Stakeholders are demanding updates. How do we manage ongoing communication?",
    options: [
      "Provide minimal updates to avoid potential legal issues.",
      "Establish a regular schedule of transparent, detailed updates.",
      "Defer all communication to legal team.",
    ],
    answer: 1,
  },
  {
    question:
      "We've detected attempts at a second wave of attacks. What's our immediate response?",
    options: [
      "Implement additional security measures and monitor closely.",
      "Shut down all systems temporarily.",
      "Conduct another round of employee training.",
    ],
    answer: 0,
  },
  {
    question:
      "Our backup systems were compromised. How do we approach data recovery?",
    options: [
      "Attempt to recover data from potentially infected backups.",
      "Recreate lost data manually from other sources.",
      "Utilize offsite, uncompromised backups for recovery.",
    ],
    answer: 2,
  },
  {
    question:
      "We need to rebuild trust with our stakeholders. What's the best approach?",
    options: [
      "Offer compensation for any losses incurred.",
      "Publish a detailed post-mortem of the incident.",
      "Host a series of town halls and Q&A sessions with key stakeholders.",
    ],
    answer: 2,
  },
  {
    question:
      "As we wrap up this incident, what's our strategy moving forward?",
    options: [
      "Focus on damage control and public relations.",
      "Implement a long-term cybersecurity improvement plan.",
      "Return to business as usual with minor security adjustments.",
    ],
    answer: 1,
  },
];

export const XC_TOKEN = import.meta.env.VITE_XC_TOKEN;

export const USER_TABLE_ID = import.meta.env.VITE_USER_TABLE_ID;

export const LEADERBOARD_TABLE_ID = import.meta.env.VITE_LEADERBOARD_TABLE_ID;
