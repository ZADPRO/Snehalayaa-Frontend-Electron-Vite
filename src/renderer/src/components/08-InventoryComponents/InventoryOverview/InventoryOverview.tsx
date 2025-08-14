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
    <div className="inventory-dashboard ">
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
              {/* <span className="active">Day</span>
              <span className="active">Week</span>
              <span className="active">Month</span> */}
            </div>
          </div>
          <div className="chart-container">
            <Chart type="line" data={areaData} options={areaOptions} />
          </div>
          <div className="chart-legend">
            <div className="legend-item">
              <span className="legend-color purple"></span>
              <span>Silk</span>
            </div>
            <div className="legend-item">
              <span className="legend-color pink"></span>
              <span>Cotton</span>
            </div>
          </div>
        </Card>

        {/* Right Side Cards */}
        <div className="right-side">
       
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

    
    </div>
  )
}

export default InventoryOverview