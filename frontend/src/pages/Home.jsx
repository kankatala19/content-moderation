import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Database } from 'lucide-react'

const Home = () => {
  return (
    <div className="hero">
      <h1>Intelligent Content Moderation</h1>
      <p>
        A real-time AI-powered system designed to detect and filter out toxic, spam, and 
        profane content instantly. Keep your platform safe and welcoming for everyone.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
        <Link to="/moderate" className="btn">
          Start Moderating <ArrowRight size={18} />
        </Link>
        <Link to="/dashboard" className="btn btn-secondary">
          View Dashboard
        </Link>
      </div>

      <div className="stats-grid" style={{ marginTop: '2rem' }}>
        <div className="glass panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <ShieldCheck size={48} className="logo-icon" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Real-time Analysis</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Instant classification using Machine Learning</p>
        </div>
        <div className="glass panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Zap size={48} className="logo-icon" style={{ margin: '0 auto 1rem auto' }} />
          <h3>High Accuracy</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Powered by Scikit-learn & TF-IDF</p>
        </div>
        <div className="glass panel" style={{ padding: '2rem', textAlign: 'center' }}>
          <Database size={48} className="logo-icon" style={{ margin: '0 auto 1rem auto' }} />
          <h3>Comprehensive Logs</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '0.9rem' }}>Store and review every analyzed message</p>
        </div>
      </div>
    </div>
  )
}

export default Home
