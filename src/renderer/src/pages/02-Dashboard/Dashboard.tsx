import React, { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import ComponentHeader from '../../components/00-Header/ComponentHeader'
import { BadgeCent, ClockArrowUp, ShoppingCart, Sparkles, User } from 'lucide-react'
import { fetchProducts } from './Dashboard.function'
import { Product } from './Dashboard.interface'

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState({ name: 'Weekly', code: 'weekly' })
  const [products, setProducts] = useState<Product[]>([])

  const periodOptions = [
    { name: 'Weekly', code: 'weekly' },
    { name: 'Monthly', code: 'monthly' },
    { name: 'Yearly', code: 'yearly' }
  ]

  // Empty chart placeholders
  const chartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Sales',
        data: [0, 0, 0, 0, 0, 0, 0],
        fill: true,
        borderColor: '#d1d5db',
        backgroundColor: 'rgba(209, 213, 219, 0.2)',
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (value) => value } }
    }
  }

  useEffect(() => {
    // Keep it empty for placeholders
    const loadData = async () => {
      const data: Product[] = []
      setProducts(data)
    }
    loadData()
  }, [])

  return (
    <div>
      <ComponentHeader
        title="Dashboard"
        subtitle={new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        })}
      />

      <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
        {/* Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          {/* Total Sales */}
          <Card style={cardStyle}>
            <div style={metricLayout}>
              <div style={iconBox('#e0e7ff')}>
                <ShoppingCart color="#6366f1" />
              </div>
              <div>
                <p style={labelStyle}>Total Sales</p>
                <h3 style={valueStyle}>—</h3>
                <p style={subTextStyle}>—</p>
              </div>
            </div>
          </Card>

          {/* Total Orders */}
          <Card style={cardStyle}>
            <div style={metricLayout}>
              <div style={iconBox('#ddd6fe')}>
                <ClockArrowUp color="#8b5cf6" />
              </div>
              <div>
                <p style={labelStyle}>Total Orders</p>
                <h3 style={valueStyle}>—</h3>
                <p style={subTextStyle}>—</p>
              </div>
            </div>
          </Card>

          {/* Total Sold Products */}
          <Card style={cardStyle}>
            <div style={metricLayout}>
              <div style={iconBox('#fecaca')}>
                <BadgeCent color="#ef4444" />
              </div>
              <div>
                <p style={labelStyle}>Total Sold Products</p>
                <h3 style={valueStyle}>—</h3>
                <p style={subTextStyle}>—</p>
              </div>
            </div>
          </Card>

          {/* New Users */}
          <Card style={cardStyle}>
            <div style={metricLayout}>
              <div style={iconBox('#bfdbfe')}>
                <User color="#3b82f6" />
              </div>
              <div>
                <p style={labelStyle}>New User</p>
                <h3 style={valueStyle}>—</h3>
                <p style={subTextStyle}>—</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart + Top Products */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
          {/* Chart Placeholder */}
          <Card style={cardStyle}>
            <div style={chartHeader}>
              <div>
                <h4 style={titleStyle}>Total Sales</h4>
                <p style={{ ...valueStyle, fontSize: '20px' }}>—</p>
              </div>
              <Dropdown
                value={selectedPeriod}
                options={periodOptions}
                onChange={(e) => setSelectedPeriod(e.value)}
                optionLabel="name"
                style={{ width: '120px' }}
              />
            </div>
            <div style={{ height: '300px' }}>
              <Chart
                type="line"
                data={chartData}
                options={chartOptions}
                style={{ height: '100%' }}
              />
            </div>
          </Card>

          {/* Top Products Placeholder */}
          <Card style={cardStyle}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
            >
              <Sparkles color="#f59e0b" />
              <h4 style={titleStyle}>Top Products</h4>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>No product data available</p>
          </Card>
        </div>
      </div>
    </div>
  )
}

// 🔹 Styles
const cardStyle = { border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
const metricLayout = { display: 'flex', alignItems: 'center', gap: '15px' }
const labelStyle = { margin: 0, color: '#64748b', fontSize: '14px' }
const valueStyle = { margin: '5px 0 0 0', color: '#1e293b', fontSize: '24px', fontWeight: 600 }
const subTextStyle = { margin: '5px 0 0 0', color: '#9ca3af', fontSize: '12px' }
const titleStyle = { margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '600' }
const chartHeader = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '20px'
}
const iconBox = (bgColor: string) => ({
  width: '48px',
  height: '48px',
  backgroundColor: bgColor,
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})

export default Dashboard
