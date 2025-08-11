// import React, { useState, useEffect } from 'react'
// import { Card } from 'primereact/card'
// import { Chart } from 'primereact/chart'
// import { Calendar } from 'primereact/calendar'
// import { fetchPurchaseOverview, PurchaseOverviewResponse } from './PurchaseOrderOverview.function'

// type SelectedDate = Date | null

// const PurchaseOrderOverview: React.FC = () => {
//   const [selectedDate, setSelectedDate] = useState<SelectedDate>(null)
//   const [overview, setOverview] = useState<PurchaseOverviewResponse | null>(null)
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     setLoading(true)
//     fetchPurchaseOverview().then((res) => {
//       setOverview(res)
//       setLoading(false)
//     })
//   }, [])

//   if (loading || !overview) {
//     return <div></div>
//   }

//   const { data, summary } = overview

//   // Helper to compare just dates (ignoring time)
//   const isSameDate = (d1: Date, d2: Date) =>
//     d1.getFullYear() === d2.getFullYear() &&
//     d1.getMonth() === d2.getMonth() &&
//     d1.getDate() === d2.getDate()

//   // FILTER ONLY FOR SUMMARY STATS:
//   // For stats calculation, filter data only if date selected; else use full data
//   const dataForStats = selectedDate
//     ? data.filter((item) => isSameDate(new Date(item.date), selectedDate))
//     : data

//   // Stats for cards (filtered by selectedDate)
//   const statTypes = [
//     { title: 'PO Taken' as const, color: '#007bff' },
//     { title: 'PO Returned' as const, color: '#dc3545' }
//   ]
//   const stats = [
//     ...statTypes.map((type) => ({
//       title: type.title,
//       count: dataForStats
//         .filter((d) => d.type === type.title)
//         .reduce((acc, curr) => acc + curr.count, 0),
//       color: type.color
//     })),
//     { title: 'Suppliers Count', count: summary.suppliers, color: '#28a745' },
//     { title: 'Invoices Generated', count: summary.invoices, color: '#ffc107' }
//   ]

//   // Doughnut chart (always full data - no filter)
//   const doughnutData = {
//     labels: ['Taken', 'Returned'],
//     datasets: [
//       {
//         data: [
//           data.filter((d) => d.type === 'PO Taken').reduce((a, c) => a + c.count, 0),
//           data.filter((d) => d.type === 'PO Returned').reduce((a, c) => a + c.count, 0)
//         ],
//         backgroundColor: ['#6f1f5f', '#f0d6eb'],
//         hoverBackgroundColor: ['#6f1f5f', '#f0d6eb'],
//         borderWidth: 0
//       }
//     ]
//   }
//   const doughnutOpts = {
//     cutout: '70%',
//     plugins: {
//       legend: {
//         position: 'bottom',
//         labels: { color: '#495057', font: { size: 14, weight: 'bold' } }
//       }
//     },
//     responsive: true,
//     maintainAspectRatio: false
//   }

//   // Progress cards (always full data - no filter)
//   const getDateRanges = (baseDate: Date = new Date('2025-07-01')) => {
//     const ranges: { label: string; start: Date; end: Date }[] = []
//     for (let i = 0; i < 4; i++) {
//       const start = new Date(baseDate)
//       start.setDate(start.getDate() + i * 7)
//       const end = new Date(start)
//       end.setDate(end.getDate() + 6)
//       ranges.push({
//         label: `${i * 7}-${(i + 1) * 7} Days`,
//         start,
//         end
//       })
//     }
//     return ranges
//   }

//   const ranges = getDateRanges(new Date('2025-07-01'))
//   const staticCounts = [3, 0, 0, 0]

//   const rangeGroups = ranges.map((range, index) => {
//     const count = staticCounts[index] || 0
//     return {
//       ...range,
//       count,
//       percent: 0
//     }
//   })

//   const totalInRanges = rangeGroups.reduce((acc, r) => acc + r.count, 0)
//   rangeGroups.forEach((r) => {
//     r.percent = totalInRanges ? Math.round((r.count / totalInRanges) * 100) : 0
//   })

//   return (
//     <div className="p-1 space-y-2">
//       {/* Progress Cards - Always full data */}
//       <div className="flex gap-2">
//         {rangeGroups.map((item, idx) => (
//           <div className="flex-1 shadow-1 rounded-xl bg-white" key={idx}>
//             <Card title={item.label} style={{ background: '#fff' }}>
//               <div
//                 style={{
//                   background: '#e9ecef',
//                   // borderRadius: '4px',
//                   height: '8px',
//                   // marginBottom: '7px',
//                   width: '100%',
//                   overflow: 'hidden'
//                 }}
//               >
//                 <div
//                   style={{
//                     background: ['#0d6efd', '#6610f2', '#198754', '#fd7e14'][idx],
//                     width: `${item.percent}%`,
//                     height: '100%',
//                     borderRadius: '4px',
//                     transition: 'width 0.5s ease'
//                   }}
//                 />
//               </div>
//               <div className="flex justify-between gap-2 items-center">
//                 <span className="text-2xl font-semibold text-gray-800">{item.count}</span>{' '}
//                 <span className="text-2xl text-gray-500 font-semibold ">Products</span>
//               </div>
//             </Card>
//           </div>
//         ))}
//       </div>

//       <div className="card flex shadow-2 mt-2 gap-2">
//         {/* Doughnut chart - Always full data */}
//         <div className="flex-1">
//           <Card
//             title="Purchase Order"
//             style={{
//               // height: '400px',
//               backgroundColor: '#fff',
//               // padding: '20px 5px',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               position: 'relative'
//             }}
//           >
//             <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//               <Chart
//                 type="doughnut"
//                 data={doughnutData}
//                 options={doughnutOpts}
//                 style={{ width: '100%', height: '100%' }}
//               />

//               <div
//                 style={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   textAlign: 'center',
//                   color: '#6f1f5f',
//                   fontWeight: 600,
//                   pointerEvents: 'none'
//                 }}
//               >
//                 <div style={{ fontSize: 15 }}>Purchase Overview</div>
//                 <div style={{ fontSize: 20 }}>3 Taken / 0 Returned</div>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Summary - Filtered by selectedDate */}
//         <div className="flex-1 ml-2">
//           <Card
//             header={
//               <div className="flex justify-content-between align-items-center">
//                 <span className="text-xl font-semibold text-gray-800">Summary</span>
//                 <div className="gap-2">
//                   <Calendar
//                     value={selectedDate}
//                     onChange={(e) => setSelectedDate(e.value as Date | null)}
//                     selectionMode="single"
//                     showIcon
//                     placeholder="Select a date"
//                     className="p-inputtext-sm "
//                   />
//                 </div>
//               </div>
//             }
//             style={{
//               height: '400px',
//               backgroundColor: '#fff',
//               display: 'flex',
//               flexDirection: 'column',
//               position: 'relative',
//               padding: '20px'
//             }}
//           >
//             <div className="flex flex-cols-4 gap-4 mt-4">
//               {stats.map((item, idx) => (
//                 <div
//                   key={idx}
//                   className="rounded-lg p-4 shadow-md text-center flex-1"
//                   style={{ backgroundColor: '#f8f9fa', margin: 4, minWidth: 120 }}
//                 >
//                   <h3 className="text-md font-medium text-gray-600">{item.title}</h3>
//                   <p className="text-3xl font-bold mt-2" style={{ color: item.color }}>
//                     {item.count}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default PurchaseOrderOverview

import React, { useState, useEffect } from 'react'
import { Card } from 'primereact/card'

import { Chart } from 'primereact/chart'
import { Calendar } from 'primereact/calendar'
import { fetchPurchaseOverview, PurchaseOverviewResponse } from './PurchaseOrderOverview.function'
import { ChartNoAxesCombined, ChartPie, ClipboardMinus } from 'lucide-react'

type SelectedDate = Date | null

const PurchaseOrderOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<SelectedDate>(null)
  const [overview, setOverview] = useState<PurchaseOverviewResponse | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetchPurchaseOverview().then((res) => {
      setOverview(res)
      setLoading(false)
    })
  }, [])

  if (loading || !overview) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loader}></div>
        <p style={styles.loadingText}>Loading Purchase Overview...</p>
      </div>
    )
  }

  const { data, summary } = overview

  // Helper to compare just dates (ignoring time)
  const isSameDate = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()

  // FILTER ONLY FOR SUMMARY STATS:
  // For stats calculation, filter data only if date selected; else use full data
  const dataForStats = selectedDate
    ? data.filter((item) => isSameDate(new Date(item.date), selectedDate))
    : data

  // Stats for cards (filtered by selectedDate)
  const statTypes = [
    { title: 'PO Taken' as const, color: '#6f1f5f', icon: '📋' },
    { title: 'PO Returned' as const, color: '#6f1f5f', icon: '↩️' }
  ]
  const stats = [
    ...statTypes.map((type) => ({
      title: type.title,
      count: dataForStats
        .filter((d) => d.type === type.title)
        .reduce((acc, curr) => acc + curr.count, 0),
      color: type.color,
      icon: type.icon
    })),
    { title: 'Suppliers Count', count: summary.suppliers, color: '#059669', icon: '🏢' },
    { title: 'Invoices Generated', count: summary.invoices, color: '#d97706', icon: '📄' }
  ]

  // Enhanced Doughnut chart
  const doughnutData = {
    labels: ['Taken', 'Returned'],
    datasets: [
      {
        data: [
          data.filter((d) => d.type === 'PO Taken').reduce((a, c) => a + c.count, 0),
          data.filter((d) => d.type === 'PO Returned').reduce((a, c) => a + c.count, 0)
        ],
        backgroundColor: ['#6f1f5f', '#6f1f5f'],
        borderWidth: 3,
        borderColor: '#ffffff',
        hoverBorderWidth: 4
      }
    ]
  }

  const doughnutOpts = {
    cutout: '75%',
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#374151',
          font: { size: 14, weight: 600 as const },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      }
    },
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      duration: 1500
    }
  }

  // Progress cards (always full data - no filter)
  const getDateRanges = (baseDate: Date = new Date('2025-07-01')) => {
    const ranges: { label: string; start: Date; end: Date }[] = []
    for (let i = 0; i < 4; i++) {
      const start = new Date(baseDate)
      start.setDate(start.getDate() + i * 7)
      const end = new Date(start)
      end.setDate(end.getDate() + 6)
      ranges.push({
        label: `Week ${i + 1}`,
        start,
        end
      })
    }
    return ranges
  }

  const ranges = getDateRanges(new Date('2025-07-01'))
  const staticCounts = [3, 0, 0, 0]
  const progressColors = ['#4f46e5', '#7c3aed', '#059669', '#d97706']

  const rangeGroups = ranges.map((range, index) => {
    const count = staticCounts[index] || 0
    return {
      ...range,
      count,
      percent: 0,
      color: progressColors[index]
    }
  })

  const totalInRanges = rangeGroups.reduce((acc, r) => acc + r.count, 0)
  rangeGroups.forEach((r) => {
    r.percent = totalInRanges ? Math.round((r.count / totalInRanges) * 100) : 0
  })

  return (
    <div>
      {/* Enhanced Progress Cards */}
      <div style={styles.progressCardsContainer}>
        {rangeGroups.map((item, idx) => (
          <div key={idx} style={styles.progressCard}>
            <Card style={styles.progressCardContent}>
              <div style={styles.progressHeader}>
                <h3 style={styles.progressTitle}>{item.label}</h3>
                <span style={styles.progressIcon}><ChartNoAxesCombined /></span>
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
        {/* Enhanced Doughnut Chart */}
        <div style={styles.chartContainer}>
          <Card style={styles.chartCard}>
            <div>
              <h2 style={styles.chartTitle}><ChartPie className='m' style={{color:'#6f1f5f',fontSize: '24px',}}/> Purchase Orders</h2>
            </div>
            <div style={styles.chartWrapper}>
              <Chart
                type="doughnut"
                data={doughnutData}
                options={doughnutOpts}
                style={styles.chart}
              />
              <div style={styles.chartCenterContent}>
                <div style={styles.chartCenterTitle}>Overview</div>
                <div style={styles.chartCenterStats}>
                  {data.filter((d) => d.type === 'PO Taken').reduce((a, c) => a + c.count, 0)} Taken
                </div>
                <div style={styles.chartCenterStats}>
                  {data.filter((d) => d.type === 'PO Returned').reduce((a, c) => a + c.count, 0)}{' '}
                  Returned
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Enhanced Summary Section */}
        <div>
          <Card style={{ borderRadius: '20px' }}>
            <div>
              <div className="flex justify-content-center mt-0">
                <h2 className="flex-1 mt-0 p-0" style={{color:"#000"}}><ClipboardMinus style={{color:'#6f1f5f',fontSize: '24px',}}/> Summary Report</h2>
              </div>
              <div className="flex justify-content-end mb-1 mt-1">
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
                  <div style={styles.statIcon}>{item.icon}</div>{' '}
                  <div style={styles.statContent}>
                    {' '}
                    <h4 style={styles.statTitle}>{item.title}</h4>{' '}
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

  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '400px',
    gap: '16px'
  },

  loader: {
    width: '48px',
    height: '48px',
    border: '4px solid #e5e7eb',
    borderTop: '4px solid #4f46e5',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },

  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: 500
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
     gap:'2rem',
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
    marginright:'2rem',
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
