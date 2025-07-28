import { Card } from 'primereact/card'
import { Chart } from 'primereact/chart'
import React, { useEffect, useState } from 'react'
import type { ChartData, ChartOptions } from 'chart.js'

const Dashboard: React.FC = () => {
  const [chartData, setChartData] = useState<ChartData<'line'>>()
  const [chartOptions, setChartOptions] = useState<ChartOptions<'line'>>()
  const [salesChartData, setSalesChartData] = useState<ChartData<'bar' | 'pie'>>()
  const [salesChartOptions, setSalesChartOptions] = useState<ChartOptions<'bar' | 'pie'>>()

  useEffect(() => {
    const data = {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Sales',
          data: [540, 325, 702, 620],
          backgroundColor: [
            'rgba(255, 159, 64, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgb(255, 159, 64)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }
      ]
    }
    const options = {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }

    setSalesChartData(data)
    setSalesChartOptions(options)
  }, [])

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement)
    const textColor = documentStyle.getPropertyValue('--text-color')
    // const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary')
    // const surfaceBorder = documentStyle.getPropertyValue('--surface-border')
    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'First Dataset',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: false,
          //   borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderColor: '#1f6f5f', // ✅ Fixed
          tension: 0.4
        },
        {
          label: 'Second Dataset',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: false,
          //   borderColor: documentStyle.getPropertyValue('--pink-500'),
          borderColor: '#a86fbf', // ✅ Fixed
          tension: 0.4
        },
        {
          label: 'Third Dataset',
          data: [45, 35, 60, 30, 50, 70, 20], // ✅ new unique values
          fill: false,
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          //   borderColor: '#bf6fa5', // ✅ Fixed
          tension: 0.4
        }
      ]
    }
    const options: ChartOptions<'line'> = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      animation: {
        duration: 0
      },
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (tooltipItem) {
              return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`
            }
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#6f1f5f' },
          grid: { color: 'rgba(111, 31, 95, 0.1)' }
        },
        y: {
          ticks: { color: '#6f1f5f' },
          grid: { color: 'rgba(111, 31, 95, 0.1)' }
        }
      }
    }

    setChartData(data)
    setChartOptions(options)
  }, [])

  useEffect(() => {
    const data = {
      labels: ['Cotton', 'Shiffon', 'Designer', 'Soft silk'],
      datasets: [
        {
          data: [30, 50, 100, 80],
          backgroundColor: [
            '#FF6384', // red-ish
            '#36A2EB', // blue-ish
            '#FFCE56', // yellow-ish
            '#4BC0C0' // teal-ish
          ],
          hoverBackgroundColor: ['#FF6384CC', '#36A2EBCC', '#FFCE56CC', '#4BC0C0CC']
        }
      ]
    }

    const options: ChartOptions<'pie'> = {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            color: '#333',
            font: { size: 14, weight: 'bold' }
          }
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: function (context: any) {
              const label = context.label || ''
              const value = context.parsed || 0
              return `${label}: ${value}`
            }
          }
        }
      }
    }

    setSalesChartData(data)
    setSalesChartOptions(options)
  }, [])

  return (
    // <div>
    //   <div className="card flex m-3" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
    //     <div className="flex-1 gap-3 mr-3">
    //       <Card title="Inventory" className="bg-blue-500 text-yellow">
    //         <p className="m-0">14</p>
    //       </Card>
    //     </div>
    //     <div className="flex-1 gap-3 mr-3">
    //       <Card title="Inventory" className="bg-green-100">
    //         <p className="m-0">10</p>
    //       </Card>
    //     </div>
    //     <div className="flex-1 gap-3 mr-3">
    //       <Card title="Inventory" className="bg-yellow-100">
    //         <p className="m-0">12</p>
    //       </Card>
    //     </div>
    //     <div className="flex-1 gap-3">
    //       <Card title="Inventory" className="bg-pink-100">
    //         <p className="m-0">13</p>
    //       </Card>
    //     </div>
    //   </div>
    //   <div className="flex">
    //     <div
    //       className="card ml-3"
    //       style={{
    //         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    //         width: '750px',
    //         height: '450px',
    //         margin: '2px',
    //         borderRadius: '4px',
    //         backgroundColor: '#fff'
    //       }}
    //     >
    //       <Chart
    //         type="line"
    //         data={chartData}
    //         options={{ ...chartOptions, maintainAspectRatio: false }}
    //         style={{ width: '100%', height: '100%' }}
    //       />
    //     </div>

    //     <div
    //       className="card ml-3"
    //       style={{
    //         boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    //         width: '750px',
    //         height: '450px',
    //         margin: '2px',
    //         borderRadius: '4px',
    //         // backgroundColor: '#fff',
    //         padding: '10px',
    //         display: 'flex',
    //         gap: '10px'
    //       }}
    //     >
    //       {/* Left column */}
    //       <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
    //         <Chart
    //           type="pie"
    //           data={salesChartData}
    //           options={salesChartOptions}
    //           style={{
    //             width: '100%',
    //             height: '100%',
    //             flex: 1,
    //             boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    //             backgroundColor: '#fff'
    //           }}
    //         />
    //       </div>

    //       {/* Right column */}
    //       <Chart
    //         type="bar"
    //         data={{
    //           ...salesChartData,
    //           datasets:
    //             salesChartData?.datasets?.map((dataset) => ({
    //               ...dataset,
    //               backgroundColor: '#914c8b',
    //               borderColor: '#6f1f5f',
    //               borderWidth: 1
    //             })) || []
    //         }}
    //         options={{
    //           ...salesChartOptions,
    //           plugins: {
    //             legend: {
    //               labels: {
    //                 color: '#1A1A1A',
    //                 font: {
    //                   weight: 'bold',
    //                   size: 12
    //                 }
    //               }
    //             },
    //             tooltip: {
    //               backgroundColor: '#f3e2d9',
    //               titleColor: '#f3e2d9',
    //               bodyColor: '#f3e2d9'
    //             }
    //           },
    //           scales: {
    //             x: {
    //               ticks: {
    //                 color: '#6f1f5f'
    //               },
    //               grid: {
    //                 color: 'rgba(111, 31, 95, 0.1)'
    //               }
    //             },
    //             y: {
    //               ticks: {
    //                 color: '#6f1f5f'
    //               },
    //               grid: {
    //                 color: 'rgba(111, 31, 95, 0.1)'
    //               }
    //             }
    //           },
    //           responsive: true,
    //           maintainAspectRatio: false
    //         }}
    //         style={{
    //           width: '100%',
    //           height: '100%',
    //           flex: 1,
    //           backgroundColor: '#ffffff',
    //           borderRadius: '8px',
    //           padding: '10px',
    //           boxShadow: '0 4px 20px rgba(111, 31, 95, 0.25)' // slight tint of primary color
    //         }}
    //       />
    //     </div>
    //   </div>

    //   <div
    //     className="card flex m-3 align-items-center"
    //     style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
    //   >
    //     <div className="flex-1 gap-3 mr-3">
    //       <Card title="Inventory" className="bg-blue-500 text-yellow">
    //         <p className="m-0">14</p>
    //       </Card>
    //     </div>
    //     <div className="flex-1 gap-3 mr-3">
    //       <Card title="Inventory" className="bg-green-100">
    //         <p className="m-0">10</p>
    //       </Card>
    //     </div>
    //     <div className="flex-1 gap-3 mr-3">
    //       <Card title="Inventory" className="bg-yellow-100">
    //         <p className="m-0">12</p>
    //       </Card>
    //     </div>
    //   </div>
    // </div>
  
    <div>
  {/* First Row: Small Cards */}
  <div className="card flex flex-wrap gap-3 m-3 justify-between" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
    <div className="flex-1 min-w-[220px] mr-3">
      <Card title="Inventory" className="bg-blue-500 text-yellow">
        <p className="m-0">14</p>
      </Card>
    </div>
    <div className="flex-1 min-w-[220px] mr-3">
      <Card title="Inventory" className="bg-green-100">
        <p className="m-0">10</p>
      </Card>
    </div>
    <div className="flex-1 min-w-[220px] mr-3">
      <Card title="Inventory" className="bg-yellow-100">
        <p className="m-0">12</p>
      </Card>
    </div>
    <div className="flex-1 min-w-[220px]">
      <Card title="Inventory" className="bg-pink-100">
        <p className="m-0">13</p>
      </Card>
    </div>
  </div>

  {/* Second Row: Charts */}
  <div className="flex flex-wrap gap-3 justify-center w-full">
    <div className="card ml-3" style={{
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '750px',
      height: '450px',
      margin: '2px',
      borderRadius: '4px',
      backgroundColor: '#fff'
    }}>
      <Chart
        type="line"
        data={chartData}
        options={{ ...chartOptions, maintainAspectRatio: false }}
        style={{ width: '100%', height: '100%' }}
      />
    </div>

    <div className="card ml-3" style={{
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '750px',
      height: '450px',
      margin: '2px',
      borderRadius: '4px',
      padding: '10px',
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', minWidth: '300px' }}>
        <Chart
          type="pie"
          data={salesChartData}
          options={salesChartOptions}
          style={{
            width: '100%',
            height: '100%',
            flex: 1,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
            backgroundColor: '#fff'
          }}
        />
      </div>

      <Chart
        type="bar"
        data={{
          ...salesChartData,
          datasets:
            salesChartData?.datasets?.map((dataset) => ({
              ...dataset,
              backgroundColor: '#914c8b',
              borderColor: '#6f1f5f',
              borderWidth: 1
            })) || []
        }}
        options={{
          ...salesChartOptions,
          plugins: {
            legend: {
              labels: {
                color: '#1A1A1A',
                font: {
                  weight: 'bold',
                  size: 12
                }
              }
            },
            tooltip: {
              backgroundColor: '#f3e2d9',
              titleColor: '#f3e2d9',
              bodyColor: '#f3e2d9'
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#6f1f5f'
              },
              grid: {
                color: 'rgba(111, 31, 95, 0.1)'
              }
            },
            y: {
              ticks: {
                color: '#6f1f5f'
              },
              grid: {
                color: 'rgba(111, 31, 95, 0.1)'
              }
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 4px 20px rgba(111, 31, 95, 0.25)'
        }}
      />
    </div>
  </div>

  {/* Third Row: Bottom Cards */}
  <div className="card flex flex-wrap gap-3 m-3 justify-between" 
  // style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}
  >
    <div className="flex-1 min-w-[220px] mr-3">
      <Card title="Inventory" className="bg-blue-500 text-yellow">
        <p className="m-0">14</p>
      </Card>
    </div>
    <div className="flex-1 min-w-[220px] mr-3">
      <Card title="Inventory" className="bg-green-100">
        <p className="m-0">10</p>
      </Card>
    </div>
    <div className="flex-1 min-w-[220px] mr-3">
      <Card title="Inventory" className="bg-yellow-100">
        <p className="m-0">12</p>
      </Card>
    </div>
  </div>
</div>

  )
}

export default Dashboard
