import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { Calendar } from 'primereact/calendar'
import { fetchPurchaseOverview, PurchaseOverviewResponse } from './PurchaseOrderOverview.function'
import { ChartNoAxesCombined, ClipboardMinus } from 'lucide-react'
import { Dropdown } from 'primereact/dropdown'
import './PurchaseOrderOverview.css'

type SelectedDate = Date | null

const PurchaseOrderOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(null)
  const [overview, setOverview] = useState<PurchaseOverviewResponse | null>(null)

  useEffect(() => {
    fetchPurchaseOverview().then((res) => {
      setOverview(res)
    })
  }, [])

  const currentYear = new Date().getFullYear()
  const periodOptions = Array.from({ length: 12 }, (_, i) => {
    const monthName = new Date(currentYear, i).toLocaleString('default', { month: 'long' })
    return {
      name: `${monthName} ${currentYear}`,
      code: `${monthName.toLowerCase()}-${currentYear}`
    }
  })
  const [selectedPeriod, setSelectedPeriod] = useState(periodOptions[0])

  const data = overview?.data ?? []
  const summary = overview?.summary ?? { suppliers: 0, invoices: 0 }
  console.log('summary', summary)

  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

  const dataForStats = selectedDate
    ? data.filter((item) => isSameDate(new Date(item.date), selectedDate))
    : data
  console.log('dataForStats', dataForStats)

  // Stats for cards — all counts set to 0
  const stats = [
    { title: 'PO Create', count: 0, color: '#6f1f5f', icon: '📋' },
    { title: 'PO Taken', count: 0, color: '#6f1f5f', icon: '↩️' },
    { title: 'Barcode Generated', count: 0, color: '#059669', icon: '🏢' },
    { title: 'Rejected Products', count: 0, color: '#d97706', icon: '📄' }
  ]

  // Doughnut chart — all values 0
  const doughnutData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Take',
        data: Array(7).fill(0),
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Return',
        data: Array(7).fill(0),
        fill: true,
        backgroundColor: 'rgba(236, 72, 153, 0.3)',
        borderColor: '#ec4899',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  }

  const areaOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { x: { display: false }, y: { display: false } }
  }

  // Progress cards — all counts and percentages 0
  const getDateRanges = (baseDate: Date = new Date()) => {
    const ranges: { label: string; start: Date; end: Date }[] = []
    for (let i = 0; i < 4; i++) {
      const start = new Date(baseDate)
      start.setDate(start.getDate() + i * 7)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      ranges.push({ label: `Week ${i + 1}`, start, end })
    }
    return ranges
  }

  const ranges = getDateRanges()
  const progressColors = ['#4f46e5', '#7c3aed', '#059669', '#d97706']

  const rangeGroups = ranges.map((range, index) => ({
    ...range,
    count: 0,
    percent: 0,
    color: progressColors[index]
  }))

  return (
    <div>
      {/* Enhanced Progress Cards */}
      <div style={styles.progressCardsContainer}>
        {rangeGroups.map((item, idx) => (
          <div key={idx} style={styles.progressCard}>
            <Card style={styles.progressCardContent}>
              <div style={styles.progressHeader}>
                <h3 style={styles.progressTitle}>{item.label}</h3>
                <span style={styles.progressIcon}>
                  <ChartNoAxesCombined />
                </span>
              </div>
              <div style={styles.progressBarContainer}>
                <div
                  style={{
                    ...styles.progressBarFill,
                    backgroundColor: item.color,
                    width: `${item.percent}%`
                  }}
                />
              </div>
              <div style={styles.progressFooter}>
                <span style={styles.progressCount}>{item.count}</span>
                <span style={styles.progressLabel}>Products</span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div style={styles.mainContent}>
        <Card className="chart-card product-sales-card" style={{ borderRadius: '20px' }}>
          <div className="chart-header flex justify-content-between">
            <h3>Purchase Order</h3>
            <Dropdown
              value={selectedPeriod}
              options={periodOptions}
              placeholder="Select Month"
              onChange={(e) => setSelectedPeriod(e.value)}
              optionLabel="name"
              style={{ width: '120px' }}
            />
          </div>
          <div className="chart-container">
            <Chart type="line" data={doughnutData} options={areaOptions} />
          </div>
        </Card>

        {/* Summary Section */}
        <div>
          <Card style={{ borderRadius: '20px' }}>
            <div>
              <div className="flex justify-content-center mt-0">
                <h2 className="flex-1 mt-0 p-0" style={{ color: '#000' }}>
                  <ClipboardMinus style={{ color: '#6f1f5f', fontSize: '24px' }} /> Summary Report
                </h2>
              </div>
              <div className="flex justify-content-end mb-3 mt-1">
                <Calendar
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.value as Date | null)}
                  selectionMode="single"
                  showIcon
                  placeholder="Filter by date"
                />
              </div>
            </div>

            <div style={styles.statsGrid}>
              {stats.map((item, idx) => (
                <div key={idx} style={styles.statCard}>
                  <div style={styles.statIcon}>{item.icon}</div>
                  <div style={styles.statContent}>
                    <h4 style={styles.statTitle}>{item.title}</h4>
                    <p style={{ ...styles.statCount, color: item.color }}>{item.count}</p>
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

const styles = {
  container: {
    // minHeight: '100vh',
  },

  progressCardsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '24px'
  },

  progressCard: {
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },

  progressCardContent: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid #e5e7eb',
    borderRadius: '16px',
    // padding: '10px',

    height: '140px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer'
    // transition: 'all 0.3s ease'
  },

  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
    // marginBottom: '20px'
  },

  progressTitle: {
    margin: 0,
    fontSize: '16px',
    fontWeight: 600,
    color: '#374151'
  },

  progressIcon: {
    fontSize: '20px'
  },

  progressBarContainer: {
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '16px'
  },

  progressBarFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
  },

  progressFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  progressCount: {
    fontSize: '28px',
    fontWeight: 700,
    color: '#1f2937'
  },

  progressLabel: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: 500
  },

  mainContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px'
  },

  chartContainer: {
    display: 'flex',
    flexDirection: 'column' as const
  },

  chartCard: {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    border: '1px solid #e5e7eb',
    borderRadius: '20px',
    // padding: '32px',
    gap: '2rem',
    height: '90%',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    position: 'relative' as const
  },

  chartTitle: {
    margin: 0,
    fontSize: '24px',
    color: '#1f2937',
    textAlign: 'center' as const
  },

  chartWrapper: {
    position: 'relative' as const,
    height: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  chart: {
    width: '90%',
    height: '90%'
  },

  chartCenterContent: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center' as const,
    pointerEvents: 'none' as const
  },

  chartCenterTitle: {
    fontSize: '16px',
    fontWeight: 600,
    color: '#4f46e5',
    marginBottom: '8px'
  },

  chartCenterStats: {
    fontSize: '14px',
    color: '#6b7280',
    fontWeight: 500,
    lineHeight: 1.4
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '16px'
  },

  statCard: {
    background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
    borderRadius: '16px',
    padding: '20px',
    border: '2px solid #f3f4f6',
    display: 'flex',
    alignItems: 'center',
    gap: '2rem',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  },

  statIcon: {
    fontSize: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    marginright: '2rem',
    backgroundColor: '#f3f4f6'
  },

  statContent: {
    flex: 1
  },

  statTitle: {
    margin: '0',
    fontSize: '14px',
    // fontWeight: 600,
    color: '#6b7280'
    // lineHeight: 1.2
  },

  statCount: {
    margin: 0,
    fontSize: '32px',
    fontWeight: 700,
    lineHeight: 1
  }
}

export default PurchaseOrderOverview
