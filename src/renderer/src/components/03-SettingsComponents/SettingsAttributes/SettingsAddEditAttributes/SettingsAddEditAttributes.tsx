import React, { useEffect, useRef, useState } from 'react'
import { SettingsAddEditAttributesProps } from './SettingsAddEditAttributes.interface'
import { Toast } from 'primereact/toast'

const SettingsAddEditAttributes: React.FC<SettingsAddEditAttributesProps> = ({
  selectedAttribute,
  onClose,
  reloadData
}) => {
  const toast = useRef<Toast>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitForm = async () => {
    try {
      onClose()
      reloadData()
    } catch (err: any) {
      console.log('err', err)
    }
  }

  useEffect(() => {
    if (selectedAttribute) {
      // handleSubmitForm()
    }
  }, [])

  return (
    <div>
      <Toast ref={toast} />

      <p>Form Data</p>
    </div>
  )
}

export default SettingsAddEditAttributes
