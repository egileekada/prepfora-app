export type QuestionType = "multiple-choice" | "comprehension" | "essay";

export interface Option {
    id: "A" | "B" | "C" | "D";
    text: string;
}

export interface ExamQuestion {
    id: number;
    type: QuestionType;
    subject: string;
    year?: string;
    prompt: string;
    topicSubtitle?: string;
    options?: Option[];
    correctAnswer?: string;
    // For comprehension
    passageTitle?: string;
    passageCategory?: string;
    passageContent?: string;
    // For essay
    essayInstructionTitle?: string;
    essayInstructionTopic?: string;
    essayInstructions?: string[];
    wordLimit?: string;
}

export const MOCK_EXAM_QUESTIONS: ExamQuestion[] = [
    {
        id: 1,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Evaluate the limit: \\( \\lim_{x \\to 0} \\frac{\\sin(5x)}{x} \\).",
        options: [
            { id: "A", text: "0" },
            { id: "B", text: "1" },
            { id: "C", text: "5" },
            { id: "D", text: "Does not exist" },
        ],
        correctAnswer: "C",
    },
    {
        id: 2,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "If \\( \\log_{10}(2x + 1) = 2 \\), find the value of \\( x \\).",
        options: [
            { id: "A", text: "49.5" },
            { id: "B", text: "50" },
            { id: "C", text: "99" },
            { id: "D", text: "100" },
        ],
        correctAnswer: "A",
    },
    {
        id: 3,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Find the sum of the first 20 terms of the arithmetic progression 3, 7, 11, 15, ...",
        options: [
            { id: "A", text: "800" },
            { id: "B", text: "820" },
            { id: "C", text: "840" },
            { id: "D", text: "860" },
        ],
        correctAnswer: "B",
    },
    {
        id: 4,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Solve the quadratic equation \\( 2x^2 - 7x + 3 = 0 \\).",
        options: [
            { id: "A", text: "x = 3 or x = 1/2" },
            { id: "B", text: "x = -3 or x = -1/2" },
            { id: "C", text: "x = 2 or x = 3/2" },
            { id: "D", text: "x = 1 or x = 3" },
        ],
        correctAnswer: "A",
    },
    {
        id: 5,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Calculate the determinant of the matrix \\( \\begin{pmatrix} 3 & 4 \\\\ 2 & 5 \\end{pmatrix} \\).",
        options: [
            { id: "A", text: "7" },
            { id: "B", text: "15" },
            { id: "C", text: "23" },
            { id: "D", text: "8" },
        ],
        correctAnswer: "A",
    },
    {
        id: 6,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Find the integral: \\( \\int (3x^2 + 4x - 5) \\, dx \\).",
        options: [
            { id: "A", text: "\\( x^3 + 2x^2 - 5x + C \\)" },
            { id: "B", text: "\\( 6x + 4 + C \\)" },
            { id: "C", text: "\\( 3x^3 + 4x^2 - 5x + C \\)" },
            { id: "D", text: "\\( x^3 + 4x^2 - 5 + C \\)" },
        ],
        correctAnswer: "A",
    },
    {
        id: 7,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Find the derivative of the function \\( f(x) = e^{2x} \\sin(3x) \\) with respect to \\( x \\).",
        options: [
            { id: "A", text: "\\( f'(x) = 2e^{2x}\\sin(3x) + 3e^{2x}\\cos(3x) \\)" },
            { id: "B", text: "\\( f'(x) = e^{2x}(2\\sin(3x) + 3\\cos(3x)) \\)" },
            { id: "C", text: "\\( f'(x) = 6e^{2x}\\cos(3x) \\)" },
            { id: "D", text: "\\( f'(x) = e^{2x}\\sin(3x) + \\cos(3x) \\)" },
        ],
        correctAnswer: "B",
    },
    {
        id: 8,
        type: "comprehension",
        subject: "English Language",
        year: "2020",
        passageTitle: "Passage 1: The Future of Renewable Energy in Nigeria",
        passageCategory: "Reading Comprehension",
        passageContent: `Nigeria, often referred to as the "Giant of Africa," stands at a pivotal crossroads in its energy evolution. Despite being one of the world's leading oil producers, the nation faces chronic power shortages that stifle industrial growth and daily convenience. The transition toward renewable energy—specifically solar and wind—is no longer a luxury but a necessity for sustainable development.

The northern regions of Nigeria possess some of the highest solar radiation levels in Sub-Saharan Africa, offering a vast, untapped reservoir of clean energy. However, the primary challenge for solar adoption remains the high initial capital expenditure required for infrastructure and the lack of a robust national grid capable of integrating decentralized power sources.

Furthermore, regulatory hurdles and inconsistent policy frameworks have historically deterred large-scale international investment. For Nigeria to truly harness its renewable potential, a synergy between private sector innovation and government-led incentives must be established, ensuring that the sun's bounty translates into powering every home and school.`,
        prompt: "According to the second paragraph, what is the primary challenge for solar adoption in Nigeria?",
        options: [
            { id: "A", text: "The lack of sufficient solar radiation in the northern regions." },
            { id: "B", text: "High initial capital costs and grid integration issues." },
            { id: "C", text: "A total absence of international investment interest." },
            { id: "D", text: "The nation's over-reliance on wind energy over solar." },
        ],
        correctAnswer: "B",
    },
    {
        id: 9,
        type: "comprehension",
        subject: "English Language",
        year: "2020",
        passageTitle: "Passage 1: The Future of Renewable Energy in Nigeria",
        passageCategory: "Reading Comprehension",
        passageContent: `Nigeria, often referred to as the "Giant of Africa," stands at a pivotal crossroads in its energy evolution. Despite being one of the world's leading oil producers, the nation faces chronic power shortages that stifle industrial growth and daily convenience. The transition toward renewable energy—specifically solar and wind—is no longer a luxury but a necessity for sustainable development.

The northern regions of Nigeria possess some of the highest solar radiation levels in Sub-Saharan Africa, offering a vast, untapped reservoir of clean energy. However, the primary challenge for solar adoption remains the high initial capital expenditure required for infrastructure and the lack of a robust national grid capable of integrating decentralized power sources.

Furthermore, regulatory hurdles and inconsistent policy frameworks have historically deterred large-scale international investment. For Nigeria to truly harness its renewable potential, a synergy between private sector innovation and government-led incentives must be established, ensuring that the sun's bounty translates into powering every home and school.`,
        prompt: "From the passage, the phrase 'sun's bounty' refers metaphorically to:",
        options: [
            { id: "A", text: "The extreme heat waves causing agricultural loss." },
            { id: "B", text: "The abundant solar energy potential available." },
            { id: "C", text: "Financial grants supplied by international donors." },
            { id: "D", text: "Traditional folklore associated with solar deities." },
        ],
        correctAnswer: "B",
    },
    {
        id: 10,
        type: "essay",
        subject: "English Language",
        year: "2020",
        essayInstructionTitle: "Essay Instructions",
        essayInstructionTopic: "The role of technology in modern education.",
        essayInstructions: [
            "Write an article suitable for publication in a national newspaper on the topic:",
            '"The impact of digital learning tools on the academic performance of secondary school students in West Africa."',
            "Your article should highlight at least three positive impacts and two challenges associated with these tools.",
        ],
        wordLimit: "Word limit: 450 - 500 words.",
        prompt: "Write an article suitable for publication in a national newspaper on the topic:",
        topicSubtitle: '"The impact of digital learning tools on the academic performance of secondary school students in West Africa."',
    },
    {
        id: 11,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "What is the probability of rolling a prime number on a standard fair six-sided die?",
        options: [
            { id: "A", text: "1/6" },
            { id: "B", text: "1/3" },
            { id: "C", text: "1/2" },
            { id: "D", text: "2/3" },
        ],
        correctAnswer: "C",
    },
    {
        id: 12,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Express \\( 0.000458 \\) in scientific standard notation.",
        options: [
            { id: "A", text: "\\( 4.58 \\times 10^{-4} \\)" },
            { id: "B", text: "\\( 45.8 \\times 10^{-5} \\)" },
            { id: "C", text: "\\( 4.58 \\times 10^{-3} \\)" },
            { id: "D", text: "\\( 0.458 \\times 10^{-3} \\)" },
        ],
        correctAnswer: "A",
    },
    {
        id: 13,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Find the midpoint of the line segment joining points \\( A(2, -4) \\) and \\( B(6, 8) \\).",
        options: [
            { id: "A", text: "(4, 2)" },
            { id: "B", text: "(8, 4)" },
            { id: "C", text: "(4, 6)" },
            { id: "D", text: "(2, 4)" },
        ],
        correctAnswer: "A",
    },
    {
        id: 14,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Simplify: \\( \\frac{\\sqrt{75} + \\sqrt{48}}{\\sqrt{12}} \\).",
        options: [
            { id: "A", text: "4" },
            { id: "B", text: "9/2" },
            { id: "C", text: "5" },
            { id: "D", text: "3" },
        ],
        correctAnswer: "B",
    },
    {
        id: 15,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "If \\( \\tan(\\theta) = 3/4 \\) and \\( \\theta \\) is acute, find \\( \\cos(\\theta) \\).",
        options: [
            { id: "A", text: "3/5" },
            { id: "B", text: "4/5" },
            { id: "C", text: "5/4" },
            { id: "D", text: "4/3" },
        ],
        correctAnswer: "B",
    },
    {
        id: 16,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Find the equation of the line passing through \\( (0, 3) \\) with slope 2.",
        options: [
            { id: "A", text: "y = 2x + 3" },
            { id: "B", text: "y = 3x + 2" },
            { id: "C", text: "2x + y = 3" },
            { id: "D", text: "y = 2x - 3" },
        ],
        correctAnswer: "A",
    },
    {
        id: 17,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "What is the radius of the circle given by \\( x^2 + y^2 - 6x + 8y = 0 \\)?",
        options: [
            { id: "A", text: "5" },
            { id: "B", text: "25" },
            { id: "C", text: "10" },
            { id: "D", text: "7" },
        ],
        correctAnswer: "A",
    },
    {
        id: 18,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Solve for \\( x \\): \\( 3^{2x+1} = 27 \\).",
        options: [
            { id: "A", text: "x = 1" },
            { id: "B", text: "x = 2" },
            { id: "C", text: "x = 3" },
            { id: "D", text: "x = 0" },
        ],
        correctAnswer: "A",
    },
    {
        id: 19,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Find the mean of the numbers: 12, 15, 18, 22, 23.",
        options: [
            { id: "A", text: "17" },
            { id: "B", text: "18" },
            { id: "C", text: "19" },
            { id: "D", text: "20" },
        ],
        correctAnswer: "B",
    },
    {
        id: 20,
        type: "multiple-choice",
        subject: "Mathematics",
        year: "2020",
        prompt: "Calculate the compound interest on ₦100,000 for 2 years at 10% per annum compounded annually.",
        options: [
            { id: "A", text: "₦20,000" },
            { id: "B", text: "₦21,000" },
            { id: "C", text: "₦22,100" },
            { id: "D", text: "₦121,000" },
        ],
        correctAnswer: "B",
    },
];
