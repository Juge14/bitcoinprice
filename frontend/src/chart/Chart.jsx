import Chart from "react-apexcharts"

function ChartComponent({ prices }) {
  const options = {
    chart: {
      type: "line",
      zoom: { enabled: true },
      toolbar: { show: true }
    },
    xaxis: {
      type: "datetime",
      labels: {
        datetimeUTC: true,
        format: "dd MMM"
      }
    },
    yaxis: {
      labels: {
        formatter: (val) => `€${val.toFixed(2)}`
      }
    },
    tooltip: {
      x: { format: "dd MMM yyyy HH:mm" }
    }
  }

  const series = [
    {
      name: "BTC price",
      data: prices
    }
  ]
  return (
    <Chart 
      options={options}
      series={series}
      type="line"
      height={400}
    />
  )
}

export default ChartComponent