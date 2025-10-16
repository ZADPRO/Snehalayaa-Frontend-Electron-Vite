import React, { useEffect, useRef, useState } from 'react'
import { Toast } from 'primereact/toast'

const PurchaseOrderImage: React.FC = () => {
  const toast = useRef<Toast>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [barcode, setBarcode] = useState('')

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const scannedValue = e.currentTarget.value
      console.log('Scanned Barcode:', scannedValue)
      toast.current?.show({ severity: 'info', summary: 'Barcode Scanned', detail: scannedValue })
      setBarcode(scannedValue)
      e.currentTarget.value = ''
    }
  }

  return (
    <div>
      <Toast ref={toast} />

      <input
        ref={inputRef}
        type="text"
        onKeyDown={handleInput}
        style={{ position: 'absolute', opacity: 0, height: 0, width: 0 }}
        autoFocus
      />

      {barcode && (
        <div>
          <strong>Last Scanned Barcode:</strong> {barcode}
        </div>
      )}
    </div>
  )
}

export default PurchaseOrderImage
