import './App.scss';
import { useState } from "react";
import { Form, Button, TextArea } from '@carbon/react';
import axios from 'axios';
import { Tabs, Tab, Box, Typography } from '@mui/material';


const REACT_APP_apikey = "grSs_Cnm9RqAwL_6jiY-u1o6zYyhWxJxU6xq7rIv3x7_"
const REACT_APP_nlu_url = "https://api.us-south.natural-language-understanding.watson.cloud.ibm.com/instances/b66c46ec-4895-4c3c-80fd-e3e6f719109c"

function App() {
  const [data, setData] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [analysisResult, setAnalysisResult] = useState("");
  const [tabValue, setTabValue] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showTabs, setShowTabs] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!data.trim()) {
      setKeywords([]);
      setCategories([]);
      setShowTabs(false);
      return;
    }

    const payload = {
      text: data,
      features: {
        keywords: {},
        categories: {}
      }
    };

    axios.post(`${REACT_APP_nlu_url}/v1/analyze?version=2022-04-07`, payload, {
      headers: { 'Content-Type': 'application/json' },
      auth: { username: 'apikey', password: REACT_APP_apikey }
    })
      .then(response => {
        if (response.data.keywords) {
          const extractedKeywords = response.data.keywords.map(keyword => ({
            text: keyword.text,
            relevance: keyword.relevance
          }));
          setKeywords(extractedKeywords);
        } else {
          setKeywords([]);
        }
        if (response.data.categories) {
          const extractedCategories = response.data.categories.map(category => ({
            label: category.label,
            score: category.score
          }));
          setCategories(extractedCategories);
        } else {
          setCategories([]);
        }
        setShowTabs(true);
      })
      .catch(error => {
        console.error("API Error: ", error);
        setKeywords([]);
        setCategories([]);
        setShowTabs(false);
      });
  };
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="App">
      <h1 className="title">Natural Language Understanding<br />Text Analyzation Engine</h1>
      <div className="Form-box">
        <Form className="search-form" onSubmit={handleSubmit}>
          <label>Enter Text to be Analyzed:</label>
          <TextArea
            className="custom-textarea"
            rows={10}
            placeholder="Enter text here..."
            value={data}
            onChange={(e) => setData(e.target.value)}

          />
          <Button className="search-btn" type="submit">Analyze</Button>
        </Form>
      </div>
      {/* <label className="results-label">Results</label> */}
      {showTabs && (
        <Box sx={{ width: '96%', typography: 'body1', backgroundColor: 'white', borderRadius: '8px', padding: '20px', marginBottom: '20px', marginLeft: '38px' }}>
          <Tabs value={tabValue} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
            <Tab label="Extraction" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
            <Tab label="Classification" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }} />
          </Tabs>

          <Box sx={{ marginTop: '20px' }}>
            {tabValue === 0 && (
              <Typography component="div">
                {keywords.length > 0 ? (
                  <div className="keywords-table">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ fontSize: '24px', fontWeight: 'bold', padding: '8px', textAlign: 'center' }}>Keyword</th>
                          <th style={{ fontSize: '24px', fontWeight: 'bold', padding: '8px', textAlign: 'center' }}>Relevance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keywords.map((item, index) => (
                          <tr key={index}>
                            <td style={{ fontSize: '24px', padding: '8px',textAlign: 'center'}}>{item.text}</td>
                            <td style={{ fontSize: '24px', padding: '8px', textAlign: 'center' }}>{item.relevance.toFixed(6)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No keywords found. Please analyze text.</p>
                )}
              </Typography>
            )}

            {tabValue === 1 && ( // Display for Classification Tab
              <Typography component="div">
                {categories.length > 0 ? (
                  <div className="categories-table">
                    <table>
                      <thead>
                        <tr>
                          <th style={{ fontSize: '24px', fontWeight: 'bold', padding: '8px', textAlign: 'center', width: '50%', }}>Hierarchy</th>
                          <th style={{ fontSize: '24px', fontWeight: 'bold', padding: '8px', textAlign: 'center', width: '50%',}}>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categories.map((item, index) => (
                          <tr key={index}>
                            <td style={{ fontSize: '24px', padding: '8px',textAlign: 'center'}}>{item.label}</td>
                            <td style={{ fontSize: '24px', padding: '8px',textAlign: 'center'}}>{item.score.toFixed(6)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p>No categories found. Please analyze text.</p>
                )}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </div>
  );
}


export default App;