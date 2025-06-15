import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Pinecone } from "@pinecone-database/pinecone";
import { NextResponse } from "next/server";


const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});


export async function POST(req) {
    try {
        const { question, documentId } = await req.json()
        console.log(question, documentId)
        if (!question.trim() || !documentId) {
            return new Response("Missing question or documentId", { status: 400 })
        }

        const embedding = new GoogleGenerativeAIEmbeddings({
            model: "models/embedding-001",
            apiKey: process.env.GOOGLE_API_KEY,
            output_dimensionality: 1024,
        });
        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME)
        const vectorstore = await PineconeStore.fromExistingIndex(embedding, {
            pineconeIndex: index,
            filter: { documentId },
        })

        const results = await vectorstore.similaritySearch(question, 4)

        if (results.length === 0) {
            return NextResponse.json({
                answer: "I dont't know the answer to that question"
            })
        }


        const contentText = results.map((r) => r.pageContent).join("\n\n")
        const googleai = new ChatGoogleGenerativeAI({ model: "gemini-2.0-flash" });

        const prompt = `
You are a helpful and intelligent AI assistant.

Using the following document content, answer the user's question as clearly, accurately, and concisely as possible.

If needed, format the response with:
- Headings (using **bold** or ALL CAPS)
- Bullet points or numbered lists
- Paragraphs for detailed explanations
- Line breaks to separate sections for better readability

If the answer is not found in the content, say "I don't know."

--- Document Content ---
${contentText}

--- User Question ---
${question}
`;


        console.log("object")


        const response = await googleai.invoke(prompt)
        console.log(response)
        return NextResponse.json({
            answer: response.content
        })

    } catch (error) {
        console.log("Error Processing Question", error)

        return NextResponse.json({
            answer: "Error occured while processing question"
        })
    }
}