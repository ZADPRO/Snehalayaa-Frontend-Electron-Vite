// import React from 'react';

// const SettingsOverview: React.FC = () => {
//     return (
//         <div>

//         </div>
//     );
// };

// export default SettingsOverview;

import React, { useState } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { ProgressBar } from 'primereact/progressbar'
import { Badge } from 'primereact/badge'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

const SettingsOverview: React.FC = () => {
  // Area chart data for Average Weekly Sales
 

  // Bar chart data for Sales & Views
  const salesViewsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    datasets: [
      {
        label: 'Sales',
        data: [40, 25, 80, 60, 45, 35, 55, 25, 65],
        backgroundColor: '#3b82f6',
        borderRadius: 4
      },
      {
        label: 'Views',
        data: [35, 20, 70, 55, 40, 30, 75, 20, 60],
        backgroundColor: '#8b5cf6',
        borderRadius: 4
      }
    ]
  }

  const salesViewsOptions = {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      }
    },
    scales: {
      x: {
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  }

  // Doughnut chart for Active Users
  const activeUsersData = {
    datasets: [
      {
        data: [78, 22],
        backgroundColor: ['#3b82f6', '#e5e7eb'],
        borderWidth: 0,
        cutout: '80%'
      }
    ]
  }

  const activeUsersOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: { display: false }
    }
  }

  // Circular progress charts
  const monthlyProgressData = {
    datasets: [
      {
        data: [65, 35],
        backgroundColor: ['#3b82f6', '#e5e7eb'],
        borderWidth: 0,
        cutout: '85%'
      }
    ]
  }

  const yearlyProgressData = {
    datasets: [
      {
        data: [75, 25],
        backgroundColor: ['#8b5cf6', '#e5e7eb'],
        borderWidth: 0,
        cutout: '85%'
      }
    ]
  }

  const progressOptions = {
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: { display: false }
    }
  }

  const projects = [
    { name: 'E-commerce Website', progress: 85, color: '#10b981' },
    { name: 'Mobile App Development', progress: 60, color: '#3b82f6' },
    { name: 'Marketing Campaign', progress: 40, color: '#f59e0b' },
    { name: 'SEO Optimization', progress: 75, color: '#8b5cf6' }
  ]

  const campaigns = [
    { name: 'Summer Sale', status: 'Active', budget: '$5,000', spent: '$3,200' },
    { name: 'Holiday Promotion', status: 'Paused', budget: '$8,000', spent: '$4,500' },
    { name: 'New Product Launch', status: 'Active', budget: '$12,000', spent: '$8,900' }
  ]

  const transactions = [
    { id: '#TXN001', amount: '$1,250', type: 'Sale', date: '2 min ago' },
    { id: '#TXN002', amount: '$890', type: 'Refund', date: '5 min ago' },
    { id: '#TXN003', amount: '$2,100', type: 'Sale', date: '12 min ago' },
    { id: '#TXN004', amount: '$450', type: 'Sale', date: '1 hour ago' },
    { id: '#TXN005', amount: '$750', type: 'Sale', date: '2 hours ago' }
  ]

  return (
    <div style={{ padding: '10px', backgroundColor: '#f8fafc' }}>
      {/* Top Row - Main Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px',
          marginBottom: '20px'
        }}
      >
        {/* Orders */}
        <Card
          style={{
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '20px',
            textAlign: 'center',
            backgroundColor:'beige'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}
          >
            <i className="pi pi-shopping-cart" style={{ color: '#3b82f6', fontSize: '20px' }} />
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            85,246
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Orders</p>
        </Card>

        {/* Income */}
        <Card
          style={{
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#d1fae5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}
          >
            <i className="pi pi-dollar" style={{ color: '#10b981', fontSize: '20px' }} />
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            $96,147
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Income</p>
        </Card>

        {/* Notifications */}
        <Card
          style={{
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}
          >
            <i className="pi pi-bell" style={{ color: '#f59e0b', fontSize: '20px' }} />
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>846</h3>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Notifications</p>
        </Card>

        {/* Payment */}
        <Card
          style={{
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#e0f2fe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 15px'
            }}
          >
            <i className="pi pi-credit-card" style={{ color: '#0ea5e9', fontSize: '20px' }} />
          </div>
          <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
            $84,472
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#64748b', fontSize: '14px' }}>Payment</p>
        </Card>
      </div>

      {/* Second Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 2fr',
          gap: '20px',
          marginBottom: '20px'

        }}
      >
        {/* Total Users */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h4
            style={{ margin: '0 0 15px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}
          >
            97.4K
          </h4>
          <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px' }}>Total Users</p>
          <div style={{ height: '60px', marginBottom: '15px' }}>
            <div style={{ display: 'flex', gap: '2px', height: '100%', alignItems: 'end' }}>
              {[30, 45, 25, 60, 80, 40, 70, 35, 55, 90, 20, 65].map((height, i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: `${height}%`,
                    backgroundColor: '#ef4444',
                    borderRadius: '2px'
                  }}
                />
              ))}
            </div>
          </div>
          <p style={{ margin: 0, color: '#10b981', fontSize: '12px' }}>12.5% from last month</p>
        </Card>

        {/* Active Users */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <h4
            style={{ margin: '0 0 5px 0', fontSize: '16px', fontWeight: '600', color: '#1e293b' }}
          >
            42.5K
          </h4>
          <p style={{ margin: '0 0 15px 0', color: '#64748b', fontSize: '14px' }}>Active Users</p>
          <div
            style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 15px' }}
          >
            <Chart
              type="doughnut"
              data={activeUsersData}
              options={activeUsersOptions}
              style={{ height: '100%' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e293b'
              }}
            >
              78%
            </div>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '12px', textAlign: 'center' }}>
            24K users increased from last month
          </p>
        </Card>

        {/* Sales & Views Chart */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              Sales & Views
            </h4>
            <i className="pi pi-ellipsis-h" style={{ color: '#64748b', cursor: 'pointer' }} />
          </div>
          <div style={{ height: '200px' }}>
            <Chart
              type="bar"
              data={salesViewsData}
              options={salesViewsOptions}
              style={{ height: '100%' }}
            />
          </div>
        </Card>
      </div>

      {/* Third Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '20px',
          marginBottom: '20px'
        }}
      >
        {/* Sales This Year */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <div style={{ marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#1e293b' }}>
              $65,129
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
              <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600' }}>↗ 8.6%</span>
            </div>
            <p style={{ margin: '5px 0 15px 0', color: '#64748b', fontSize: '14px' }}>
              Sales This Year
            </p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>285 left to Goal</span>
              <span style={{ fontSize: '12px', color: '#64748b' }}>78%</span>
            </div>
            <ProgressBar value={78} style={{ height: '6px' }} />
          </div>
        </Card>

        {/* Monthly */}
        <Card
          style={{
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <h4
            style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600', color: '#64748b' }}
          >
            Monthly
          </h4>
          <div
            style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 15px' }}
          >
            <Chart
              type="doughnut"
              data={monthlyProgressData}
              options={progressOptions}
              style={{ height: '100%' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e293b'
              }}
            >
              65,127
            </div>
          </div>
          <p style={{ margin: 0, color: '#10b981', fontSize: '12px' }}>16.5% $5.21 USD</p>
        </Card>

        {/* Yearly */}
        <Card
          style={{
            border: 'none',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            padding: '20px',
            textAlign: 'center'
          }}
        >
          <h4
            style={{ margin: '0 0 15px 0', fontSize: '14px', fontWeight: '600', color: '#64748b' }}
          >
            Yearly
          </h4>
          <div
            style={{ position: 'relative', width: '80px', height: '80px', margin: '0 auto 15px' }}
          >
            <Chart
              type="doughnut"
              data={yearlyProgressData}
              options={progressOptions}
              style={{ height: '100%' }}
            />
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '18px',
                fontWeight: '700',
                color: '#1e293b'
              }}
            >
              984,246
            </div>
          </div>
          <p style={{ margin: 0, color: '#8b5cf6', fontSize: '12px' }}>24.9% 267.35 USD</p>
        </Card>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
        {/* Ongoing Projects */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              Ongoing Projects
            </h4>
            <i className="pi pi-ellipsis-h" style={{ color: '#64748b', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {projects.map((project, index) => (
              <div key={index}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}
                >
                  <span style={{ fontSize: '14px', color: '#1e293b' }}>{project.name}</span>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>{project.progress}%</span>
                </div>
                <ProgressBar value={project.progress} style={{ height: '4px' }} />
              </div>
            ))}
          </div>
        </Card>

        {/* Campaign */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              Campaign
            </h4>
            <i className="pi pi-ellipsis-h" style={{ color: '#64748b', cursor: 'pointer' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {campaigns.map((campaign, index) => (
              <div
                key={index}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <p
                    style={{
                      margin: '0 0 2px 0',
                      fontSize: '14px',
                      color: '#1e293b',
                      fontWeight: '500'
                    }}
                  >
                    {campaign.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    {campaign.budget} budget
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <Badge
                    value={campaign.status}
                    severity={campaign.status === 'Active' ? 'success' : 'warning'}
                    style={{ marginBottom: '2px' }}
                  />
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    {campaign.spent} spent
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Transactions */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', padding: '20px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}
          >
            <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
              Recent Transactions
            </h4>
            <Badge value="1,899" severity="info" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {transactions.map((transaction, index) => (
              <div
                key={index}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <div>
                  <p
                    style={{
                      margin: '0 0 2px 0',
                      fontSize: '14px',
                      color: '#1e293b',
                      fontWeight: '500'
                    }}
                  >
                    {transaction.id}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    {transaction.date}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p
                    style={{
                      margin: '0 0 2px 0',
                      fontSize: '14px',
                      color: transaction.type === 'Sale' ? '#10b981' : '#ef4444',
                      fontWeight: '600'
                    }}
                  >
                    {transaction.amount}
                  </p>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                    {transaction.type}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SettingsOverview
