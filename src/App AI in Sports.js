// App.jsx
import React, { useState } from 'react';
import './App.css';
import axios from 'axios';

const tools = [
  'Win Prediction',
  'Player Statistics',
  'Shot Efficiency',
  'Top Moments',
  'Set Summary',
  'Live Prediction'
];

export default function App() {
  const [messages, setMessages] = useState([
    { role: 'bot', content: 'Hi! Use the buttons to explore Wimbledon match analytics powered by AI.' }
  ]);
  const [input, setInput] = useState('');

  // For Win Prediction Button
  const [showWinPredictionModal, setShowWinPredictionModal] = useState(false);
  const [prediction, setPrediction] = useState({ percentage: 0, reasoning: '' });

  // For Player Statistics Button
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [playerStats, setPlayerStats] = useState('');

  // For Shot Efficiency Button
  const [showShotEfficiencyModal, setShowShotEfficiencyModal] = useState(false);
  const [shotEfficiency, setShotEfficiency] = useState('');

  // For Top Moments Button
  const [showTopMomentsModal, setShowTopMomentsModal] = useState(false);
  const [topMoments, setTopMoments] = useState('');

  // For Set Summary Button
  const [showSetSummaryModal, setShowSetSummaryModal] = useState(false);
  const [setSummary, setSetSummary] = useState('');

  // For Live Prediction Button
  const [showLivePredictionModal, setShowLivePredictionModal] = useState(false);
  const [livePrediction, setLivePrediction] = useState({
    headers: [],
    rows: []
  });

  const sendMessage = async (customInput) => {
    const query = customInput || input;
    if (!query.trim()) return;

    const userMessage = { role: 'user', content: query };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/query', {
        question: query
      });
      const botMessage = { role: 'bot', content: res.data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: 'Failed to fetch response from backend.' }]);
    }
  };

  const handleToolClick = async (tool) => {

    // For Win Prediction Button
    if (tool === 'Win Prediction') {
      try {
        const res = await axios.post('http://localhost:5000/query', {
          question: tool
        });
        setPrediction({
          percentage: res.data.predictionPercentage || 74,
          reasoning: res.data.reasoning || 'Based on serve efficiency, past 5 match form, and current momentum.'
        });
        setShowWinPredictionModal(true);
      } catch (error) {
        alert('Failed to fetch prediction.');
        console.log("error = ", error);
      }
    }
    // For Player Statistics Button
    else if (tool === 'Player Statistics') {
      try {
        const res = await axios.post('http://localhost:5000/query', {
          question: tool
        });
        setPlayerStats(res.data.answer);
        setShowStatsModal(true);
      } catch (error) {
        alert('Failed to fetch player statistics.');
      }
    }
    // For Shot Efficiency Button
    else if (tool === 'Shot Efficiency') {
      try {
        const res = await axios.post('http://localhost:5000/query', {
          question: tool
        });
        setShotEfficiency(res.data.efficiencyTable);
        setShowShotEfficiencyModal(true);
      } catch (error) {
        alert('Failed to fetch player statistics.');
      }
    }
    // For Top Moments Button
    else if (tool === 'Top Moments') {
      try {
        const res = await axios.post('http://localhost:5000/query', {
          question: tool
        });
        setTopMoments(res.data.moments || []);
        setShowTopMomentsModal(true);
      } catch (error) {
        alert('Failed to fetch player statistics.');
      }
    }
    // For Set Summary Button
    else if (tool === 'Set Summary') {
      try {
        const res = await axios.post('http://localhost:5000/query', {
          question: tool
        });
        setSetSummary(res.data.setSummary || { headers: [], rows: [] });
        setShowSetSummaryModal(true);
      } catch (error) {
        alert('Failed to fetch set summary.');
      }
    }
    // For Live Prediction Button
    else if (tool === 'Live Prediction') {
      try {
        const res = await axios.post('http://localhost:5000/query', {
          question: tool
        });
        setLivePrediction(res.data.answer || { headers: [], rows: [] });
        setShowLivePredictionModal(true);
      } catch (error) {
        alert('Failed to fetch set summary.');
      }
    }
    else {
      const userMessage = { role: 'user', content: tool };
      setMessages(prev => [...prev, userMessage]);

      try {
        const res = await axios.post('http://localhost:5000/query', {
          question: tool
        });
        const botMessage = { role: 'bot', content: res.data.answer };
        setMessages(prev => [...prev, botMessage]);
      } catch (error) {
        setMessages(prev => [...prev, { role: 'bot', content: 'Failed to fetch response from backend.' }]);
      }
    }
  };

  const closeModal = () => setShowWinPredictionModal(false);

  return (
    <div className="app">
      <div className="sidebar">
        <h3 className="sidebar-title">🎯 AI Tools</h3>
        {tools.map(tool => (
          // <button className="sidebar-btn" key={tool} onClick={() => sendMessage(tool)}>{tool}</button>
          <button className="sidebar-btn" key={tool} onClick={() => handleToolClick(tool)}>{tool}</button>
        ))}
      </div>

      <div className="chat">
        <h2 className="chat-header">🎾 Wimbledon watsonx Assistant</h2>
        <div className="chat-window">
          {messages.map((msg, i) => (
            <div key={i} className={`msg ${msg.role}`}>
              <strong>{msg.role === 'bot' ? 'Watsonx' : 'You'}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="input-box">
          <input
            value={input}
            placeholder="Ask about score, aces, performance..."
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={() => sendMessage()}>Send</button>
        </div>
      </div>

      {/*Win Prediction */}
      {showWinPredictionModal && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeModal}>×</button>
            <h3>Win Prediction</h3>
            <div className="bar-container" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '20px', marginBottom: '20px' }}>
              <span style={{ minWidth: '60px' }}>Player A</span>
              <div style={{ flex: 1, height: '25px', backgroundColor: '#e0e0e0', borderRadius: '6px', overflow: 'hidden', position: 'relative' }}>
                <div
                  style={{
                    width: `${prediction.percentage}%`,
                    height: '100%',
                    backgroundColor: '#28a745',
                    color: 'white',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '8px'
                  }}
                >
                  {prediction.percentage}%
                </div>
              </div>
              <span style={{ minWidth: '60px', textAlign: 'right' }}>Player B</span>
            </div>
            <div style={{ textAlign: 'center' }}>
              <button className="reasoning-btn">Reasoning</button>
            </div>
          </div>
        </div>
      )}

      {/* Player Statistics */}
      {showStatsModal && (
        <div className="modal-overlay">
          <div className="modal" style={{
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: '600px',
            margin: 'auto',
            position: 'relative'
          }}>
            <button className="close-btn" onClick={() => setShowStatsModal(false)} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: '#a0aec0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>×</button>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#2d3748'
            }}>📊 Player Statistics: First Serve</h3>

            <div style={{
              backgroundColor: '#f7fafc',
              padding: '18px',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#4a5568',
              lineHeight: '1.6'
            }}>
              <ul style={{ paddingLeft: '20px' }}>
                <li>{playerStats}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Shot Efficiency */}
      {showShotEfficiencyModal && (
        <div className="modal-overlay">
          <div className="modal" style={{
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: '600px',
            margin: 'auto',
            position: 'relative'
          }}>
            <button className="close-btn" onClick={() => setShowShotEfficiencyModal(false)} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: '#a0aec0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>×</button>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#2d3748'
            }}>📊 Shot Efficiency</h3>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '16px',
              color: '#4a5568'
            }}>
              <thead>
                <tr>
                  {shotEfficiency.headers.map((header, idx) => (
                    <th key={idx} style={{
                      borderBottom: '2px solid #cbd5e0',
                      padding: '10px',
                      textAlign: 'left'
                    }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shotEfficiency.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cidx) => (
                      <td key={cidx} style={{
                        borderBottom: '1px solid #e2e8f0',
                        padding: '10px'
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Top Moments */}
      {showTopMomentsModal && (
        <div className="modal-overlay">
          <div className="modal" style={{
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: '600px',
            margin: 'auto',
            position: 'relative'
          }}>
            <button className="close-btn" onClick={() => setShowTopMomentsModal(false)} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: '#a0aec0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>×</button>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#2d3748'
            }}>📊 Top Moments</h3>

            <ol style={{
              paddingLeft: '20px',
              backgroundColor: '#f7fafc',
              padding: '18px',
              borderRadius: '8px',
              fontSize: '16px',
              color: '#4a5568',
              lineHeight: '1.8'
            }}>
              {topMoments.map((moment, index) => {
                const [boldPart, ...rest] = moment.split(':');
                return (
                  <li key={index} style={{ marginBottom: '10px' }}>
                    <strong>{boldPart}:</strong>{rest.join(':')}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}


      {/* Set Summary */}
      {showSetSummaryModal && (
        <div className="modal-overlay">
          <div className="modal" style={{
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: '600px',
            margin: 'auto',
            position: 'relative'
          }}>
            <button className="close-btn" onClick={() => setShowSetSummaryModal(false)} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: '#a0aec0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>×</button>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#2d3748'
            }}>📊 Summary</h3>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '16px',
              color: '#4a5568'
            }}>
              <thead>
                <tr>
                  {setSummary.headers.map((header, idx) => (
                    <th key={idx} style={{
                      borderBottom: '2px solid #cbd5e0',
                      padding: '10px',
                      textAlign: 'left'
                    }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {setSummary.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cidx) => (
                      <td key={cidx} style={{
                        borderBottom: '1px solid #e2e8f0',
                        padding: '10px'
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* Live Prediction */}
      {showLivePredictionModal && (
        <div className="modal-overlay">
          <div className="modal" style={{
            borderRadius: '12px',
            backgroundColor: '#ffffff',
            padding: '30px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            maxWidth: '600px',
            margin: 'auto',
            position: 'relative'
          }}>
            <button className="close-btn" onClick={() => setShowLivePredictionModal(false)} style={{
              position: 'absolute',
              top: '15px',
              right: '15px',
              backgroundColor: '#a0aec0',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              width: '30px',
              height: '30px',
              fontSize: '16px',
              cursor: 'pointer'
            }}>×</button>

            <h3 style={{
              fontSize: '20px',
              fontWeight: '700',
              marginBottom: '20px',
              color: '#2d3748'
            }}>📊 Live Prediction Shift</h3>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '16px',
              color: '#4a5568'
            }}>
              <thead>
                <tr>
                  {livePrediction.headers.map((header, idx) => (
                    <th key={idx} style={{
                      borderBottom: '2px solid #cbd5e0',
                      padding: '10px',
                      textAlign: 'left'
                    }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {livePrediction.rows.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, cidx) => (
                      <td key={cidx} style={{
                        borderBottom: '1px solid #e2e8f0',
                        padding: '10px'
                      }}>{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}


