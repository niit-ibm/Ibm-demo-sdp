import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import RegisterPage from './components/RegisterPage';
import SuccessPage from './components/SuccessPage';
import UsersPage from './components/UsersPage';

function App() {
  const [user, setUser] = useState({ phone: '', email: '' });
  
  return (
    <Routes>
      <Route path="/" element={<RegisterPage setUser={setUser} />} />
      <Route path="/success" element={<SuccessPage user={user} />} />
      <Route path="/users" element={<UsersPage  />} />
    </Routes>
  );
}

export default App;