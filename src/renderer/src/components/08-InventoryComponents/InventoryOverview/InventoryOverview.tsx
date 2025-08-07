// import React, { useEffect, useRef, useState } from 'react'
// import { Card } from 'primereact/card'
// import { Chart } from 'primereact/chart'
// import { FolderKanban } from 'lucide-react'
// import { Category } from './InventoryOverview.interface'
// import { fetchCategories } from './InventoryOverview.function'
// import { Toast } from 'primereact/toast'

// const InventoryOverview: React.FC = () => {
//   const [categories, setCategories] = useState<Category[]>([])
//   const toast = useRef<Toast>(null)

//   const stockIntake = 30
//   const stockReturn = 50
//   //   const total = stockIntake + stockReturn

//   const data = {
//     labels: ['Used', 'Free'],
//     datasets: [
//       {
//         data: [stockIntake, stockReturn],
//         backgroundColor: ['#6f1f5f', '#f0d6eb'], // magenta + light pink
//         // hoverBackgroundColor: ['#6f0f5f', '#f3a9c9'],
//         borderWidth: 0
//       }
//     ]
//   }

//   const options = {
//     cutout: '75%', // donut hole size
//     responsive: true,
//     maintainAspectRatio: false,
//     animation: {
//       animateScale: false,
//       animateRotate: false
//     },
//     plugins: {
//       legend: {
//         display: false
//       },
//       tooltip: {
//         enabled: false
//       }
//     }
//   }

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
//   return (
//     <div>
//       {/* <div className="card flex">
//         <div className="flex-1 gap-3 mr-3">
//           <Card title="Inventory">
//             <p className="m-0">14</p>
//           </Card>
//         </div>
//         <div className="flex-1 gap-3 mr-3">
//           <Card title="Inventory">
//             <p className="m-0"> 10</p>
//           </Card>
//         </div>
//         <div className="flex-1 gap-3 mr-3">
//           <Card title="Inventory">
//             <p className="m-0">12</p>
//           </Card>
//         </div>
//         <div className="flex-1 gap-3">
//           <Card title="Inventory">
//             <p className="m-0">13</p>
//           </Card>
//         </div>
//       </div> */}
//       <div className="flex gap-4">
//         {[
//           { title: 'Inventory', count: 14, percent: 10, color: '#007bff' },
//           { title: 'Inventory', count: 10, percent: 20, color: '#28a745' },
//           { title: 'Inventory', count: 12, percent: 50, color: '#ffc107' },
//           { title: 'Inventory', count: 13, percent: 60, color: '#dc3545' }
//         ].map((item, idx) => (
//           <div className="flex-1 shadow-2" key={idx}>
//             <Card title={item.title}>
//               <div
//                 style={{
//                   background: '#f0f0f0',
//                   borderRadius: '4px',
//                   height: '6px',
//                   marginBottom: '12px',
//                   width: '100%',
//                   overflow: 'hidden'
//                 }}
//               >
//                 <div
//                   style={{
//                     background: item.color,
//                     width: `${item.percent}%`,
//                     height: '100%'
//                   }}
//                 />
//               </div>
//               <div className="flex justify-between items-center">
//                 <span className="text-2xl font-bold text-gray-800 text-right">{item.count}</span>
//               </div>
//             </Card>
//           </div>
//         ))}
//       </div>

//       {/* <Card title="Dropbox Storage">
//         <div
//           style={{
//             background: '#fbe4ed',
//             borderRadius: '4px',
//             height: '6px',
//             marginBottom: '16px',
//             width: '100%',
//             overflow: 'hidden'
//           }}
//         >
//           <div
//             style={{
//               background: '#ef476f',
//               width: `${(4.1 / 100) * 100}%`,
//               height: '100%'
//             }}
//           />
//         </div>
//         <div className="flex justify-content-between align-items-center">
//           <span>1</span>
//         </div>
//       </Card> */}

//       <div className="card flex shadow-2">
//         <div className="flex-1 gap-3 mt-3">
//           <Card
//             title=" Stocks"
//             style={{
//               height: '400px',
//               //   borderRadius: 12,
//               backgroundColor: '#fff',
//               padding: '20px 14px',
//               //   boxSizing: 'border-box',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center',
//               position: 'relative'
//             }}
//           >
//             <div style={{ width: '100%', height: '100%', position: 'relative' }}>
//               <Chart
//                 type="doughnut"
//                 data={data}
//                 options={options}
//                 style={{ width: '100%', height: '100%' }}
//               />
//               {/* Center label */}
//               <div
//                 style={{
//                   position: 'absolute',
//                   top: '50%',
//                   left: '50%',
//                   transform: 'translate(-50%, -50%)',
//                   textAlign: 'center',
//                   color: '#c61ba4',
//                   fontWeight: 600,
//                   pointerEvents: 'none'
//                 }}
//               >
//                 <div style={{ fontSize: 18 }}>Stock Overview</div>
//                 <div
//                   style={{ fontSize: 20 }}
//                 >{`${stockIntake} Taked / ${stockReturn} Returned`}</div>
//               </div>
//             </div>
//           </Card>
//         </div>

//         <div className="flex-1 gap-3 mt-3 ml-3 shadow-2">
//           <Card
//             title="Category"
//             style={{
//               width: '830px',
//               height: '400px',
//               //   borderRadius: 0,
//               backgroundColor: '#fff',
//               //   padding: '20px 14px',
//               //   boxSizing: 'border-box',
//               display: 'flex',
//               position: 'relative'
//             }}
//           >
//             <div className="flex flex-wrap gap-2">
//               {categories.map((cat) => (
//                 <div
//                   key={cat.refCategoryId}
//                   className="px-4 shadow-2"
//                   style={{
//                     width: '260px',
//                     height: '60px',
//                     backgroundColor: '#fff',
//                     borderColor: 'gray',
//                     borderWidth: 2,
//                     display: 'flex',
//                     alignItems: 'center',
//                     borderRadius: '6px'
//                   }}
//                 >
//                   <div className="flex w-full align-items-center justify-content-between">
//                     <span className="text-xl flex items-center gap-2">
//                       <FolderKanban />
//                       {cat.categoryName}
//                     </span>
//                     <span className="text-xl font-semibold text-right">{cat.count ?? 0}</span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default InventoryOverview


import React, { useEffect, useRef, useState } from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import { FolderKanban, ShoppingCart, DollarSign, Package, Heart } from 'lucide-react'
import { Category } from './InventoryOverview.interface'
import { fetchCategories } from './InventoryOverview.function'
import { Toast } from 'primereact/toast'
import './InventoryOverview.css'

const InventoryOverview: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([])
  const toast = useRef(null)

  const stockIntake = 30
  const stockReturn = 50

  // Donut chart data
  const donutData = {
    labels: ['Used', 'Free'],
    datasets: [
      {
        data: [stockIntake, stockReturn],
        backgroundColor: ['#8b5cf6', '#f3e8ff'],
        borderWidth: 0
      }
    ]
  }

  const donutOptions = {
    cutout: '75%',
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

  // Area chart data for product sales
  const areaData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Saree',
        data: [8000, 9000, 7000, 8500, 12000, 9500, 11000],
        fill: true,
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        borderColor: '#8b5cf6',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Saree',
        data: [6000, 7500, 9000, 7000, 8000, 10000, 8500],
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
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      }
    }
  }

  // Bar chart data for category summary
  const barData = {
    labels: ['Electronics', 'Clothing', 'Books', 'Home', 'Sports', 'Beauty', 'Toys', 'Auto'],
    datasets: [
      {
        label: 'Current Stock',
        data: [45, 38, 25, 42, 35, 28, 32, 40],
        backgroundColor: '#8b5cf6',
        borderRadius: 4
      },
      {
        label: 'Required Stock',
        data: [38, 45, 30, 35, 40, 32, 28, 35],
        backgroundColor: '#ec4899',
        borderRadius: 4
      }
    ]
  }

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
        grid: {
          display: false
        },
        beginAtZero: true
      }
    }
  }

  const load = async () => {
    try {
      const data = await fetchCategories()
      const updatedWithStaticCounts = data.map((cat, index) => ({
        ...cat,
        count: 10 + index * 2
      }))
      setCategories(updatedWithStaticCounts)
    } catch (err:any) {
      console.log('err', err)
      // toast.current?.show({
      //   severity: 'error',
      //   summary: 'Error',
      //   detail: err.message || 'Failed to load categories',
      //   life: 3000
      // })

    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div className="inventory-dashboard">
      <Toast ref={toast} />
      
      {/* Top Stats Cards */}
      <div className="stats-grid">
        <Card className="stat-card purple-card">
          <div className="stat-content">
            <div className="stat-icon purple-icon">
              <ShoppingCart size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">Products Sold</div>
              <div className="stat-value">4565</div>
              <div className="stat-period">Jan - March 2019</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card pink-card">
          <div className="stat-content">
            <div className="stat-icon pink-icon">
              <DollarSign size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">Net Profit</div>
              <div className="stat-value">$ 3541</div>
              <div className="stat-period">Jan - March 2019</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card orange-card">
          <div className="stat-content">
            <div className="stat-icon orange-icon">
              <Package size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">New Customers</div>
              <div className="stat-value">4565</div>
              <div className="stat-period">Jan - March 2019</div>
            </div>
          </div>
        </Card>

        <Card className="stat-card blue-card">
          <div className="stat-content">
            <div className="stat-icon blue-icon">
              <Heart size={24} />
            </div>
            <div className="stat-info">
              <div className="stat-title">Customer Satisfaction</div>
              <div className="stat-value">99%</div>
              <div className="stat-period">Jan - March 2019</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        {/* Product Sales Chart */}
        <Card className="chart-card product-sales-card">
          <div className="chart-header">
            <h3>Product Sales</h3>
            <div className="chart-subtitle">Total Revenue of the Month</div>
            <div className="chart-value">$ 12,555</div>
            <div className="time-filter">
              <span className="active">Day</span>
              <span>Week</span>
              <span>Month</span>
            </div>
          </div>
          <div className="chart-container">
            <Chart type="line" data={areaData} options={areaOptions} />
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color purple"></span>
              <span>iPad 2</span>
            </div>
            <div className="legend-item">
              <span className="legend-color pink"></span>
              <span>iPhone X</span>
            </div>
          </div>
        </Card>

        {/* Right Side Cards */}
        <div className="right-side">
          {/* Stock Overview Donut */}
          <Card className="chart-card donut-card">
            <div className="chart-header">
              <h3>Stock Overview</h3>
            </div>
            <div className="donut-container">
              <Chart type="doughnut" data={donutData} options={donutOptions} />
              <div className="donut-center">
                <div className="donut-title">Total Stock</div>
                <div className="donut-value">{stockIntake + stockReturn}</div>
              </div>
            </div>
          </Card>

          {/* To Do List */}
          <Card className="todo-card">
            <div className="todo-header">
              <h3>ToDo</h3>
            </div>
            <div className="todo-list">
              <div className="todo-item">
                <span className="todo-bullet"></span>
                <span>Set up</span>
              </div>
              <div className="todo-item completed">
                <span className="todo-bullet checked"></span>
                <span>Stand-up</span>
              </div>
              <div className="todo-item">
                <span className="todo-bullet"></span>
                <span>Start give me the fights</span>
              </div>
              <div className="todo-item">
                <span className="todo-bullet"></span>
                <span>Programming work</span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="bottom-section">
        {/* Category Summary */}
        <Card className="chart-card category-summary-card">
          <div className="chart-header">
            <h3>Category Summary</h3>
          </div>
          <div className="chart-container">
            <Chart type="bar" data={barData} options={barOptions} />
          </div>
        </Card>

        {/* Category Overview */}
        <Card className="category-overview-card">
          <div className="chart-header">
            <h3>Category Overview</h3>
            <div className="category-stats">
              <div className="category-stat">
                <div className="stat-number">5680</div>
                <div className="stat-label">Total Revenue</div>
              </div>
              <div className="category-stat">
                <div className="stat-number">30</div>
                <div className="stat-label">Online Order</div>
                <div className="stat-percentage">26%</div>
              </div>
              <div className="category-stat">
                <div className="stat-number">50</div>
                <div className="stat-label">Offline Order</div>
                <div className="stat-percentage">50%</div>
              </div>
              <div className="category-stat">
                <div className="stat-number">20</div>
                <div className="stat-label">Return Order</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Category Cards */}
        <div className="category-cards">
          {categories.length > 0 ? (
            categories.slice(0, 6).map((cat) => (
              <Card key={cat.refCategoryId} className="category-card">
                <div className="category-content">
                  <div className="category-icon">
                    <FolderKanban size={20} />
                  </div>
                  <div className="category-info">
                    <div className="category-name">{cat.categoryName}</div>
                    <div className="category-count">{cat.count ?? 0}</div>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            ''
          )}
        </div>
      </div>
    </div>
  )
}

export default InventoryOverview