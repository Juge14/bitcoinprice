export function longestBearishTrend(prices) {
  let current = 0
  let longest = 0

  for (let i = 1; i < prices.length; i++) {
    if (prices[i][1] < prices[i - 1][1]) {
      current++
      longest = Math.max(longest, current)
    } else {
      current = 0
    }
  }
  return longest
}

export function highestVolumeDay(volumes) {
  let maxVolume = 0
  let maxDate = null

  for (const [timestamp, volume] of volumes) {
    if (volume> maxVolume) {
      maxVolume = volume
      maxDate = new Date(timestamp).toISOString().split("T")[0]
    }
  }

  return {
    date: maxDate,
    volumeEUR: maxVolume
  }
}

export function bestBuySellDays(prices) {
  let minPrice = prices[0][1]
  let minDate = prices[0][0]

  let maxProfit = 0
  let buyDate = null
  let sellDate = null

  for (let i = 1; i < prices.length; i++) {
    const [timestamp, price] = prices[i]

    if (price < minPrice) {
      minPrice = price
      minDate = timestamp
    }

    const profit = price - minPrice

    if (profit > maxProfit) {
      maxProfit = profit
      buyDate = minDate
      sellDate = timestamp
    }
  }

  if (maxProfit <= 0) {
    return "Dont buy or sell in this period"
  }

  return {
    buy: new Date(buyDate).toISOString().split("T")[0],
    sell: new Date(sellDate).toISOString().split("T")[0],
    profitEUR: maxProfit
  }
}