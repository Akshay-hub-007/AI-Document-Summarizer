import { Pinecone } from "@pinecone-database/pinecone"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { ChatGoogleGenerativeAI, GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"
import { PineconeStore } from "@langchain/pinecone"
import { NextResponse } from "next/server"

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
});

export async function POST(req) {
    try {
        const formdata = await req.formData();
        const file = formdata.get("file");

        if (!file) {
            return new Response("No file provided", { status: 400 });
        }

        const documentId = crypto.randomUUID();
        const blob = new Blob([await file.arrayBuffer()], { type: file.type });

        const loader = new PDFLoader(blob);
        const docs = await loader.load();

        const textsplitter = new RecursiveCharacterTextSplitter({
            chunkOverlap: 200,
            chunkSize: 1000
        });

        const splitDocs = await textsplitter.splitDocuments(docs);

        const docsWithMetaData = splitDocs.map((doc) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                documentId,
            }
        }));
       console.log(docsWithMetaData)

        const googleai = new ChatGoogleGenerativeAI({model:"gemini-2.0-flash"});

        const summary = await googleai.invoke(
            `Summarize the following document: ${splitDocs[0].pageContent}`
        );
       
        const embedding = new GoogleGenerativeAIEmbeddings({
            model: "models/gemini-embedding-exp-03-07",
            apiKey: process.env.GOOGLE_API_KEY
        });

        const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);
          console.log("h")
        await PineconeStore.fromDocuments(docsWithMetaData, embedding, {
            pineconeIndex: index
        });
      console.log("h")
        return NextResponse.json({
            summary,
            documentId,
            pageCount: docs.length
        });

    } catch (error) {
        console.error("Upload API error:", error);
        return NextResponse.json({ error: "Something went wrong during upload." }, { status: 500 });
    }
}
