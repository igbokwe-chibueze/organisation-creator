// src/image-upload.tsx
"use client"

import { useState, useRef, type DragEvent, type ChangeEvent } from "react"
import { Upload, X, ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Component() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemove = () => {
    setSelectedFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-md mx-auto p-6">
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer ${
          isDragOver
            ? "border-primary bg-primary/5"
            : selectedFile
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-gray-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {selectedFile && previewUrl ? (
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                width={300}
                height={200}
                className="w-full h-48 object-cover rounded-lg"
              />
              <Button
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove()
                }}
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove image</span>
              </Button>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <div className="mx-auto w-12 h-12 text-gray-400">
              {isDragOver ? <Upload className="w-full h-full" /> : <ImageIcon className="w-full h-full" />}
            </div>
            <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragOver ? "Drop your image here" : "Upload an image"}
              </p>
              <p className="text-sm text-gray-500">Drag and drop or click to select</p>
            </div>
            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
          </div>
        )}
      </div>

      {selectedFile && (
        <div className="mt-4 flex justify-center">
          <Button onClick={handleRemove} variant="outline" className="w-full">
            <X className="w-4 h-4 mr-2" />
            Remove Image
          </Button>
        </div>
      )}
    </div>
  )
}
