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

  // Chart data
  const chartData = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        label: 'Sales',
        data: [2000, 8000, 6000, 7000, 12000, 9000, 11000],
        fill: true,
        borderColor: '#6366f1',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.4
      }
    ]
  }

  const chartOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          callback: function (value) {
            return value / 1000 + 'k'
          }
        }
      }
    }
  }

  const topProducts = [
    { id: '01', name: 'Karthikeyan Soft Silk Sarees', quantity: 50 },
    { id: '02', name: 'Tussar Silk Sarees', quantity: 32 },
    { id: '03', name: 'Designer Sarees', quantity: 28 },
    { id: '04', name: 'Silk Cotton Sarees', quantity: 18 },
    { id: '05', name: 'Pure Silk Dhotis', quantity: '06' }
  ]

  const getQuantityBadge = (quantity) => {
    if (quantity >= 40) return 'success'
    if (quantity >= 25) return 'info'
    if (quantity >= 15) return 'warning'
    return 'danger'
  }

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchProducts()
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#e0e7ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i style={{ color: '#6366f1', fontSize: '20px' }} />
                <ShoppingCart />
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Total Sales</p>
                <h3
                  style={{
                    margin: '5px 0 0 0',
                    color: '#1e293b',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}
                >
                  ₹26,12,000
                </h3>
                <p style={{ margin: '5px 0 0 0', color: '#10b981', fontSize: '12px' }}>
                  <i className="pi pi-arrow-up" style={{ fontSize: '10px' }} />
                  2.86% from last month
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#ddd6fe',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i style={{ color: '#8b5cf6', fontSize: '20px' }} /> <ClockArrowUp />
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Total Orders</p>
                <h3
                  style={{
                    margin: '5px 0 0 0',
                    color: '#1e293b',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}
                >
                  1,000
                </h3>
                <p style={{ margin: '5px 0 0 0', color: '#ef4444', fontSize: '12px' }}>
                  <i className="pi pi-arrow-down" style={{ fontSize: '10px' }} />
                  1.03% from last month
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#fecaca',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i style={{ color: '#ef4444', fontSize: '20px' }} /> <BadgeCent />
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>Total Sold Products</p>
                <h3
                  style={{
                    margin: '5px 0 0 0',
                    color: '#1e293b',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}
                >
                  800
                </h3>
                <p style={{ margin: '5px 0 0 0', color: '#10b981', fontSize: '12px' }}>
                  <i className="pi pi-arrow-up" style={{ fontSize: '10px' }} /> 3.10% from last
                  month
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  backgroundColor: '#bfdbfe',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <i style={{ color: '#3b82f6', fontSize: '20px' }} /> <User />
              </div>
              <div>
                <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>New User</p>
                <h3
                  style={{
                    margin: '5px 0 0 0',
                    color: '#1e293b',
                    fontSize: '24px',
                    fontWeight: '600'
                  }}
                >
                  10
                </h3>
                <p style={{ margin: '5px 0 0 0', color: '#10b981', fontSize: '12px' }}>
                  <i className="pi pi-arrow-up" style={{ fontSize: '10px' }} /> 1.84% from last
                  month
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart and Top Products */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '20px',
            marginBottom: '30px'
          }}
        >
          <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px'
              }}
            >
              <div>
                <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                  Total Sales
                </h4>
                <p
                  style={{
                    margin: '5px 0 0 0',
                    color: '#1e293b',
                    fontSize: '20px',
                    fontWeight: '600'
                  }}
                >
                  ₹1,28,000
                </p>
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

          {/* <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
            >
              <i style={{ color: '#f59e0b', fontSize: '16px' }} /> <Sparkles />
              <h4 style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '600' }}>
                Top Products
              </h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {topProducts.map((product) => (
                <div
                  key={product.id}
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                      {product.id}.
                    </span>
                    <span style={{ color: '#1e293b', fontSize: '14px' }}>{product.name}</span>
                  </div>
                  <Badge
                    value={product.quantity}
                    severity={getQuantityBadge(product.quantity)}
                    // style={{ minWidth: '35px' }}
                  />
                </div>
              ))}
            </div>
          </Card> */}
          <Card>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
            >
              <Sparkles color="#f59e0b" />
              <h4 style={titleStyle}>Top Products</h4>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {products
                .sort((a, b) => parseInt(b.poQuantity) - parseInt(a.poQuantity))
                .slice(0, 5)
                .map((product, index) => (
                  <div
                    key={product.poId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#64748b', fontSize: '14px', fontWeight: '500' }}>
                        {index + 1}.
                      </span>
                      <span style={{ color: '#1e293b', fontSize: '14px' }}>{product.poName}</span>
                    </div>
                    <Badge
                      value={product.poQuantity}
                      severity={getQuantityBadge(product.poQuantity)}
                    />
                  </div>
                ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

const titleStyle = { margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '600' }

export default Dashboard
