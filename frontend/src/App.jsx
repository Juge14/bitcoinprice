import { useState } from 'react'
import './App.css'
import axios from 'axios'
import ChartComponent from './chart/Chart'
import StatsPanel from './StatsPanel'

function App() {
  const [date, setDate] = useState({ start: "", end: "" })
  const [datesSelected, setDatesSelected] = useState(false)
  const [dateError, setDateError] = useState(false)
  const [dataFetched, setDataFetched] = useState(false)
  const [prices, setPrices] = useState([])
  const [volumes, setVolumes] = useState([])

  const normalizeToDailyPrices = (prices = []) => {
    const dailyMap = {}

    for (const [timestamp, price] of prices) {
      const date = new Date(timestamp).toISOString().split('T')[0]

      dailyMap[date] = [timestamp, price]
    }

    return Object.values(dailyMap).sort(
      (a, b) => a[0] - b[0]
    )
  }

  const handleDateChange = (event) => {
    const { name, value } = event.target
    const newDate = ({
      ...date,
      [name]: value
    })

    setDate(newDate)

    if (newDate.start !== "" && newDate.end !== "") {
      if (new Date(newDate.start) <= new Date(newDate.end)) {
        setDatesSelected(true)
        setDateError(false)
        console.log('selected')

        //start date cant be after end date
      } else if (new Date(newDate.start) > new Date(newDate.end)) {
        console.log("Start date cannot be after End date")
        setDatesSelected(false)
        setDateError(true)
      }
    } else {
      setDatesSelected(false)
    }
  }

  const getUnixTimestamps = () => {
    const startDate = new Date(date.start)
    const endDate = new Date(date.end)

    const startTimestamp = Math.floor(startDate.getTime() / 1000)
    const endTimestamp = Math.floor(endDate.getTime() / 1000) + 3600

    return { startTimestamp, endTimestamp }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const { startTimestamp, endTimestamp } = getUnixTimestamps()
    console.log(startTimestamp, endTimestamp)

    axios
      .get('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=eur&from=' + startTimestamp + '&to=' + endTimestamp)
      .then(response => {
        const data = response.data
        console.log(data)
        setPrices(data.prices)
        setVolumes(data.total_volumes)
        setDataFetched(true)
      })
      .catch(error => {
        console.error("Failed to fetch data:", error)
      })
  }
  if (dataFetched === true) {
    return (
      <>
        <div className='card-analyzing'>
          <div className='wrapper'>
            <div className='dates'>
              <p>Selected dates:</p>
              <p>From {date.start} to {date.end}</p>
            </div>

            <span className='line'></span>

            <form onSubmit={handleSubmit}>
              <h3>Select new dates</h3>
              <div className="inputs">
                <label>Start</label>
                <input onChange={handleDateChange} name='start' value={date.start} type="date" />
                <label>End</label>
                <input onChange={handleDateChange} name='end' value={date.end} type="date" />
                {dateError === true ? <p className='date-error'>Start date cannot be after end date</p> : null}
              </div>

              <br />
              <div className='buttons'>
                {datesSelected === true ? (
                  <button type='submit'>Analyze</button>
                ) : (
                  <button disabled className='notselected'>Select dates to analyze</button>
                )}
                <button onClick={() => setDataFetched(false)} className='back'>Back to home</button>
              </div>

            </form>
          </div>

          <span className='line-vertical'></span>

          <div className="wrapper">
            <ChartComponent
              prices={normalizeToDailyPrices(prices)}
            />
          </div>
          <span className='line-vertical'></span>
          <div className="wrapper">
            <h2>Price Statistics</h2>
            <StatsPanel prices={prices} volumes={volumes} />
          </div>
        </div>
      </>
    )
  }

  return (
    <div>
      <form className='card' onSubmit={handleSubmit}>
        <div className="header">
          <h1>Bitcoin price</h1>
          <p>Select dates</p>
        </div>

        <div className="inputs">
          <label>Start</label>
          <input onChange={handleDateChange} name='start' value={date.start} type="date" />
          <label>End</label>
          <input onChange={handleDateChange} name='end' value={date.end} type="date" />
          {dateError === true ? <p className='date-error'>Start date cannot be after end date</p> : null}
        </div>

        <div className='dates'>
          <p>Selected dates:</p>
          <p>From {date.start} to {date.end}</p>
        </div>

        {datesSelected === true ? (
          <button type='submit'>Analyze</button>
        ) : (
          <button disabled className='notselected'>Select dates to analyze</button>
        )}


      </form>
    </div>
  )
}

export default App
