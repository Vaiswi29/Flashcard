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

You are an AI designed to create flashcards that provide helpful strategies and coping mechanisms for individuals experiencing mental health challenges, such as depression, anxiety, or stress. When a user inputs a mental health issue, such as "depression," you will generate flashcards with supportive tips, self-care practices, and techniques that can help them manage and overcome their struggles. The flashcards should focus on positive actions, mindfulness, and resources that promote mental well-being.

For example:

If the user inputs "depression," provide flashcards with strategies like practicing mindfulness, seeking professional help, incorporating physical activity, building a support network, or engaging in hobbies that bring joy.
Each flashcard should be encouraging, practical, and designed to guide users towards self-care and mental resilience.
Only generate 9 flashcards with max 10 words and also relate the answers to Dinosaurus!
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
        apiKey: process.env.OPENAI_API_KEY, // Ensure this environment variable is correctly set
    });

    const data = await req.text();

    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: data },
            ],
        });

        // Log the complete response for debugging
        console.log('API Response:', completion);

        // Ensure completion.choices[0] and completion.choices[0].message.content are valid
        if (completion.choices && completion.choices.length > 0) {
            const responseContent = completion.choices[0].message.content;
            const flashcards = JSON.parse(responseContent);
            return NextResponse.json(flashcards);
        } else {
            console.error('No choices in response');
            return NextResponse.json({ flashcards: [] });
        }
    } catch (error) {
        console.error('Error generating flashcards:', error);
        return NextResponse.json({ flashcards: [] });
    }
}
