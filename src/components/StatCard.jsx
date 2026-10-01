export default function StatCard({ label, value, change }) {
  const up = change >= 0

  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      <p className={up ? 'change up' : 'change down'}>
        {up ? '+' : ''}
        {change.toFixed(1)}% vs previous half
      </p>
    </div>
  )
}
