// import { NextResponse } from "next/server";
// import OpenAI from 'openai';

// const systemPrompt = `
// You are a flashcard creator.
// Instructions:

// Topic Selection: Choose a specific topic, such as mathematics, history, science, or any other subject.
// Flashcard Format: Each flashcard should include a question on one side and an answer on the other side.
// Number of Flashcards: Create a minimum of five flashcards to ensure the topic is adequately covered.
// Content Complexity: Adjust the complexity of the questions and answers according to the user’s knowledge level. For instance, for a beginner, start with basic concepts. For advanced learners, include more challenging material.
// Review and Edit: After creating the flashcards, review them for accuracy and clarity. Make sure they are easy to understand and follow a logical sequence.
// Only generate 9 flashcards with max 10 words
// Return in the following JSON format:

// {
//     "flashcards": [ 
//         {
//         "front": "str",
//         "back": "str"
//         }
//     ]
// }
// `;

// export async function POST(req) {
//     const openai = new OpenAI({
//         baseURL: "https://openrouter.ai/api/v1",
//         apiKey: process.env.OPENROUTER_API_KEY,
        
//     });
//     const data = await req.text();

//     const completion = await openai.chat.completions.create({
//         model: "openai/gpt-3.5-turbo",
//         messages: [
//             { role: 'system', content: systemPrompt },
//             { role: 'user', content: data },
//         ],
        
//         response_format: {type: 'json_object'},
//     });
//     // console.log(completion.choices[0].message.content);
//     const flashcards = JSON.parse(completion.choices[0].message.content);
    
//     return NextResponse.json(flashcards.flashcards);
// }



import { NextResponse } from "next/server";
import OpenAI from 'openai';

const systemPrompt = `
You are a flashcard creator.
Instructions:

Topic Selection: Choose a specific topic, such as mathematics, history, science, or any other subject.
Flashcard Format: Each flashcard should include a question on one side and an answer on the other side.
Number of Flashcards: Create a minimum of five flashcards to ensure the topic is adequately covered.
Content Complexity: Adjust the complexity of the questions and answers according to the user’s knowledge level. For instance, for a beginner, start with basic concepts. For advanced learners, include more challenging material.
Review and Edit: After creating the flashcards, review them for accuracy and clarity. Make sure they are easy to understand and follow a logical sequence.
Only generate 9 flashcards with max 10 words
Return in the following JSON format:

{
    "flashcards": [ 
        {
        "front": "str",
        "back": "str"
        }
    ]
}
`;

export async function POST(req) {
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,
    });

    try {
        const data = await req.text();

        const completion = await openai.chat.completions.create({
            model: "openai/gpt-3.5-turbo",
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
            response_format: { type: 'json_object' },
        });

        // Ensure the response is valid and JSON.parse is safe
        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
            throw new Error('Invalid response content');
        }

        const flashcards = JSON.parse(responseContent);

        if (!flashcards.flashcards || !Array.isArray(flashcards.flashcards)) {
            throw new Error('Invalid flashcards format');
        }

        return NextResponse.json(flashcards.flashcards);

    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ error: 'Failed to generate flashcards' }, { status: 500 });
    }
}
