import React from 'react'
import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'

const InventoryOverview: React.FC = () => {
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

  const categories = [
    { name: 'Silk', count: 10 },
    { name: 'Cotton', count: 24 },
    { name: 'Cotton', count: 45 },
    { name: 'Cotton', count: 56 },
    { name: 'Cotton', count: 46 },
    { name: 'Cotton', count: 64 },
    { name: 'Cotton', count: 20 },
    { name: 'Cotton', count: 20 },
    { name: 'Cotton', count: 20 }
  ]
  return (
    <div>
      <div className="card flex">
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
      </div>

      <div className="card flex">
        <div className="flex-1 gap-3 mt-3">
          <Card
            title=" Stocks"
            style={{
              width: '350px',
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

        <div className="flex-1 gap-3 mt-3 ml-3 ">
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
            {/* <div className="flex gap-2">
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
            </div>

            <div className="flex gap-2 mt-3">
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
              <div className="flex-1">
                <Card
                  title=""
                  style={{
                    width: '260px',
                    height: '90px'
                    //   display: 'flex',
                    //   position: 'relative'
                  }}
                ></Card>
              </div>
            </div> */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <div
                  key={cat.name}
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
                    <span className="text-xl font-bold">{cat.name}</span>
                    <span className="text-xl font-semibold text-right">{cat.count}</span>
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
