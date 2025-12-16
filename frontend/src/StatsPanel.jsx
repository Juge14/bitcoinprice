import {
    longestBearishTrend,
    highestVolumeDay,
    bestBuySellDays
} from "./utils/BitcoinAnalysis"

function StatsPanel({ prices, volumes }) {
  const bearish = longestBearishTrend(prices)
  const volume = highestVolumeDay(volumes)
  const trade = bestBuySellDays(prices)

  return (
    <div>
      <p>Longest bearish trend: {bearish}</p>
      <p>Highest volume day: {volume.date}</p>
      <p>Best trade: {trade.buy} → {trade.sell}</p>
    </div>
  )
}

export default StatsPanel