import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { FolderKanban } from 'lucide-react'
import { Category } from './InventoryOverview.interface'
import { fetchCategories } from './InventoryOverview.function'
import { Toast } from 'primereact/toast'

const InventoryOverview: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const toast = useRef<Toast>(null)

  const stockIntake = 30
  const stockReturn = 50
  //   const total = stockIntake + stockReturn

  const data = {
    labels: ['Used', 'Free'],
    datasets: [
      {
        data: [stockIntake, stockReturn],
        backgroundColor: ['#6f1f5f', '#f0d6eb'], // magenta + light pink
        // hoverBackgroundColor: ['#6f0f5f', '#f3a9c9'],
        borderWidth: 0
      }
    ]
  }

  const options = {
    cutout: '75%', // donut hole size
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateScale: false,
      animateRotate: false
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    }
  }

  const load = async () => {
    try {
      const data = await fetchCategories()
      console.log('fetchCategories', fetchCategories)

      // Add static count for each category
      const updatedWithStaticCounts = data.map((cat, index) => ({
        ...cat,
        count: 10 + index * 2 // Example static count logic
      }))

      setCategories(updatedWithStaticCounts)
    } catch (err: any) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: err.message || 'Failed to load categories',
        life: 3000
      })
    }
  }

  useEffect(() => {
    load()
  }, [])
  return (
    <div>
      {/* <div className="card flex">
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
      </div> */}
      <div className="flex gap-4">
        {[
          { title: 'Inventory', count: 14, percent: 10, color: '#007bff' },
          { title: 'Inventory', count: 10, percent: 20, color: '#28a745' },
          { title: 'Inventory', count: 12, percent: 50, color: '#ffc107' },
          { title: 'Inventory', count: 13, percent: 60, color: '#dc3545' }
        ].map((item, idx) => (
          <div className="flex-1 shadow-2" key={idx}>
            <Card title={item.title}>
              <div
                style={{
                  background: '#f0f0f0',
                  borderRadius: '4px',
                  height: '6px',
                  marginBottom: '12px',
                  width: '100%',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    background: item.color,
                    width: `${item.percent}%`,
                    height: '100%'
                  }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-gray-800 text-right">{item.count}</span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* <Card title="Dropbox Storage">
        <div
          style={{
            background: '#fbe4ed',
            borderRadius: '4px',
            height: '6px',
            marginBottom: '16px',
            width: '100%',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              background: '#ef476f',
              width: `${(4.1 / 100) * 100}%`,
              height: '100%'
            }}
          />
        </div>
        <div className="flex justify-content-between align-items-center">
          <span>1</span>
        </div>
      </Card> */}

      <div className="card flex shadow-2">
        <div className="flex-1 gap-3 mt-3">
          <Card
            title=" Stocks"
            style={{
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
                  color: '#c61ba4',
                  fontWeight: 600,
                  pointerEvents: 'none'
                }}
              >
                <div style={{ fontSize: 18 }}>Stock Overview</div>
                <div
                  style={{ fontSize: 20 }}
                >{`${stockIntake} Taked / ${stockReturn} Returned`}</div>
              </div>
            </div>
          </Card>
        </div>

        <div className="flex-1 gap-3 mt-3 ml-3 shadow-2">
          <Card
            title="Category"
            style={{
              width: '830px',
              height: '400px',
              //   borderRadius: 0,
              backgroundColor: '#fff',
              //   padding: '20px 14px',
              //   boxSizing: 'border-box',
              display: 'flex',
              position: 'relative'
            }}
          >
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.refCategoryId}
                  className="px-4 shadow-2"
                  style={{
                    width: '260px',
                    height: '60px',
                    backgroundColor: '#fff',
                    borderColor: 'gray',
                    borderWidth: 2,
                    display: 'flex',
                    alignItems: 'center',
                    borderRadius: '6px'
                  }}
                >
                  <div className="flex w-full align-items-center justify-content-between">
                    <span className="text-xl flex items-center gap-2">
                      <FolderKanban />
                      {cat.categoryName}
                    </span>
                    <span className="text-xl font-semibold text-right">{cat.count ?? 0}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default InventoryOverview
