import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Activity, ShieldCheck, ShieldAlert, AlertTriangle, ShieldX } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, toxic: 0, safe: 0, spam: 0, profanity: 0 })
  const [history, setHistory] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, historyRes] = await Promise.all([
        axios.get('http://localhost:8000/api/dashboard'),
        axios.get('http://localhost:8000/api/history')
      ])
      setStats(statsRes.data)
      setHistory(historyRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const handleDeleteAll = async () => {
    try {
      await axios.delete('http://localhost:8000/api/history')
      setHistory([])
      fetchData()
    } catch (error) {
      console.error('Error deleting history:', error)
    }
  }

  const getBadgeClass = (cat) => `status-${cat} badge-small`

  return (
    <div>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Activity className="logo-icon" /> System Overview
      </h2>
      
      <div className="stats-grid">
        <div className="glass stat-card total">
          <div className="stat-title">Total Messages</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="glass stat-card safe">
          <ShieldCheck style={{ color: 'var(--safe)', position: 'absolute', top: '1rem', right: '1rem', opacity: 0.2 }} size={40} />
          <div className="stat-title">Safe</div>
          <div className="stat-value" style={{ color: 'var(--safe)' }}>{stats.safe}</div>
        </div>
        <div className="glass stat-card toxic">
          <ShieldAlert style={{ color: 'var(--toxic)', position: 'absolute', top: '1rem', right: '1rem', opacity: 0.2 }} size={40} />
          <div className="stat-title">Toxic</div>
          <div className="stat-value" style={{ color: 'var(--toxic)' }}>{stats.toxic}</div>
        </div>
        <div className="glass stat-card spam">
          <AlertTriangle style={{ color: 'var(--spam)', position: 'absolute', top: '1rem', right: '1rem', opacity: 0.2 }} size={40} />
          <div className="stat-title">Spam</div>
          <div className="stat-value" style={{ color: 'var(--spam)' }}>{stats.spam}</div>
        </div>
        <div className="glass stat-card profanity">
          <ShieldX style={{ color: 'var(--profanity)', position: 'absolute', top: '1rem', right: '1rem', opacity: 0.2 }} size={40} />
          <div className="stat-title">Profanity</div>
          <div className="stat-value" style={{ color: 'var(--profanity)' }}>{stats.profanity}</div>
        </div>
      </div>

      <div className="glass panel">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Recent History</h3>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={fetchData} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Refresh
            </button>
            <button onClick={handleDeleteAll} className="btn btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
              Delete All
            </button>
          </div>
        </div>
        
        {history.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No messages checked yet.</p>
        ) : (
          <ul className="history-list">
            {history.map((msg) => (
              <li key={msg.id} className="history-item">
                <div className="history-text" title={msg.text}>
                  "{msg.text}"
                </div>
                <div className="history-meta">
                  <span className={getBadgeClass(msg.category)}>
                    {msg.category}
                  </span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {msg.confidence.toFixed(1)}%
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Dashboard
