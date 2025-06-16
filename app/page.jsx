"use client"

import { Card } from "@/components/ui/card";
import { ChatInterface } from "@/components/ui/ChatInterface";
import { Loader, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
export default function Home() {

  const [loading, setLoading] = useState(false)
  const [upload, setUpload] = useState(null)
  const [summary, setSummary] = useState()
  const [error, setError] = useState(null)
  const [currentDocument, setCurrentDocument] = useState()
  const [documents, setDocuments] = useState([])
  const onDrop = useCallback(async (accecptedFiles) => {
    try {
      setError("");
      setUpload(true)
      const formData = new FormData()
      formData.append("file", accecptedFiles[0])
      const reponse = await fetch("/api/upload", {
        method: "POST",
        body: formData
      })

      if (!reponse.ok) {
        throw new Error("Failed to upload document");

      }
      console.log(reponse.body)
      const data = await reponse.json();
      console.log(data)
      setSummary(data.summary.kwargs.content);
      const newDoc = {
        id: data.documentId,
        filename: accecptedFiles[0].name,
        uploadedAt: new Date(),
        pageCount: data.count,
        summary: data.summary,
        fileSize: accecptedFiles[0].size
      }
      setDocuments((prev) => [...prev, newDoc])
      setCurrentDocument(newDoc)
      // const 
    } catch (error) {
      setError(error.message)
    } finally {
      setUpload(false);
    }
  }, [])
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 10 * 1024 * 1024,
  })
  const handleMessage = async (message, documentId) => {
    try {
      setLoading(true)
      console.log(message)
      const response = await fetch("/api/question", {
        method: "POST",
        body: JSON.stringify({
          question: message,
          documentId
        })
      })
      if (!response.ok) {
        throw new Error("Failed to send question")
      }

      const data = await response.json();
      setLoading(false)
      return data.answer;
    } catch (error) {

    }
  }
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center mb-8">
        <h1 className="text-3xl font-bold">AI Document summarizer</h1>
        <div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card className={"p-6 mb-8"}>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8  text-center cursor-pointer transition-colors ${isDragActive ? "border-blue-500" : "border-gray-300 dark:border-gray-700"}`} >
              <input {...getInputProps()} />
              {
                upload ? (
                  <div className="flex  items-center  justify-center gap-2">
                    <Loader className="animate-spin size-4" />

                  </div>
                ) : (
                  <div className="flex items-center flex-col">
                    <Upload className="w-7 h-7" />
                    <p>Drag and drop PDF files here  or click to select files</p>
                  </div>
                )
              }
            </div>
          </Card>
          {error && (
            <div className="bg-red-50 text-red-500 p-4  rounded-lg  mb-4">
              {error}
            </div>
          )}

          {summary && (
            <Card className={"p-4"}>
              <h2 className="text-xl font-semibold mb-4">Document Summary</h2>
              <p className="text-gray-700 dark:text-gray-300">{summary}</p>
            </Card>
          )}

          <ChatInterface
            onSendMessage={handleMessage}
            loading={loading}
            currentDocument={currentDocument}
          />
        </div>
      </div>
    </div>
  );
}
