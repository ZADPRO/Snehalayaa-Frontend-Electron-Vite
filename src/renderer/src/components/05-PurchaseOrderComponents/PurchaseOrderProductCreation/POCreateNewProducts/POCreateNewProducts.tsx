import { Messages } from 'primereact/messages'
import { Toast } from 'primereact/toast'
import { useMountEffect } from 'primereact/hooks'
import React, { useRef } from 'react'
import { Info } from 'lucide-react'

const POCreateNewProducts: React.FC = () => {
  const toast = useRef<Toast>(null)

  const msgs = useRef<Messages>(null)

  useMountEffect(() => {
    msgs.current?.clear()
    msgs.current?.show({
      id: '1',
      sticky: true,
      severity: 'info',
      icon: <Info />,
      detail: 'The SKU will be auto generated in backend',
      closable: false
    })
  })

  return (
    <div className="">
      <Toast ref={toast} />
      <Messages ref={msgs} />
    </div>
  )
}

export default POCreateNewProducts
