import { useEffect, useMemo, useState } from 'react'
import AppShell from '../components/AppShell.jsx'
import { fetchEvents, fetchStats } from '../lib/api.js'

function formatMoney(value) {
  const n = Number(value || 0)
  return n.toLocaleString(undefined, { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function formatDateRange(start, end) {
  const s = new Date(start)
  const e = new Date(end)
  const opts = { month: 'short', day: '2-digit', year: 'numeric' }
  const startStr = s.toLocaleDateString(undefined, opts)
  const endStr = e.toLocaleDateString(undefined, opts)
  return startStr === endStr ? startStr : `${startStr} - ${endStr}`
}

function StatusBadge({ status }) {
  const cls =
    status === 'On Sale' ? 'onSale' : status === 'Sold Out' ? 'soldOut' : 'draft'
  return <span className={`badge ${cls}`}>{status}</span>
}

function Progress({ sold, cap }) {
  const pct = cap > 0 ? Math.min(100, Math.round((sold / cap) * 100)) : 0
  return (
    <div className="soldCell">
      <div style={{ fontWeight: 800, color: '#334155' }}>
        {sold} / {cap}
      </div>
      <div className="progressTrack">
        <div className="progressFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTicketsSold: 0 })
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const chartHeights = useMemo(() => [18, 24, 22, 34, 44, 38, 30], [])

  useEffect(() => {
    let ignore = false
    async function load() {
      setLoading(true)
      setError('')
      try {
        const [s, e] = await Promise.all([fetchStats(), fetchEvents()])
        if (ignore) return
        setStats(s)
        setEvents(e)
      } catch (err) {
        if (ignore) return
        setError(err.message || 'Failed to load')
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    load()
    return () => {
      ignore = true
    }
  }, [])

  return (
    <AppShell>
      <main className="page">
        <h1 className="pageTitle">Dashboard Overview</h1>
        <div className="pageSubtitle">Here's what's happening with your events today.</div>

        {error ? <div className="errorText">{error}</div> : null}

        <div className="grid2">
          <div className="card statCard" style={{ background: 'linear-gradient(90deg, #ffffff, #ecfeff)' }}>
            <div className="statLabel">Total Revenue</div>
            <div className="statValueRow">
              <div className="statValue">{loading ? '—' : formatMoney(stats.totalRevenue)}</div>
              <div className="pill">+ 12.5%</div>
            </div>
            <div className="miniChart" aria-hidden="true">
              {chartHeights.map((h, idx) => (
                <div key={idx} className={`bar ${idx === 4 ? 'dark' : ''}`} style={{ height: h }} />
              ))}
            </div>
          </div>

          <div className="card statCard">
            <div className="statLabel">Tickets Sold</div>
            <div className="statValueRow">
              <div className="statValue">{loading ? '—' : Number(stats.totalTicketsSold || 0).toLocaleString()}</div>
              <div className="pill">+ 8.2%</div>
            </div>

            <div style={{ marginTop: 18, display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: 12, fontWeight: 800 }}>
              <div>
                <div style={{ color: '#334155', fontWeight: 900 }}>VIP</div>
                <div>450</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#334155', fontWeight: 900 }}>GA</div>
                <div>2,795</div>
              </div>
            </div>
          </div>
        </div>

        <div className="activeEventsHeader">
          <h2 className="sectionTitle">Active Events</h2>
          <a className="viewAll" href="#" onClick={(e) => e.preventDefault()}>
            View All
          </a>
        </div>

        <div className="card tableCard">
          <div className="tableHeader">
            <div>Event</div>
            <div>Date</div>
            <div>Status</div>
            <div>Sold</div>
            <div style={{ textAlign: 'right' }}>Actions</div>
          </div>

          {events.length === 0 && !loading ? (
            <div style={{ padding: 16, color: '#64748b', fontWeight: 700, fontSize: 13 }}>No events yet. Click “Create Event”.</div>
          ) : null}

          {events.map((ev) => (
            <div key={ev._id} className="tableRow">
              <div className="eventCell">
                <div className="thumb" />
                <div>
                  <div className="eventName">{ev.name}</div>
                  <div className="eventLoc">{ev.location}</div>
                </div>
              </div>
              <div style={{ color: '#334155', fontWeight: 800, fontSize: 12 }}>{formatDateRange(ev.startDate, ev.endDate)}</div>
              <div>
                <StatusBadge status={ev.status} />
              </div>
              <div>
                <Progress sold={Number(ev.ticketsSold || 0)} cap={Number(ev.totalCapacity || 0)} />
              </div>
              <div style={{ justifySelf: 'end' }}>
                <button className="actionBtn" type="button">
                  View Sales
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </AppShell>
  )
}

