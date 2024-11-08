
import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    
    const promt="create a list of three open-ended and engaging questions fromatted as a singel string , each question should be separated by '||' these questions are for an anonymous social messaging pkatefrom like qooh.me,and should be suitable for a diverse audience avoid pesonal or sansitive topics focusing interaction for whats a hobby youhave recently started? || if you could have dinner with any historical figure who would it be ? || whats a simple thing that makes you happy? ensure the quations are intriguing foster curiosity and contribute to a positive and welcoming conversational environment"

    try {
        const result = await streamText({
            model: openai('gpt-4-turbo'),
            prompt: promt,
            maxTokens: 50,
        });

        console.log("result", result.toDataStreamResponse());

        return result.toDataStreamResponse();
    } catch (error) {

        if (error instanceof Error) {

            console.log("error in suggest message", error.message);
            return Response.json({ error: error.message, success: false }, { status: 500 },);

        } else {

            console.log("error in suggest message", error);
            return Response.json({ error: "error in suggest message", success: false }, { status: 500 },);
        }
    }
}