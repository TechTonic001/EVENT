import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppShell from '../components/AppShell.jsx'
import { createEvent } from '../lib/api.js'

function PinIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 22s7-5.2 7-12a7 7 0 1 0-14 0c0 6.8 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}

export default function CreateEvent() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [totalCapacity, setTotalCapacity] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await createEvent({
        name,
        description,
        startDate,
        endDate,
        location,
        ticketPrice: Number(ticketPrice),
        totalCapacity: Number(totalCapacity)
      })
      nav('/dashboard')
    } catch (err) {
      setError(err.message || 'Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppShell>
      <main className="page">
        <div className="formPageWrap">
          <h1 className="pageTitle">Create New Event</h1>
          <div className="pageSubtitle">Provide the logistical details to publish your event to the marketplace.</div>

          {error ? <div className="errorText">{error}</div> : null}

          <form onSubmit={onSubmit}>
            <div className="card bigFormCard">
              <div className="formSection">
                <h2 className="formSectionTitle">Event Details</h2>
                <div className="field">
                  <label>Event Name</label>
                  <div className="input">
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g., Annual Tech Symposium 2024"
                      required
                    />
                  </div>
                </div>

                <div className="field" style={{ marginTop: 14 }}>
                  <label>Description</label>
                  <div className="input" style={{ height: 'auto' }}>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the event, agenda, and what attendees can expect..."
                    />
                  </div>
                </div>
              </div>

              <div className="formSection">
                <h2 className="formSectionTitle">Date &amp; Location</h2>
                <div className="formGrid2">
                  <div className="field">
                    <label>Start Date &amp; Time</label>
                    <div className="input">
                      <input value={startDate} onChange={(e) => setStartDate(e.target.value)} type="datetime-local" required />
                    </div>
                  </div>
                  <div className="field">
                    <label>End Date &amp; Time</label>
                    <div className="input">
                      <input value={endDate} onChange={(e) => setEndDate(e.target.value)} type="datetime-local" required />
                    </div>
                  </div>
                </div>

                <div className="field" style={{ marginTop: 14 }}>
                  <label>Location Address</label>
                  <div className="input">
                    <span style={{ color: '#94a3b8', fontWeight: 900, display: 'grid', placeItems: 'center' }}>
                      <PinIcon />
                    </span>
                    <input
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="Search for a venue or address"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="formSection">
                <h2 className="formSectionTitle">Ticketing</h2>
                <div className="formGrid2">
                  <div className="field">
                    <label>Ticket Price</label>
                    <div className="input">
                      <span style={{ color: '#94a3b8', fontWeight: 900 }}>$</span>
                      <input
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Total Quantity</label>
                    <div className="input">
                      <input
                        value={totalCapacity}
                        onChange={(e) => setTotalCapacity(e.target.value)}
                        type="number"
                        min="0"
                        step="1"
                        placeholder="e.g., 500"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="formActions">
                <button className="ghostBtn" type="button" onClick={() => nav('/dashboard')}>
                  Discard
                </button>
                <button className="primaryBtn" type="submit" disabled={loading}>
                  {loading ? 'Publishing...' : 'Publish Event'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </AppShell>
  )
}

