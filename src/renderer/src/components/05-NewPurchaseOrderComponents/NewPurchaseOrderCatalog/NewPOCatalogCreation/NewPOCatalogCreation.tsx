import React, { useRef } from 'react'
import { Toast } from 'primereact/toast'
import { Props } from './NewPOCatalogCreation.interface'
import { TabPanel, TabView } from 'primereact/tabview'
import StepOne from './StepOne/StepOne'
import StepThree from './StepThree/StepThree'
import StepTwo from './StepTwo/StepTwo'

const NewPOCatalogCreation: React.FC<Props> = ({ purchaseOrder }) => {
  console.log('purchaseOrder', purchaseOrder)
  const toast = useRef<Toast>(null)

  return (
    <div>
      <Toast ref={toast} />
      <h3 className="m-0">PO: {purchaseOrder.purchaseOrderNumber}</h3>
      <div className="flex align-items-center gap-5">
        <h4 className="m-0">
          Total Ordered Quantity: {purchaseOrder.accepted_products[0].ordered_quantity}
        </h4>
        <h1 className="m-0">Total Amount : {purchaseOrder.accepted_products[0].ordered_total}</h1>
      </div>

      <TabView>
        <TabPanel header="GRN Count">
          <StepOne purchaseOrder={purchaseOrder} />
        </TabPanel>
        <TabPanel header="GRN Initialization">
          <StepTwo purchaseOrder={purchaseOrder} />
        </TabPanel>
        <TabPanel header="GRN Products">
          <StepThree />
        </TabPanel>
      </TabView>
    </div>
  )
}

export default NewPOCatalogCreation
