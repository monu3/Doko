"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus,Camera } from "lucide-react"
import { toast } from "sonner"

export function UploadDialog() {
  const [open, setOpen] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    const droppedFiles = Array.from(e.dataTransfer.files)
    setFiles(droppedFiles)
  }, [])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      setFiles(selectedFiles)
    }
  }, [])

  const handleUpload = async () => {
    try {
      // Add your file upload logic here
      console.log("Uploading files:", files)

      toast.success("Files uploaded successfully")
      setOpen(false)
      setFiles([])
    } catch (error) {
      toast.error("Failed to upload files")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add new media
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Upload your media</DialogTitle>
        </DialogHeader>
        <div
          className={`
            mt-4 relative border-2 border-dashed rounded-lg p-8
            flex flex-col items-center justify-center gap-4
            ${dragActive ? "border-primary bg-primary/10" : "border-border"}
            ${files.length > 0 ? "bg-muted/50" : ""}
          `}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {files.length > 0 ? (
            <div className="w-full space-y-4">
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="flex-1 truncate">{file.name}</div>
                  <div className="text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <input id="dropzone-file" type="file" className="hidden" multiple onChange={handleChange} />
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full cursor-pointer"
              >
                <Camera className="w-10 h-10 text-muted-foreground" />
                <div>Add file</div>
                {/* <Button variant="outline" size="lg">
                  Add files
                </Button> */}
                <p className="mt-2 text-sm text-muted-foreground">or drag files to upload</p>
              </label>
            </>
          )}
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleUpload}
            disabled={files.length === 0}
            className="bg-[#B7C6E7] hover:bg-[#A4B4D6] text-white"
          >
            Upload
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

