import React, { useState, useRef } from 'react'
import JSZip from 'jszip'
import imageCompression from 'browser-image-compression'
import { FileUpload, FileUploadSelectEvent } from 'primereact/fileupload'
import { ProgressSpinner } from 'primereact/progressspinner'
import { ListBox } from 'primereact/listbox'
import { Toast } from 'primereact/toast'
// import { ToastMessage } from 'primereact/toast'

// type CompressedImage = {
//   name: string
//   file: File
// }

const PurchaseOrderImage: React.FC = () => {
  const [fileNames, _setFileNames] = useState<string[]>([])
  // const [compressedImages, setCompressedImages] = useState<CompressedImage[]>([])
  const [loading, _setLoading] = useState(false)
  const toast = useRef<Toast>(null)

  // const showToast = (message: ToastMessage) => {
  //   toast.current?.show(message)
  // }

  const compressImage = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      throw new Error('The file given is not an image')
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1024,
      useWebWorker: true
    }

    return await imageCompression(file, options)
  }


  const handleZipUpload = async (event: FileUploadSelectEvent) => {
    const file = event.files?.[0]
    console.log('file', file)

    if (!file || file.type !== 'application/x-zip-compressed') {
      console.error('Not a ZIP file')
      return
    }

    try {
      const zip = new JSZip()
      const content = await zip.loadAsync(file)
      const fileNames: string[] = []

      await Promise.all(
        Object.keys(content.files).map(async (filename) => {
          const entry = content.files[filename]

          if (!entry.dir) {
            fileNames.push(filename)

            const blob = await entry.async('blob')

            if (blob.type.startsWith('image/')) {
              const fileObj = new File([blob], filename, { type: blob.type })

              try {
                const compressed = await compressImage(fileObj)
                console.log('Compressed:', compressed)
                // You can upload or store the compressed file here
              } catch (err: any) {
                console.warn('Compression skipped:', err.message)
              }
            } else {
              console.log('Skipping non-image:', filename)
            }
          }
        })
      )

      console.log('All filenames:', fileNames)
    } catch (err) {
      console.error('ZIP extraction failed:', err)
    }
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

      {fileNames.length > 0 && (
        <div className="mt-4">
          <h5>Extracted Images</h5>
          <ListBox value={fileNames} options={fileNames.map((f) => ({ label: f, value: f }))} />
        </div>
      )}
    </div>
  )
}

export default PurchaseOrderImage
