import { useEffect, useState } from "react";
import {
  BrowserRouter,
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import "./App.css";

const API_URL = "http://localhost:5000/api/events";

function formatDate(date) {
  if (!date) return "No date";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getEventId(id) {
  return id ? id.slice(-6).toUpperCase() : "------";
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="brand">
        <span className="brand-mark">g.</span>
        <span className="brand-copy">
          <strong>GatherDesk</strong>
          <small>EVENT MANAGEMENT</small>
        </span>
      </NavLink>

      <div className="sidebar-label">YOUR WORKSPACE</div>

      <nav className="side-nav">
        <NavLink to="/" end className={({ isActive }) =>
          `nav-link ${isActive ? "active" : ""}`
        }>
          <span className="nav-icon">▦</span>
          Dashboard
        </NavLink>

        <NavLink to="/add-event" className={({ isActive }) =>
          `nav-link ${isActive ? "active" : ""}`
        }>
          <span className="nav-icon">＋</span>
          Add event
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="avatar">A</div>
        <div>
          <strong>Administrator</strong>
          <span>Event coordinator</span>
        </div>
        <span className="online-dot" />
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="topbar">
      <div>
        <span className="eyebrow">EVENT OPERATIONS</span>
        <p>Good things happen when we gather.</p>
      </div>

      <div className="workspace-pill">
        <span className="online-dot" />
        Admin workspace
      </div>
    </header>
  );
}

function Dashboard() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function loadEvents() {
    try {
      setError("");
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Could not load events.");
      }

      const data = await response.json();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) {
      setError("Unable to connect to the server. Make sure your backend is running.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadEvents();
  }, []);

  async function deleteEvent(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Delete failed.");
      }

      setEvents((previous) => previous.filter((event) => event._id !== id));
    } catch {
      alert("Could not delete the event. Please try again.");
    }
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingCount = events.filter(
    (event) => new Date(event.eventDate) >= today
  ).length;

  const registrationCount = events.reduce(
    (total, event) => total + (Number(event.totalRegistrations) || 0),
    0
  );

  const filteredEvents = events.filter((event) => {
    const query = search.toLowerCase();

    return (
      (event.eventName || "").toLowerCase().includes(query) ||
      (event.venue || "").toLowerCase().includes(query) ||
      getEventId(event._id).toLowerCase().includes(query)
    );
  });

  return (
    <main className="page-content">
      <section className="welcome-banner">
        <div className="banner-decoration decoration-one" />
        <div className="banner-decoration decoration-two" />
        <div className="banner-decoration decoration-three" />

        <div className="banner-copy">
          <span className="banner-kicker">
            <span className="sparkle">✳</span> YOUR CREATIVE SPACE
          </span>
          <h1>Make every<br />gathering <em>count.</em></h1>
          <p>
            Big ideas, good people, memorable moments.
            <br className="desktop-break" />
            Everything you organise, all in one place.
          </p>
          <button
            className="primary-button banner-button"
            onClick={() => navigate("/add-event")}
          >
            <span>＋</span> Create an event
          </button>
        </div>

        <div className="banner-art" aria-hidden="true">
          <div className="art-sun" />
          <div className="art-circle art-circle-back" />
          <div className="art-circle art-circle-front">
            <span>LET'S</span>
            <strong>MEET!</strong>
            <span className="art-star">✳</span>
          </div>
          <div className="art-ticket">
            <span>GOOD TIMES</span>
            <strong>ARE AHEAD</strong>
            <div className="ticket-lines">
              <i />
              <i />
              <i />
            </div>
          </div>
          <div className="art-flower">✿</div>
        </div>

        <span className="banner-side-note">PLAN · CREATE · CELEBRATE</span>
      </section>

      <section className="section-heading">
        <div>
          <span className="eyebrow">THE BIG PICTURE</span>
          <h2>Your workspace at a glance<span className="heading-dot">.</span></h2>
        </div>
        <span className="live-label"><span /> LIVE OVERVIEW</span>
      </section>

      <section className="stats-grid">
        <article className="stat-card stat-coral">
          <div className="stat-top">
            <span>Total events</span>
            <span className="stat-icon">▦</span>
          </div>
          <div className="stat-number">{events.length}</div>
          <div className="stat-bottom">
            <span>✳</span> Events in your workspace
          </div>
          <div className="stat-decoration">01</div>
        </article>

        <article className="stat-card stat-sage">
          <div className="stat-top">
            <span>Upcoming events</span>
            <span className="stat-icon">◷</span>
          </div>
          <div className="stat-number">{upcomingCount}</div>
          <div className="stat-bottom">
            <span>✳</span> Still to come
          </div>
          <div className="stat-decoration">02</div>
        </article>

        <article className="stat-card stat-yellow">
          <div className="stat-top">
            <span>Total registrations</span>
            <span className="stat-icon">♙</span>
          </div>
          <div className="stat-number">{registrationCount}</div>
          <div className="stat-bottom">
            <span>✳</span> Across all your events
          </div>
          <div className="stat-decoration">03</div>
        </article>
      </section>

      <section className="events-panel">
        <div className="events-panel-header">
          <div>
            <span className="eyebrow">YOUR LINE-UP</span>
            <h2>All events<span className="heading-dot">.</span></h2>
            <p>Keep every detail in its right place.</p>
          </div>

          <label className="search-box">
            <span>⌕</span>
            <input
              type="search"
              placeholder="Search events or venues..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
        </div>

        {error && (
          <div className="message-box error-message">
            {error}
            <button className="text-button" onClick={loadEvents}>Try again</button>
          </div>
        )}

        {loading ? (
          <div className="empty-state">
            <div className="empty-illustration">✳</div>
            <h3>Getting things ready...</h3>
            <p>Your events will appear here in a moment.</p>
          </div>
        ) : !error && filteredEvents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-illustration">
              {search ? "⌕" : "✳"}
            </div>
            <h3>{search ? "No matches just yet" : "Your story starts here."}</h3>
            <p>
              {search
                ? "Try a different event name, ID, or venue."
                : "Create your first event and make something memorable."}
            </p>
            {!search && (
              <button
                className="primary-button"
                onClick={() => navigate("/add-event")}
              >
                ＋ Create your first event
              </button>
            )}
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="events-table">
              <thead>
                <tr>
                  <th>EVENT</th>
                  <th>EVENT ID</th>
                  <th>DATE</th>
                  <th>VENUE</th>
                  <th>REGISTRATIONS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((event, index) => (
                  <tr key={event._id}>
                    <td>
                      <div className="event-name-cell">
                        <span className={`event-color event-color-${index % 4}`}>
                          {["✳", "✦", "✿", "✧"][index % 4]}
                        </span>
                        <div>
                          <strong>{event.eventName}</strong>
                          <small>{event.eventDescription}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="event-id">{getEventId(event._id)}</span>
                    </td>
                    <td>{formatDate(event.eventDate)}</td>
                    <td>{event.venue}</td>
                    <td>
                      <span className="registration-count">
                        {event.totalRegistrations ?? 0}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-button"
                          onClick={() => navigate(`/edit-event/${event._id}`)}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => deleteEvent(event._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="panel-footer">
          <span>MADE FOR MOMENTS THAT MATTER <span className="footer-star">✳</span></span>
          <span>{filteredEvents.length} {filteredEvents.length === 1 ? "EVENT" : "EVENTS"} SHOWN</span>
        </div>
      </section>
    </main>
  );
}

function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    eventName: "",
    eventDescription: "",
    eventDate: "",
    venue: "",
  });

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditing) return;

    async function loadEvent() {
      try {
        const response = await fetch(`${API_URL}/${id}`);

        if (!response.ok) {
          throw new Error("Could not find this event.");
        }

        const event = await response.json();

        setFormData({
          eventName: event.eventName || "",
          eventDescription: event.eventDescription || "",
          eventDate: event.eventDate
            ? new Date(event.eventDate).toISOString().slice(0, 10)
            : "",
          venue: event.venue || "",
        });
      } catch {
        setError("Could not load this event. Check your backend and try again.");
      } finally {
        setLoading(false);
      }
    }

    loadEvent();
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        isEditing ? `${API_URL}/${id}` : API_URL,
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Could not save the event.");
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="page-content">
        <div className="form-card empty-state">Loading event details...</div>
      </main>
    );
  }

  return (
    <main className="page-content form-page">
      <div className="form-intro">
        <span className="eyebrow">{isEditing ? "MAKE IT JUST RIGHT" : "A NEW BEGINNING"}</span>
        <h1>{isEditing ? "Edit your event" : "Let's make it happen"}<span className="heading-dot">.</span></h1>
        <p>
          {isEditing
            ? "A few little changes can make a big difference."
            : "Every memorable gathering starts with an idea."}
        </p>
      </div>

      <div className="form-layout">
        <form className="form-card" onSubmit={handleSubmit}>
          <div className="form-card-heading">
            <span className="form-heading-icon">✳</span>
            <div>
              <h2>Event details</h2>
              <p>Tell us a little about what you're planning.</p>
            </div>
          </div>

          {error && <div className="message-box error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="eventName">Event name <span>*</span></label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              placeholder="e.g. Creative Minds Summit"
              value={formData.eventName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="eventDescription">Description <span>*</span></label>
            <textarea
              id="eventDescription"
              name="eventDescription"
              placeholder="What's the event all about?"
              value={formData.eventDescription}
              onChange={handleChange}
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="eventDate">Event date <span>*</span></label>
              <input
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="venue">Venue <span>*</span></label>
              <input
                id="venue"
                name="venue"
                type="text"
                placeholder="e.g. Main auditorium"
                value={formData.venue}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving
                ? "Saving..."
                : isEditing
                ? "Save changes →"
                : "Create event →"}
            </button>
          </div>
        </form>

        <aside className="form-aside">
          <div className="aside-art">
            <span className="aside-sparkle">✳</span>
            <div className="aside-circle">
              <span>GOOD</span>
              <strong>IDEAS</strong>
              <span>GATHER HERE</span>
            </div>
            <span className="aside-flower">✿</span>
          </div>
          <span className="eyebrow">A LITTLE REMINDER</span>
          <h3>It's all about<br /><em>the people.</em></h3>
          <p>Give your event a name, a place, and a date. We'll help you keep the details together.</p>
        </aside>
      </div>
    </main>
  );
}

function AppLayout() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <Topbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add-event" element={<EventForm />} />
          <Route path="/edit-event/:id" element={<EventForm />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}