import React, { useState, useRef } from 'react'
import JSZip from 'jszip'
import imageCompression from 'browser-image-compression'
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import { Card } from 'primereact/card'
import { Button } from 'primereact/button'
import { Check } from 'lucide-react'

type ExtractedImage = {
  name: string
  url: string
  file: File
  selected: boolean
}

const PurchaseOrderImage: React.FC = () => {
  const [images, setImages] = useState<ExtractedImage[]>([])
  const [loading, setLoading] = useState(false)
  const toast = useRef<Toast>(null)

  // Determine MIME type based on file extension
  const getMimeType = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'png':
        return 'image/png'
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg'
      case 'gif':
        return 'image/gif'
      default:
        return 'application/octet-stream'
    }
  }

  const compressImage = async (file: File) => {
    if (!file.type.startsWith('image/')) return file
    const options = { maxSizeMB: 1, maxWidthOrHeight: 1024, useWebWorker: true }
    return await imageCompression(file, options)
  }

  const handleZipUpload = async (event: FileUploadSelectEvent) => {
    const file = event.files?.[0]
    if (!file || !file.name.endsWith('.zip')) {
      toast.current?.show({
        severity: 'error',
        summary: 'Invalid File',
        detail: 'Please upload a ZIP file'
      })
      return
    }

    setLoading(true)

    try {
      const zip = new JSZip()
      const content = await zip.loadAsync(file)
      const extractedImages: ExtractedImage[] = []

      await Promise.all(
        Object.values(content.files).map(async (entry) => {
          if (!entry.dir) {
            const nameOnly = entry.name.split('/').pop() || entry.name
            const blob = await entry.async('blob')
            const mimeType = getMimeType(nameOnly)
            const fileObj = new File([blob], nameOnly, { type: mimeType })

            if (fileObj.type.startsWith('image/')) {
              const compressed = await compressImage(fileObj)
              const url = URL.createObjectURL(compressed)
              extractedImages.push({ name: nameOnly, url, file: compressed, selected: false })
            }
          }
        })
      )

      setImages(extractedImages)

      if (extractedImages.length === 0) {
        toast.current?.show({
          severity: 'warn',
          summary: 'No Images',
          detail: 'No images found in ZIP'
        })
      } else {
        toast.current?.show({
          severity: 'success',
          summary: 'ZIP Extracted',
          detail: 'Images loaded successfully'
        })
      }
    } catch (err) {
      console.error('ZIP extraction failed:', err)
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to extract ZIP' })
    } finally {
      setLoading(false)
    }
  }

  const toggleSelect = (index: number) => {
    setImages((prev) =>
      prev.map((img, idx) => (idx === index ? { ...img, selected: !img.selected } : img))
    )
  }

  const handleSubmit = () => {
    const selectedImages = images.filter((img) => img.selected)
    toast.current?.show({
      severity: 'info',
      summary: 'Selected Images',
      detail: `${selectedImages.length} images selected`
    })

    // You can now send `selectedImages` to your backend or do any processing
    console.log('Selected Images:', selectedImages)
  }

  return (
    <div className="m-4">
      <Toast ref={toast} />
      <FileUpload
        mode="basic"
        name="zip"
        accept=".zip"
        customUpload
        chooseLabel="Upload ZIP"
        uploadHandler={() => {}}
        auto
        onSelect={handleZipUpload}
      />

      {loading && (
        <div className="flex justify-content-center my-4">
          <ProgressSpinner />
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {images.map((img, idx) => (
              <Card
                key={idx}
                className={`p-2 cursor-pointer ${img.selected ? 'border-4 border-blue-500' : 'border border-gray-300'}`}
                onClick={() => toggleSelect(idx)}
                style={{ width: '180px', height: '200px' }} // fixed size
              >
                <img
                  src={img.url}
                  alt={img.name}
                  className="w-full h-32 object-cover rounded-md"
                  style={{ height: '110px', objectFit: 'cover' }} // image fixed height
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="truncate text-xs">{img.name}</span>
                  {/* <Checkbox checked={img.selected} onChange={() => toggleSelect(idx)} /> */}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end mt-4">
            <Button label="Submit" icon={<Check />} onClick={handleSubmit} />
          </div>
        </div>
      )}
    </div>
  )
}

export default PurchaseOrderImage
