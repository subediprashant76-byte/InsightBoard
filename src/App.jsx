import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchStats } from './data'
import Sidebar from './components/Sidebar'
import StatCard from './components/StatCard'

const ranges = [7, 30, 90]
const colors = ['#2a6f97', '#e07a5f', '#81b29a', '#f2cc8f', '#7b6d8d']

const sum = (list, key) => list.reduce((total, item) => total + item[key], 0)
const percentChange = (now, before) => (before === 0 ? 0 : ((now - before) / before) * 100)
const money = (n) => '$' + n.toLocaleString()

export default function App() {
  const [range, setRange] = useState(30)
  const [stats, setStats] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    let ignore = false
    setStats(null)
    fetchStats(range).then((data) => {
      if (!ignore) setStats(data)
    })
    return () => {
      ignore = true
    }
  }, [range])

  const cards = useMemo(() => {
    if (!stats) return []
    const half = Math.floor(stats.days.length / 2)
    const before = stats.days.slice(0, half)
    const now = stats.days.slice(half)

    return [
      { label: 'Revenue', value: money(sum(stats.days, 'revenue')), change: percentChange(sum(now, 'revenue'), sum(before, 'revenue')) },
      { label: 'Orders', value: sum(stats.days, 'orders').toLocaleString(), change: percentChange(sum(now, 'orders'), sum(before, 'orders')) },
      { label: 'Visitors', value: sum(stats.days, 'visitors').toLocaleString(), change: percentChange(sum(now, 'visitors'), sum(before, 'visitors')) },
    ]
  }, [stats])

  return (
    <div className="layout">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main>
        <header className="page-head">
          <h1>Sales overview</h1>
          <div className="range" role="group" aria-label="Date range">
            {ranges.map((r) => (
              <button key={r} className={r === range ? 'on' : ''} onClick={() => setRange(r)}>
                Last {r} days
              </button>
            ))}
          </div>
        </header>

        {!stats ? (
          <p className="loading">Loading data...</p>
        ) : (
          <>
            <section className="stats">
              {cards.map((c) => (
                <StatCard key={c.label} {...c} />
              ))}
            </section>

            <section className="panel">
              <h2>Revenue</h2>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={stats.days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e3e6ea" />
                  <XAxis dataKey="date" tickFormatter={(d) => d.slice(5)} minTickGap={24} />
                  <YAxis tickFormatter={(v) => `$${v / 1000}k`} />
                  <Tooltip formatter={(v) => money(v)} />
                  <Line type="monotone" dataKey="revenue" stroke="#2a6f97" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </section>

            <div className="two-col">
              <section className="panel">
                <h2>Orders by category</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={stats.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e3e6ea" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#2a6f97" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </section>

              <section className="panel">
                <h2>Traffic sources</h2>
                <ResponsiveContainer width="100%" height={240}>
                  <PieChart>
                    <Pie data={stats.bySource} dataKey="value" nameKey="name" innerRadius={50} outerRadius={85} label>
                      {stats.bySource.map((_, i) => (
                        <Cell key={i} fill={colors[i % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </section>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
