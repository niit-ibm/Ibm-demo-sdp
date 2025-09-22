import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from 'recharts';

const WatsonFMChat = () => {
  const conversationPairs = [
    {
      question: "A patient just got discharged from Ward 5B. Are any cleaning staff available nearby?",
      answer: "Yes, Claire from Environmental Services is currently available and is 3 minutes away. Should I assign her this task?"
    },
    {
      question: "Yes, assign Claire. Also, show me the average turnaround time for 5B rooms last week.",
      answer: "The average turnaround time was 41 minutes. Three rooms were delayed due to staff unavailability."
    },
    {
      question: "A patient discharged from Ward 3A tested positive for MRSA. What cleaning steps do we follow?",
      answer: "For MRSA cases:\n- Use hydrogen peroxide misting\n- Clean all high-touch surfaces\n- Use biohazard disposal for linens\nWould you like to assign the cleaning team trained in infection control?"
    },
    {
      question: "Yes, assign the cleaning team trained in infection control, and log the action for the infection control audit record.",
      answer: "Task assigned. Estimated time: 60 minutes. Logged under infection control audit record."
    },
    {
      question: "The dialysis machine in Room R203 is not powering on. What is its maintenance status?",
      answer: "Unit RX203 was last serviced 8 months ago. It is under warranty. Error reported: \"No power.\" The nearest biomedical technician is Raj 10 minutes away. Assign task?"
    },
    {
      question: "Yes, assign it to Raj.",
      answer: "Task assigned. Issue logged and tagged for warranty follow-up."
    },
    {
      question: "Why there were fewer attendants on Tuesday?",
      answer: "Staffing was lower on Tuesday because two attendants were on approved leave, and one shift wasn't filled due to a late update to the schedule."
    },
    {
      question: "Thanks. Please flag this to the shift supervisor to review.",
      answer: "I've flagged the staffing issue to the shift supervisor and noted it in the daily summary log. Let me know if you'd like to notify anyone else?"
    },
    {
      question: "Send this conversation report to the day shift supervisor.",
      answer: "The conversation report has been successfully shared with the supervisor and logged for future reference. Let me know if you'd like to send it to anyone else?"
    }
    // {
    //   question: "Generate a report of incomplete high-priority FM tasks from the past 7 days.",
    //   answer: "12 high-priority tasks were logged. 3 were delayed over 2 hours.\nReasons:\n• Staff shortage (2)\n• Incorrect request routing (1)\nWould you like a PDF report?"
    // },
    // {
    //   question: "Yes, download the report.",
    //   answer: "Report generated. You can access it in your dashboard or email."
    // },
    // {
    //   question: "A new cleaner wants to know how to mark a task as completed. Can you help?",
    //   answer: "Yes.\nIn the FM mobile app:\n\nOpen your assigned task\n\nTap 'Complete'\n\nOptionally add notes or photos\n\nSubmit. The system will auto-log the completion."
    // },
    // {
    //   question: "Thanks, please send that to the night shift group chat.",
    //   answer: "Message sent with instructions. Let me know if you'd like a quick-start PDF too."
    // }
  ];

  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Hi! I’m FM Assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [step, setStep] = useState(0);
  const [showDashboard, setShowDashboard] = useState(false);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = input.trim();
    const expectedQuestion = conversationPairs[step]?.question;

    setMessages(prev => [...prev, { sender: 'user', text: userMsg }]);

    if (expectedQuestion && userMsg === expectedQuestion) {
      const reply = conversationPairs[step].answer;
      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      setStep(step + 1);
    } else {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: 'Please follow the simulation script step-by-step.'
      }]);
    }

    setInput('');
  };

  const renderReport = () => (
    <div style={styles.reportPanel}>
      <h3>Conversation Report</h3>
      <div style={styles.reportText}>
        {messages.map((msg, idx) => (
          <div key={idx}>
            <b>[{msg.sender === 'user' ? 'You' : 'FM Assistant'}]:</b> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );

  const dashboardData = [
    { day: 'Mon', Vacant: 10, Occupied: 30, Attendants: 6 },
    { day: 'Tue', Vacant: 8, Occupied: 32, Attendants: 5 },
    { day: 'Wed', Vacant: 12, Occupied: 28, Attendants: 7 },
    { day: 'Thu', Vacant: 9, Occupied: 31, Attendants: 6 },
    { day: 'Fri', Vacant: 14, Occupied: 26, Attendants: 8 },
    { day: 'Sat', Vacant: 15, Occupied: 25, Attendants: 7 },
    { day: 'Sun', Vacant: 11, Occupied: 29, Attendants: 6 },
  ];

  const renderDashboard = () => (
    <div style={styles.dashboardPanel}>
      <h3>Facility Dashboard (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dashboardData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Vacant" fill="#82ca9d" />
          <Bar dataKey="Occupied" fill="#8884d8" />
          <Bar dataKey="Attendants" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <span>Facilities Management Assistant</span>
        <div>
          <button style={styles.utilityButton} onClick={() => setShowDashboard(prev => !prev)}>📊 Dashboard</button>
          <button style={styles.utilityButton} onClick={() => setShowReport(prev => !prev)}>📋Report</button>
          <button style={styles.utilityButton} onClick={() => window.location.reload()}>⟳</button>
        </div>
      </div>

      <div style={styles.chatBox}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              ...styles.message,
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              background: msg.sender === 'user' ? '#D0E2FF' : '#F4F4F4'
            }}
          >
            <b>{msg.sender === 'user' ? 'You' : 'FM Assistant'}:</b><br />
            {msg.text}
          </div>
        ))}
      </div>

      {showReport && renderReport()}
      {showDashboard && renderDashboard()}

      <div style={styles.inputArea}>
        <textarea
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your next scripted question..."
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey ? (e.preventDefault(), handleSend()) : null}
        />
        <button onClick={handleSend} style={styles.button}>Send</button>
      </div>
      <div style={styles.footer}>
        <span>Built with IBM</span>&nbsp;<strong>watsonx</strong>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: 600,
    margin: '40px auto',
    border: '1px solid #ccc',
    borderRadius: 8,
    fontFamily: 'Arial',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
  },
  header: {
    backgroundColor: '#f5f7fa',
    padding: '12px 16px',
    fontSize: 16,
    fontWeight: 'bold',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  utilityButton: {
    marginLeft: 10,
    background: 'transparent',
    border: 'none',
    fontSize: 16,
    cursor: 'pointer'
  },
  chatBox: {
    padding: 16,
    height: 400,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 12
  },
  message: {
    padding: 10,
    borderRadius: 6,
    maxWidth: '80%',
    whiteSpace: 'pre-wrap',
    lineHeight: 1.4
  },
  inputArea: {
    display: 'flex',
    borderTop: '1px solid #ccc',
    borderBottom: '1px solid #ccc'
  },
  input: {
    flex: 1,
    padding: '4px 14px',
    fontSize: 14,
    border: 'none',
    resize: 'none',
    overflow: 'auto',
    fontFamily: 'inherit',
    height: 'auto',
    maxHeight: 100,
    minHeight: 40
  },
  button: {
    padding: '10px 16px',
    fontSize: 16,
    background: '#0072C3',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  },
  reportPanel: {
    padding: 16,
    backgroundColor: '#fffce6',
    borderTop: '1px solid #ccc',
    maxHeight: 300,
    overflowY: 'auto'
  },
  reportText: {
    fontSize: 14,
    lineHeight: 1.6
  },
  footer: {
    fontSize: 12,
    // textAlign: 'center',
    
    paddingTop: '0px',
    paddingRight: '8px',
    paddingBottom: '0px',
    paddingLeft: '8px',
    color: '#999',
    margin: 10
  },
  dashboardPanel: { 
    padding: 16, backgroundColor: '#eef6ff', borderTop: '1px solid #ccc' 
  }
};

export default WatsonFMChat;
