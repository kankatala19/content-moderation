import React, { useState } from 'react'
import axios from 'axios'
import { ShieldAlert, CheckCircle, AlertTriangle, ShieldX, Loader2 } from 'lucide-react'

const Moderation = () => {
  const [text, setText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

  const analyzeText = async (content) => {
    if (!content.trim()) {
      setResult(null)
      return
    }
    
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/analyze`, { text: content })
      setResult(response.data)
    } catch (error) {
      console.error('Error analyzing text:', error)
      setResult({ category: 'Error', confidence: 0 })
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = () => {
    analyzeText(text)
  }

  const getIcon = (category) => {
    switch (category) {
      case 'Safe': return <CheckCircle size={48} style={{ color: 'var(--safe)', margin: '0 auto 1rem auto' }} />
      case 'Toxic': return <ShieldAlert size={48} style={{ color: 'var(--toxic)', margin: '0 auto 1rem auto' }} />
      case 'Spam': return <AlertTriangle size={48} style={{ color: 'var(--spam)', margin: '0 auto 1rem auto' }} />
      case 'Profanity': return <ShieldX size={48} style={{ color: 'var(--profanity)', margin: '0 auto 1rem auto' }} />
      default: return null
    }
  }

  return (
    <div className="mod-grid">
      <div className="glass panel">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Input Message {loading && <Loader2 size={18} className="logo-icon" style={{ animation: 'spin 1s linear infinite' }} />}
        </h2>
        <textarea
          className="text-area"
          placeholder="Type or paste a message here to analyze..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        <button className="btn" onClick={handleAnalyze} disabled={loading}>
          {loading ? 'Analyzing...' : 'Analyze Text'}
        </button>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Analysis runs only when you click Analyze Text.
        </p>
      </div>
      
      <div className="glass panel">
        <h2 style={{ marginBottom: '1.5rem' }}>Analysis Result</h2>
        
        {!result && !loading && (
          <div className="result-empty">
            <ShieldAlert size={48} style={{ opacity: 0.5 }} />
            <p>Waiting for input...</p>
          </div>
        )}
        
        {loading && !result && (
          <div className="result-empty">
            <Loader2 size={48} style={{ opacity: 0.5, animation: 'spin 1s linear infinite' }} />
            <p>Analyzing...</p>
          </div>
        )}
        
        {result && (
          <div style={{ textAlign: 'center', paddingTop: '2rem' }}>
            {getIcon(result.category)}
            <div className={`status-badge status-${result.category}`}>
              {result.category}
            </div>
            
            <div style={{ marginTop: '2rem', textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Confidence Score</span>
                <span style={{ fontWeight: 'bold' }}>{result.confidence.toFixed(2)}%</span>
              </div>
              <div className="confidence-bar-bg">
                <div 
                  className="confidence-bar-fill" 
                  style={{ 
                    width: `${result.confidence}%`,
                    background: `var(--${result.category.toLowerCase()})`
                  }}
                ></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', fontSize: '0.95rem' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Severity Score</span>
                <span style={{ fontWeight: 'bold' }}>
                  {typeof result.severity === 'number' ? `${result.severity.toFixed(2)}%` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Moderation
