"use client"

import { Card } from "@/components/ui/card";
import { Loader, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
export default function Home() {

  const [loading,setLoading]=useState(false)
  const [upload,setUpload]=useState(null)
  const [error,setError]=useState(null)
  const onDrop = useCallback(async (accecptedFiles) => {
      try {
         setError("");
         setUpload(true)
         const formData=new FormData()
         formData.append("file",accecptedFiles[0])
         const reponse=await fetch("/api/upload",{
          method:"POST",
          body:formData
         })

         if(!responseCookiesToRequestCookies.ok)
         {
          throw new Error("Failed to upload document");
  
         }

         const data=await responseCookiesToRequestCookies.json();
         setSummary(data.summary);
         
      } catch (error) {
         setError(error.message)
      }finally{
        setUpload(false);
      }
  }, [])
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxSize: 10 * 1024 * 1024,
  })
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center items-center">
        <h1 className="text-3xl font-bold">AI Document summnarizer</h1>
        <div>

        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-3">
          <Card className={"p-6 mb-8"}>
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8  text-center cursor-pointer transition-colors ${isDragActive?"border-blue-500":"border-gray-300 dark:border-gray-700"}`} >
              <input {...getInputProps()} />
              {
                upload?(
                  <div className="flex  items-center  justify-center gap-2">
                    <Loader className="animate-spin size-4"/>

                  </div>
                ):(
                 <div className="flex items-center flex-col">
                  <Upload className="w-7 h-7"/>
                   <p>Drag and drop PDF files here  or click to select files</p>
                 </div>
                )
              }
            </div>
          </Card>
          {error  && (
            <div className="bg-red-50 text-red-500 p-4  rounded-lg  mb-4">
              {error}
            </div> 
          )}

          {summary && (
            <Card>
              <h2 className="text-xl font-semibold mb-4">Document Summary</h2>
              <p className="text-gray-700 dark:text-gray-300">{summary}</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
