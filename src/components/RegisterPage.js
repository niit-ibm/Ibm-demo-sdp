import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/register1', {
        phone,
        email
      });

      // Optional: check status or response data
      if (response.status === 200) {
        // Navigate to success page with state
        navigate('/success', {
          state: { phone, email }
        });
      } else {
        console.error('Registration failed:', response.data);
        // Show error message to user
      }
    } catch (error) {
      console.error('API Error:', error);
      // Handle error: show error message to user
    }

    // // Navigate to success page with state
    // navigate('/success', {
    //   state: { phone, email }
    // });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Register</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          placeholder="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={styles.input}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
          required
        />
        <button type="submit" style={styles.button}>Register</button>
      </form>
      <p style={styles.linkText}>
        <Link to="/users" style={styles.link}>View all users</Link>
      </p>
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    maxWidth: '400px',
    margin: '80px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  heading: {
    marginBottom: '20px',
    color: '#333'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #aaa'
  },
  button: {
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer'
  }
};

export default RegisterPage;