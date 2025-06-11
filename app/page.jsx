"use client"

import { Card } from "@/components/ui/card";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
export default function Home() {

  const onDrop = useCallback(async (accecptedFiles) => {
    console.log(accecptedFiles)
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

      <div>
        <div>
          <Card>
                <div
                {...getRootProps()}>
<input type="text" {..getInputProps()} />
                </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
