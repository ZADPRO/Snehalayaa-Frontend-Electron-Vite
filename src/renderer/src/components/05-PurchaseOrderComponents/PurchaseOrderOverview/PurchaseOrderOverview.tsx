// import React, { useState, useEffect } from 'react'
// import { Card } from 'primereact/card'
// import { Chart } from 'primereact/chart'
// import { Calendar } from 'primereact/calendar'
// import {
//   fetchPurchaseOverview,
//   PurchaseOverviewResponse,
//   PurchaseOverviewItem,
//   PurchaseOverviewSummary
// } from './PurchaseOrderOverview.function'

// type DateRange = [Date | null, Date | null]

// type RangeGroup = {
//   label: string
//   start: Date
//   end: Date
//   count: number
//   percent?: number
// }

// const getDateRanges = (baseDate: Date = new Date('2025-07-01')) => {
//   const ranges: { label: string; start: Date; end: Date }[] = []
//   for (let i = 0; i < 4; i++) {
//     const start = new Date(baseDate)
//     start.setDate(start.getDate() + i * 7)
//     const end = new Date(start)
//     end.setDate(end.getDate() + 6)
//     ranges.push({
//       label: `${i * 7}-${(i + 1) * 7} Days`,
//       start,
//       end
//     })
//   }
//   return ranges
// }

// const PurchaseOrderOverview: React.FC = () => {
//   const [dateRange, setDateRange] = useState<DateRange>([null, null])
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

//   // Filter by date range
//   let filteredData = data
//   if (dateRange[0] && dateRange[1]) {
//     const [start, end] = dateRange
//     filteredData = data.filter((item) => {
//       const d = new Date(item.date)
//       return (!start || d >= start) && (!end || d <= end)
//     })
//   }

//   // Stats for cards
//   const statTypes = [
//     { title: 'PO Taken' as const, color: '#007bff' },
//     { title: 'PO Returned' as const, color: '#dc3545' }
//   ]
//   const stats = [
//     ...statTypes.map((type) => ({
//       title: type.title,
//       count: filteredData
//         .filter((d) => d.type === type.title)
//         .reduce((acc, curr) => acc + curr.count, 0),
//       color: type.color
//     })),
//     { title: 'Suppliers Count', count: summary.suppliers, color: '#28a745' },
//     { title: 'Invoices Generated', count: summary.invoices, color: '#ffc107' }
//   ]
//   const stockIntake = stats[0].count
//   const stockReturn = stats[1].count

//   // Doughnut chart
//   const doughnutData = {
//     labels: ['Taken', 'Returned'],
//     datasets: [
//       {
//         data: [stockIntake, stockReturn],
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

//   // Range groups for four progress cards
//   const ranges = getDateRanges(new Date('2025-07-01'))
//   const rangeGroups: RangeGroup[] = ranges.map((range) => {
//     const items = filteredData.filter(({ date }) => {
//       const d = new Date(date)
//       return d >= range.start && d <= range.end
//     })
//     return {
//       ...range,
//       count: items.reduce((acc, curr) => acc + curr.count, 0)
//     }
//   })
//   const totalInRanges = rangeGroups.reduce((a, b) => a + b.count, 0)
//   rangeGroups.forEach(
//     (r) => (r.percent = totalInRanges ? Math.round((r.count / totalInRanges) * 100) : 0)
//   )

//   return (
//     <div>
//       <div className="flex gap-4">
//         {rangeGroups.map((item, idx) => (
//           <div className="flex-1 shadow-2 rounded-xl bg-white" key={idx}>
//             <Card title={item.label} style={{ borderRadius: '12px', background: '#fff' }}>
//               <div
//                 style={{
//                   background: '#e9ecef',
//                   borderRadius: '4px',
//                   height: '8px',
//                   marginBottom: '12px',
//                   width: '100%',
//                   overflow: 'hidden'
//                 }}
//               >
//                 <div
//                   style={{
//                     background: ['#0d6efd', '#6610f2', '#198754', '#fd7e14'][idx],
//                     width: `${item.percent}%`,
//                     height: '100%',
//                     transition: 'width 0.5s ease'
//                   }}
//                 />
//               </div>
//               <div className="flex justify-between gap-2 items-center">
//                 <span className="text-2xl font-semibold text-gray-800">{item.count}</span>
//                 <span className="text-md text-gray-500">Products</span>
//               </div>
//             </Card>
//           </div>
//         ))}
//       </div>

//       <div className="card flex shadow-2 mt-4 gap-2">
//         <div className="flex-1">
//           <Card
//             title="Purchase Order"
//             style={{
//               height: '400px',
//               backgroundColor: '#fff',
//               padding: '20px 14px',
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
//                 <div style={{ fontSize: 18 }}>Purchase Overview</div>
//                 <div
//                   style={{ fontSize: 20 }}
//                 >{`${stockIntake} Taken / ${stockReturn} Returned`}</div>
//               </div>
//             </div>
//           </Card>
//         </div>
//         <div className="flex-1 ml-3">
//           <Card
//             header={
//               <div className="flex justify-content-between align-items-center w-full">
//                 <span className="text-xl font-semibold text-gray-800">Summary</span>
//                 <Calendar
//                   value={dateRange}
//                   onChange={(e) => setDateRange(e.value as DateRange)}
//                   selectionMode="range"
//                   showIcon
//                   className="p-inputtext-sm"
//                 />
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
//   // const stockIntake = stats[0].count
//   // const stockReturn = stats[1].count

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
//   const rangeGroups = ranges.map((range) => {
//     const items = data.filter(({ date }) => {
//       const d = new Date(date)
//       return d >= range.start && d <= range.end
//     })
//     return {
//       ...range,
//       count: items.reduce((acc, curr) => acc + curr.count, 0)
//     }
//   })
//   const staticCounts = [10, 15, 20, 25]

// const rangeGroups = ranges.map((range, index) => {
//   return {
//     ...range,
//     count: staticCounts[index] || 0, // Use static count
//     percent: 0 // initialize percent, you can calculate later if needed
//   }
// })

//   // const totalInRanges = rangeGroups.reduce((a, b) => a + b.count, 0)
//   // rangeGroups.forEach(
//   //   (r) => (r.percent = totalInRanges ? Math.round((r.count / totalInRanges) * 100) : 0)
//   // )

//   return (
//     <div>
//       {/* Progress Cards - Always full data */}
//       <div className="flex gap-4">
//         {rangeGroups.map((item, idx) => (
//           <div className="flex-1 shadow-2 rounded-xl bg-white" key={idx}>
//             <Card title={item.label} style={{ borderRadius: '12px', background: '#fff' }}>
//               <div
//                 style={{
//                   background: '#e9ecef',
//                   borderRadius: '4px',
//                   height: '8px',
//                   marginBottom: '12px',
//                   width: '100%',
//                   overflow: 'hidden'
//                 }}
//               >
//                 <div
//                   style={{
//                     background: ['#0d6efd', '#6610f2', '#198754', '#fd7e14'][idx],
//                     // width: `${item.percent}%`,
//                     height: '100%',
//                     transition: 'width 0.5s ease'
//                   }}
//                 />
//               </div>
//               <div className="flex justify-between gap-2 items-center">
//                 <span className="text-2xl font-semibold text-gray-800">{item.count}</span>
//                 <span className="text-md text-gray-500">Products</span>
//               </div>
//             </Card>
//           </div>
//         ))}
//       </div>

//       <div className="card flex shadow-2 mt-4 gap-2">
//         {/* Doughnut chart - Always full data */}
//         <div className="flex-1">
//           <Card
//             title="Purchase Order"
//             style={{
//               height: '400px',
//               backgroundColor: '#fff',
//               padding: '20px 14px',
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
//                 <div style={{ fontSize: 18 }}>Purchase Overview</div>
//                 <div style={{ fontSize: 20 }}>
//                   {`${data.filter((d) => d.type === 'PO Taken').reduce((a, c) => a + c.count, 0)} Taken / ${data
//                     .filter((d) => d.type === 'PO Returned')
//                     .reduce((a, c) => a + c.count, 0)} Returned`}
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>

//         {/* Summary - Filtered by selectedDate */}
//         <div className="flex-1 ml-3">
//           <Card
//             header={
//               <div className="flex justify-between items-center w-full">
//                 <span className="text-xl font-semibold text-gray-800">Summary</span>
//                 <div className="flex-1 gap-3">
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
    return <div></div>
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
    { title: 'PO Taken' as const, color: '#007bff' },
    { title: 'PO Returned' as const, color: '#dc3545' }
  ]
  const stats = [
    ...statTypes.map((type) => ({
      title: type.title,
      count: dataForStats
        .filter((d) => d.type === type.title)
        .reduce((acc, curr) => acc + curr.count, 0),
      color: type.color
    })),
    { title: 'Suppliers Count', count: summary.suppliers, color: '#28a745' },
    { title: 'Invoices Generated', count: summary.invoices, color: '#ffc107' }
  ]

  // Doughnut chart (always full data - no filter)
  const doughnutData = {
    labels: ['Taken', 'Returned'],
    datasets: [
      {
        data: [
          data.filter((d) => d.type === 'PO Taken').reduce((a, c) => a + c.count, 0),
          data.filter((d) => d.type === 'PO Returned').reduce((a, c) => a + c.count, 0)
        ],
        backgroundColor: ['#6f1f5f', '#f0d6eb'],
        hoverBackgroundColor: ['#6f1f5f', '#f0d6eb'],
        borderWidth: 0
      }
    ]
  }
  const doughnutOpts = {
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { color: '#495057', font: { size: 14, weight: 'bold' } }
      }
    },
    responsive: true,
    maintainAspectRatio: false
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
        label: `${i * 7}-${(i + 1) * 7} Days`,
        start,
        end
      })
    }
    return ranges
  }

  const ranges = getDateRanges(new Date('2025-07-01'))
  const staticCounts = [3, 0, 0, 0]

  const rangeGroups = ranges.map((range, index) => {
    const count = staticCounts[index] || 0
    return {
      ...range,
      count,
      percent: 0
    }
  })

  const totalInRanges = rangeGroups.reduce((acc, r) => acc + r.count, 0)
  rangeGroups.forEach((r) => {
    r.percent = totalInRanges ? Math.round((r.count / totalInRanges) * 100) : 0
  })

  return (
    <div>
      {/* Progress Cards - Always full data */}
      <div className="flex gap-4">
        {rangeGroups.map((item, idx) => (
          <div className="flex-1 shadow-2 rounded-xl bg-white" key={idx}>
            <Card title={item.label} style={{ borderRadius: '12px', background: '#fff' }}>
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
                    background: ['#0d6efd', '#6610f2', '#198754', '#fd7e14'][idx],
                    width: `${item.percent}%`,
                    height: '100%',
                    transition: 'width 0.5s ease'
                  }}
                />
              </div>
              <div className="flex justify-between gap-2 items-center">
                <span className="text-2xl font-semibold text-gray-800">{item.count}</span>{' '}
                <span className="text-2xl text-gray-500 font-semibold ">Products</span>
              </div>
            </Card>
          </div>
        ))}
      </div>

      <div className="card flex shadow-2 mt-4 gap-2">
        {/* Doughnut chart - Always full data */}
        <div className="flex-1">
          <Card
            title="Purchase Order"
            style={{
              height: '400px',
              backgroundColor: '#fff',
              padding: '20px 14px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
              <Chart
                type="doughnut"
                data={doughnutData}
                options={doughnutOpts}
                style={{ width: '100%', height: '100%' }}
              />
              {/* <div
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
                <div style={{ fontSize: 15 }}>Purchase Overview</div>
                <div style={{ fontSize: 20 }}>
                  {`${data.filter((d) => d.type === 'PO Taken').reduce((a, c) => a + c.count, 0)} Taken / ${data
                    .filter((d) => d.type === 'PO Returned')
                    .reduce((a, c) => a + c.count, 0)} Returned`}
                </div>
              </div> */}
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
                <div style={{ fontSize: 15 }}>Purchase Overview</div>
                <div style={{ fontSize: 20 }}>3 Taken / 0 Returned</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Summary - Filtered by selectedDate */}
        <div className="flex-1 ml-3">
          <Card
            header={
              <div className="flex justify-content-between align-items-center">
                <span className="text-xl font-semibold text-gray-800">Summary</span>
                <div className="gap-3">
                  <Calendar
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.value as Date | null)}
                    selectionMode="single"
                    showIcon
                    placeholder="Select a date"
                    className="p-inputtext-sm "
                  />
                </div>
              </div>
            }
            style={{
              height: '400px',
              backgroundColor: '#fff',
              display: 'flex',
              flexDirection: 'column',
              position: 'relative',
              padding: '20px'
            }}
          >
            <div className="flex flex-cols-4 gap-4 mt-4">
              {stats.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-lg p-4 shadow-md text-center flex-1"
                  style={{ backgroundColor: '#f8f9fa', margin: 4, minWidth: 120 }}
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
