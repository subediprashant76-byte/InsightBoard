// Fake data source. Swap fetchStats for a real API call when you have one.
const categories = ['Electronics', 'Clothing', 'Home', 'Books', 'Sports']
const sources = ['Search', 'Social', 'Direct', 'Email', 'Referral']

function seededRandom(seed) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

function buildDays(count) {
  const rand = seededRandom(42)
  const days = []
  const today = new Date()

  for (let i = 89; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(today.getDate() - i)
    const orders = Math.round(40 + rand() * 60 + (89 - i) * 0.3)
    days.push({
      date: date.toISOString().slice(0, 10),
      orders,
      revenue: Math.round(orders * (35 + rand() * 25)),
      visitors: Math.round(orders * (12 + rand() * 8)),
      category: categories[Math.floor(rand() * categories.length)],
      source: sources[Math.floor(rand() * sources.length)],
    })
  }
  return days.slice(-count)
}

export function fetchStats(range) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const days = buildDays(range)
      const countBy = (key) =>
        Object.entries(
          days.reduce((acc, d) => {
            acc[d[key]] = (acc[d[key]] || 0) + d.orders
            return acc
          }, {})
        ).map(([name, value]) => ({ name, value }))

      resolve({
        days,
        byCategory: countBy('category'),
        bySource: countBy('source'),
      })
    }, 450)
  })
}
