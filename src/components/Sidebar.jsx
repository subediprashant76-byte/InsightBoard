const links = ['Overview', 'Orders', 'Customers', 'Reports', 'Settings']

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside className={collapsed ? 'sidebar collapsed' : 'sidebar'}>
      <div className="sidebar-head">
        {!collapsed && <span className="logo">InsightBoard</span>}
        <button
          className="toggle"
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '>' : '<'}
        </button>
      </div>
      <nav>
        {links.map((name, i) => (
          <a key={name} href="#" className={i === 0 ? 'active' : ''} title={name}>
            <span className="dot">{name[0]}</span>
            {!collapsed && <span>{name}</span>}
          </a>
        ))}
      </nav>
    </aside>
  )
}
