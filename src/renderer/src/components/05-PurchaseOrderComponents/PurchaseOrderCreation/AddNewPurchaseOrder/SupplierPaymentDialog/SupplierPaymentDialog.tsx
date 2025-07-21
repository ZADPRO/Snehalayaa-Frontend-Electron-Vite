import React from 'react'
import { Dialog } from 'primereact/dialog'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Calendar } from 'primereact/calendar'
import { Button } from 'primereact/button'
import { Check } from 'lucide-react'

interface SupplierPaymentDialogProps {
  visible: boolean
  creditDays: string
  creditDate: Date | null
  pendingAmountInput: string
  onHide: () => void
  onCreditDaysChange: (value: string) => void
  onCreditDateChange: (date: Date | null) => void
  onPendingAmountChange: (value: string) => void
  onSave: () => void
}

const SupplierPaymentDialog: React.FC<SupplierPaymentDialogProps> = ({
  visible,
  creditDays,
  creditDate,
  pendingAmountInput,
  onHide,
  onCreditDaysChange,
  onCreditDateChange,
  onPendingAmountChange,
  onSave
}) => {
  return (
    <Dialog
      header="Supplier Payment Details"
      visible={visible}
      style={{ width: '40vw' }}
      onHide={onHide}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
    >
      <div className="flex flex-column gap-3 mt-3">
        <FloatLabel className="always-float">
          <InputText
            id="creditDays"
            value={creditDays}
            onChange={(e) => {
              const value = e.target.value
              onCreditDaysChange(value)

              const days = parseInt(value)
              if (!isNaN(days) && days >= 0) {
                const today = new Date()
                const expectedDate = new Date(today.setDate(today.getDate() + days))
                onCreditDateChange(expectedDate)
              }
            }}
            className="w-full"
          />
          <label htmlFor="creditDays">Enter Credit Days</label>
        </FloatLabel>

        <FloatLabel className="always-float">
          <Calendar
            id="creditDate"
            value={creditDate}
            onChange={(e) => onCreditDateChange(e.value as Date)}
            dateFormat="dd-mm-yy"
            showIcon
            className="w-full"
          />
          <label htmlFor="creditDate">Credit Date</label>
        </FloatLabel>

        <FloatLabel className="always-float">
          <InputText
            id="pendingAmount"
            value={pendingAmountInput}
            onChange={(e) => onPendingAmountChange(e.target.value)}
            className="w-full"
          />
          <label htmlFor="pendingAmount">Enter Paid Amount</label>
        </FloatLabel>

        <div className="flex justify-content-between">
          <p>Pending Amount: /-</p>
          <p>Previous Due Date: -/-/-</p>
        </div>

        <Button label="Save" icon={<Check size={20} />} onClick={onSave} className="mt-2 gap-2" />
      </div>
    </Dialog>
  )
}

export default SupplierPaymentDialog
