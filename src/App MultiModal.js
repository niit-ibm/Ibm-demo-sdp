import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [imageFile, setImageFile] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [countdown, setCountdown] = useState(0);

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setResponseData(null);
  };

  const handleSubmit = async (type) => {
    if (!imageFile) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);

    let endpoint = '';
    let delay = 0;

    if (type === 'text') {
      endpoint = 'http://localhost:5000/text-only';
      delay = 10;
      setLoadingMessage('Processing image with Text Model (10s)...');
    } else if (type === 'image') {
      endpoint = 'http://localhost:5000/image-only';
      delay = 10;
      setLoadingMessage('Processing image with Image Model (10s)...');
    } else {
      endpoint = 'http://localhost:5000/multimodal';
      delay = 5;
      setLoadingMessage('Processing image with Multimodal Model (5s)...');
    }

    setLoading(true);
    setCountdown(delay);
    setResponseData(null);

    try {
      const res = await axios.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Wait for delay before setting result
      setTimeout(() => {
        setResponseData(res.data);
        setLoading(false);
      }, delay * 1000);
    } catch (err) {
      setTimeout(() => {
        setResponseData({ error: `Error: ${err.message}` });
        setLoading(false);
      }, delay * 1000);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (loading && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, loading]);

  return (
    <div className="app-container">
      <div className="card">
        <h1 className="title">Plant Disease Diagnosis</h1>

        <div className="input-group">
          <label htmlFor="imageUpload" className="select-btn">
            Select/Upload Plant Image
          </label>
          <input
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden-file-input"
          />
          {imageFile && <p className="file-name">Selected: {imageFile.name}</p>}
        </div>

        <div className="button-group">
          <button onClick={() => handleSubmit('text')} className="btn red">
            Submit to Text Model
          </button>
          <button onClick={() => handleSubmit('image')} className="btn blue">
            Submit to Image Model
          </button>
          <button onClick={() => handleSubmit('multi')} className="btn green">
            Submit to Multimodal Model
          </button>
          <button onClick={() => setShowVisualization(!showVisualization)} className="btn gray">
            Visualize Models
          </button>
        </div>

        {loading && (
          <p className="loading-text">
            ⏳ {loadingMessage} <br />
            ⌛ {countdown}s remaining...
          </p>
        )}

        {responseData && !loading && (
          <div className="response-box">
            <strong>Model Response:</strong>
            <pre>{responseData.response || responseData.error || 'No response received.'}</pre>

            {responseData.embedding_origin === "text" && (
              <p style={{ color: 'red' }}>🟥 Embedding Type: Text-only Model</p>
            )}
            {responseData.embedding_origin === "image" && (
              <p style={{ color: 'blue' }}>🟦 Embedding Type: Image-only Model</p>
            )}
            {responseData.embedding_origin === "multimodal" && (
              <p style={{ color: 'green' }}>🟩 Embedding Type: Multimodal Model</p>
            )}
          </div>
        )}

        {showVisualization && (
          <div className="visualization-box">
            <img
              src={process.env.PUBLIC_URL + '/embedding_plot.jpg'}
              alt="Model Embedding Visualization"
              style={{
                width: '100%',
                maxWidth: '500px',
                marginTop: '20px',
                border: '1px solid #ccc',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
