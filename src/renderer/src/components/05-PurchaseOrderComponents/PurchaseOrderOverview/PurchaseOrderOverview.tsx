import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
// import { FolderKanban } from 'lucide-react'
// import { Category } from './InventoryOverview.interface'
// import { fetchCategories } from './InventoryOverview.function'
// import { Toast } from 'primereact/toast'
import { Calendar } from 'primereact/calendar'

const PurchaseOrderOverview: React.FC = () => {
  //   const toast = useRef<Toast>(null)
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])

  const stats = [
    { title: 'PO Taken', count: 48, color: '#007bff' },
    { title: 'PO Returned', count: 12, color: '#dc3545' },
    { title: 'Suppliers', count: 7, color: '#28a745' },
    { title: 'Invoices Generated', count: 15, color: '#ffc107' }
  ]

  const stockIntake = 30
  const stockReturn = 50

  const cardHeader = (
    <div className="flex justify-between items-center">
      <span className="text-xl font-semibold text-gray-800">Category</span>
      <Calendar
        value={dateRange}
        onChange={(e) => setDateRange(e.value as [Date, Date])}
        selectionMode="range"
        readOnlyInput
        inputStyle={{ display: 'none' }}
        showIcon
        className="p-inputtext-sm"
      />
    </div>
  )

  const data = {
    labels: ['Take', 'Return'],
    datasets: [
      {
        data: [stockIntake, stockReturn],
        backgroundColor: ['#6f1f5f', '#f0d6eb'], // magenta + light pink
        hoverBackgroundColor: ['#6f1f5f', '#f0d6eb'],
        borderWidth: 0
      }
    ]
  }

  const options = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#495057',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      tooltip: {
        backgroundColor: '#f4f4f4',
        titleColor: '#333',
        bodyColor: '#000',
        borderColor: '#ccc',
        borderWidth: 1,
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || ''
            const value = tooltipItem.raw || 0
            return `${label}: ${value}`
          }
        }
      }
    },
    animation: {
      animateRotate: false,
      animateScale: false
    },
    responsive: true,
    maintainAspectRatio: false
  }

  //   const load = async () => {
  //     try {
  //       const data = await fetchCategories()
  //       console.log('fetchCategories', fetchCategories)

  //       // Add static count for each category
  //       const updatedWithStaticCounts = data.map((cat, index) => ({
  //         ...cat,
  //         count: 10 + index * 2 // Example static count logic
  //       }))

  //       setCategories(updatedWithStaticCounts)
  //     } catch (err: any) {
  //       toast.current?.show({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: err.message || 'Failed to load categories',
  //         life: 3000
  //       })
  //     }
  //   }

  //   useEffect(() => {
  //     load()
  //   }, [])

  return (
    <div>
      <div className="flex gap-4">
        {[
          { range: '0-7 Days', count: 10, percent: 25, color: '#0d6efd' },
          { range: '7-14 Days', count: 10, percent: 25, color: '#6610f2' },
          { range: '15-21 Days', count: 10, percent: 25, color: '#198754' },
          { range: '22-30 Days', count: 10, percent: 25, color: '#fd7e14' }
        ].map((item, idx) => (
          <div className="flex-1 shadow-2 rounded-xl" key={idx}>
            <Card title={item.range}>
              <div
                style={{
                  background: '#e9ecef',
                  borderRadius: '4px',
                  height: '8px',
                  marginBottom: '12px',
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    background: item.color,
                    width: `${item.percent}%`,
                    height: '100%',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
              <div className="flex justify-between items-right gap-2">
                <span className="text-2xl font-semibold text-gray-800">{item.count}</span>
                <span className="text-2xl text-gray-500 ">Products</span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="card flex shadow-2">
        <div className="flex-1 gap-3 mt-3">
          <Card
            title=" Purchase Order"
            style={{
              width: '350px',
              height: '400px',
              //   borderRadius: 12,
              backgroundColor: '#fff',
              padding: '20px 14px',
              //   boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Chart
                type="doughnut"
                data={data}
                options={options}
                style={{ width: '100%', height: '100%' }}
              />
              {/* Center label */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  color: '#6f1f5f',
                  fontWeight: 600,
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: 18 }}>Purchase Overview</div>
                <div
                  style={{ fontSize: 20 }}
                >{`${stockIntake} Taked / ${stockReturn} Returned`}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 gap-3 mt-3 ml-3 shadow-2">
      <Card
        header={cardHeader}
        style={{
          width: '830px',
          height: '400px',
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          padding: '20px'
        }}
      >
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="rounded-lg p-4 shadow-md text-center"
              style={{ backgroundColor: '#f8f9fa' }}
            >
              <h3 className="text-md font-medium text-gray-600">{item.title}</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: item.color }}>
                {item.count}
              </p>
            </div>
          ))}
        </div>
      </Card>
    </div>
      </div>
    </div>
  )
}

export default PurchaseOrderOverview
