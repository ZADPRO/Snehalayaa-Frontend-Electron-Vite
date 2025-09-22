import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'

const InventoryBulkUpdate: React.FC = () => {
  return (
    <div>
      <div className="flex gap-3 justify-content-end">
        <Button label="Bulk Upload" />
        <Button label="Update" />
      </div>
      <DataTable
        showGridlines
        scrollable
        className="mt-3"
        paginator
        rows={5}
        rowsPerPageOptions={[10, 25, 50, 100]}
      >
        <Column header="S.No" />
        <Column header="Product Name" />
        <Column header="SKU" />
        <Column header="Product Type" />
        <Column header="Category" />
        <Column header="Sub Category" />
        <Column header="Fabric" />
        <Column header="Selling Price" />
        <Column header="Cost Price" />
        <Column header="Discount" />
      </DataTable>
    </div>
  )
}

export default InventoryBulkUpdate
