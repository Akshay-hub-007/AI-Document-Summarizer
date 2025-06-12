import { Pinecone } from "@pinecone-database/pinecone"
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters"
import { } from "@lang"
const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY
})


export async function POST(req) {

    try {
        const formdata = await req.formData();
        const file = formdata.get("file")

        if (!file) {
            return new Response("No file provided", { statuc: 400 })
        }


        const documentId = crypto.randomUUID()

        const blob = new Blob([await file.arrayBuffer()], { type: file.type })

        const loader = new PDFLoader(blob)

        const docs = await loader.load()

        const textsplitter = new RecursiveCharacterTextSplitter({
            chunkOverlap: 200,
            chunkSize: 1000
        })
        const splitDocs = await textsplitter.splitDocuments(docs)

        const docsWithMetaData = splitDocs.map((doc) => ({
            ...doc,
            metadata: {
                ...doc.metadata,
                documentId,
            }

        }))

        const googleai = new Cha
    } catch (error) {

    }
}