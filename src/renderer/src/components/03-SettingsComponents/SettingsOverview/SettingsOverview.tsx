import React, { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import 'primereact/resources/themes/lara-light-cyan/theme.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import {
  BriefcaseBusiness,
  FolderCheck,
  GitBranchPlus,
  SparklesIcon,
  UserCheck,
  UserRoundCog
} from 'lucide-react'
import { SettingsOverview as SettingsOverviewType } from './SettingsOverview.interface'
import { fetchDashboardData } from './SettingsOverview.function'

const SettingsOverview: React.FC = () => {
 const [_dashboardData, setDashboardData] = useState<SettingsOverviewType | null>(null)
  const [_loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      console.log('loadData', loadData)
      try {
        const data = await fetchDashboardData()
        setDashboardData(data)
      } catch (error) {
        console.error('Failed to load dashboard data', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])
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


  return (
    <div style={{ padding: '2px', backgroundColor: '#f8fafc' }}>
      <div className="stats-grid gap-3">
        <Card className="stat-card purple-card">
          <div className="stat-content">
            <div className="stat-icon purple-icon">
              <FolderCheck size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">Category</div>
              <div className="stat-value">4565</div>
              <div className="stat-period">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </Card>

        <Card className="stat-card pink-card">
          <div className="stat-content">
            <div className="stat-icon pink-icon">
              <GitBranchPlus size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">Branches</div>
              <div className="stat-value">$ 3541</div>
              <div className="stat-period">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </Card>

        <Card className="stat-card orange-card">
          <div className="stat-content">
            <div className="stat-icon orange-icon">
              <UserRoundCog size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">Suppliers</div>
              <div className="stat-value">4565</div>
              <div className="stat-period">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </Card>

        <Card className="stat-card blue-card">
          <div className="stat-content">
            <div className="stat-icon blue-icon">
              <BriefcaseBusiness size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">Attributes</div>
              <div className="stat-value">99%</div>
              <div className="stat-period">
                {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
              </div>
            </div>
          </div>
        </Card>
      </div>
      {/* Second Row */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr 2fr',
          gap: '20px',
          marginBottom: '15px'
        }}
      >
        <Card>
          <div className="flex gap-2">
            <UserCheck className="mt-0" color="#f59e0b" />
            <h4 className="mt-0">Recent Suppliers</h4>
          </div>
        </Card>
        {/* Sales & Views Chart */}
        <Card style={{ border: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
              // marginBottom: '20px'
            }}
          >
            <h4 className="mt-0">Category & Sub Category</h4>
          </div>
          <div style={{ height: '180px' }}>
            <Chart
              type="bar"
              data={salesViewsData}
              options={salesViewsOptions}
              style={{ height: '100%', width: '100%' }}
            />
          </div>
        </Card>

        <Card>
          <div className="flex gap-2">
            <SparklesIcon className="mt-0" color="#f59e0b" />
            <h4 className="mt-0">Recent Categories</h4>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default SettingsOverview

