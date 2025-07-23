import React from 'react'
import { Card } from 'primereact/card'

const InventoryOverview: React.FC = () => {
  return (
    <div>
      <div className="card flex">
        <div className="flex-1 gap-3 mr-3">
          <Card title="Inventory">
            <p className="m-0">14</p>
          </Card>
        </div>
        <div className="flex-1 gap-3 mr-3">
          <Card title="Inventory">
            <p className="m-0"> 10</p>
          </Card>
        </div>
        <div className="flex-1 gap-3 mr-3">
          <Card title="Inventory">
            <p className="m-0">12</p>
          </Card>
        </div>
        <div className="flex-1 gap-3">
          <Card title="Inventory">
            <p className="m-0">13</p>
          </Card>
        </div>
      </div>

   <div className="card flex">
  <div className="flex-1 gap-3 mt-3">
    <Card
      title=""
      style={{
        width: '270px',
        height: '400px',
        padding: '16px',
        // boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        borderRadius: '12px',
        backgroundColor: '#fff',
      }}
    >
      <p style={{ margin: 0, fontSize: '20px', fontWeight: '500' }}></p>
    </Card>
  </div>
</div>

    </div>
  )
}

export default InventoryOverview
