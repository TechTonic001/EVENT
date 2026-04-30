import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { clearToken } from '../lib/auth.js'

function Icon({ name }) {
  const common = { className: 'navIcon', viewBox: '0 0 24 24', fill: 'none', xmlns: 'http://www.w3.org/2000/svg' }
  if (name === 'dashboard') {
    return (
      <svg {...common}>
        <path d="M4 4h7v7H4V4Z" stroke="currentColor" strokeWidth="2" />
        <path d="M13 4h7v4h-7V4Z" stroke="currentColor" strokeWidth="2" />
        <path d="M13 10h7v10h-7V10Z" stroke="currentColor" strokeWidth="2" />
        <path d="M4 13h7v7H4v-7Z" stroke="currentColor" strokeWidth="2" />
      </svg>
    )
  }
  if (name === 'chart') {
    return (
      <svg {...common}>
        <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M4 19H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M8 15V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M12 15V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M16 15V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'list') {
    return (
      <svg {...common}>
        <path d="M7 6h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 18h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 6h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M3 12h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M3 18h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  }
  if (name === 'orders') {
    return (
      <svg {...common}>
        <path d="M7 7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 17h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M3 7h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M3 12h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
        <path d="M3 17h.01" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path
        d="M12 2a7 7 0 0 0-4 12.74V22l4-2 4 2v-7.26A7 7 0 0 0 12 2Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  )
}

export default function AppShell({ children }) {
  const nav = useNavigate()
  const { pathname } = useLocation()

  const manageActive = pathname.startsWith('/dashboard') || pathname.startsWith('/events')

  return (
    <div className="appShell">
      <aside className="sidebar">
        <div className="sidebarBrand">
          <div className="avatar" />
          <div className="brandText">
            <h3>Organizer Portal</h3>
            <p>Manage your events</p>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/dashboard" className={({ isActive }) => `navItem ${isActive ? 'active' : ''}`}>
            <Icon name="dashboard" />
            Dashboard
          </NavLink>
          <a className="navItem" href="#" onClick={(e) => e.preventDefault()}>
            <Icon name="chart" />
            Analytics
          </a>
          <a className="navItem" href="#" onClick={(e) => e.preventDefault()}>
            <Icon name="list" />
            Event List
          </a>
          <a className="navItem" href="#" onClick={(e) => e.preventDefault()}>
            <Icon name="orders" />
            Orders
          </a>
          <a className="navItem" href="#" onClick={(e) => e.preventDefault()}>
            <Icon name="settings" />
            Settings
          </a>
        </nav>

        <div className="sidebarFooter">
          <button className="newEventBtn" type="button" onClick={() => nav('/events/new')}>
            + New Event
          </button>
          <div style={{ height: 10 }} />
          <button
            className="ghostBtn"
            type="button"
            onClick={() => {
              clearToken()
              nav('/admin/login')
            }}
          >
            Log out
          </button>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div className="topbarBrand">EventPro</div>
          <div className="topbarLinks">
            <a className={pathname.startsWith('/explore') ? 'active' : ''} href="#" onClick={(e) => e.preventDefault()}>
              Explore
            </a>
            <a className={manageActive ? 'active' : ''} href="#" onClick={(e) => e.preventDefault()}>
              Manage
            </a>
            <a className={pathname.startsWith('/tickets') ? 'active' : ''} href="#" onClick={(e) => e.preventDefault()}>
              My Tickets
            </a>
          </div>
          <div className="topbarSpacer" />
          <input className="search" placeholder="Search..." />
          <div className="topbarRight">
            <button className="createEventTop" type="button" onClick={() => nav('/events/new')}>
              Create Event
            </button>
          </div>
        </header>

        {children}
      </div>
    </div>
  )
}

