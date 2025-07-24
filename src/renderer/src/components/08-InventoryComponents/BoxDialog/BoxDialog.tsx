import React, { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { FloatLabel } from 'primereact/floatlabel'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'
import { Check } from 'lucide-react'
import { BoxDialogProps } from '../InventoryStockTake/InventoryStockTake.interface'

const BoxDialog: React.FC<BoxDialogProps> = ({ visible, onHide, onSave }) => {
  const [boxCount, setBoxCount] = useState('')
  const [productCounts, setProductCounts] = useState<string[]>([])

  const clearState = () => {
    setBoxCount('')
    setProductCounts([])
  }
  const handleBoxCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!/^\d*$/.test(value)) return

    setBoxCount(value)

    const count = Number(value)
    if (count > 0) {
      setProductCounts((prev) => {
        const newArr = [...prev]
        if (newArr.length < count) {
          return [...newArr, ...Array(count - newArr.length).fill('')]
        } else {
          return newArr.slice(0, count)
        }
      })
    } else {
      setProductCounts([])
    }
  }

  const handleProductCountChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (!/^\d*$/.test(value)) return

    setProductCounts((prev) => {
      const newArr = [...prev]
      newArr[index] = value
      return newArr
    })
  }

  const handleSave = () => {
    onSave({ boxCount: Number(boxCount), productCounts })
    // clearState()
  }

  const handleHide = () => {
    clearState()
    onHide()
  }
  return (
    <Dialog
      header="Box Count Details"
      visible={visible}
      style={{ width: '40vw' }}
      onHide={handleHide}
      breakpoints={{ '960px': '75vw', '641px': '90vw' }}
    >
      <div className="flex flex-column gap-3 mt-3 justify-center">
        <FloatLabel className="always-float">
          <InputText
            id="boxCount"
            value={boxCount}
            onChange={handleBoxCountChange}
            className="w-full"
            placeholder="Enter box count"
          />
          <label htmlFor="boxCount">Enter box count</label>
        </FloatLabel>

        {productCounts.map((count, index) => (
          <FloatLabel key={index} className="always-float">
            <InputText
              id={`productCount-${index}`}
              value={count}
              onChange={(e) => handleProductCountChange(index, e)}
              className="w-full"
              placeholder={`Enter product count for box ${index + 1}`}
            />
            <label htmlFor={`productCount-${index}`}>Product count {index + 1}</label>
          </FloatLabel>
        ))}

      </div>
    <div className="flex justify-center">
  <Button
    label="Save"
    icon={<Check size={20} />}
    onClick={handleSave}
    className="gap-2 mt-3"
  />
</div>

    </Dialog>
  )
}

export default BoxDialog
