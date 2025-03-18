import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  const url_backend = 'http://localhost:8000';

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLogin) {
      // Login logic
      try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);
        
        const response = await fetch(`${url_backend}/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: formData,
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Store token in localStorage if needed for future use
          localStorage.setItem('token', data.access_token);
          
          // Redirect immediately to ema.co
          window.location.href = 'https://www.ema.co/';
        } else {
          setMessage(data.detail || 'Login failed');
        }
      } catch (error) {
        setMessage('Error connecting to server');
        console.error(error);
      }
    } else {
      // Register logic
      try {
        console.log("Attempting to register:", { username, email, password });
        
        const response = await fetch(`${url_backend}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        });
        
        console.log("Response status:", response.status);
        
        // Try to get the response text even if it's not valid JSON
        const responseText = await response.text();
        console.log("Response text:", responseText);
        
        // Try to parse as JSON if possible
        let data;
        try {
          data = JSON.parse(responseText);
          console.log("Response data:", data);
        } catch (e) {
          console.error("Error parsing response as JSON:", e);
        }
        
        if (response.ok) {
          setMessage('Registration successful! Please login.');
          setIsLogin(true);
        } else {
          setMessage(data?.detail || 'Registration failed: ' + responseText);
        }
      } catch (error) {
        console.error("Error details:", error);
        setMessage('Error connecting to server: ' + error.message);
      }
    }
  };

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${url_backend}/users/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUserData(null);
    setUsername('');
    setPassword('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Simple Login System</h1>
        
        <div className="auth-container">
          <div className="auth-toggle">
            <button 
              className={isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button 
              className={!isLogin ? 'active' : ''} 
              onClick={() => setIsLogin(false)}
            >
              Register
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            
            {!isLogin && (
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required={!isLogin} 
                />
              </div>
            )}
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <button type="submit" className="submit-btn">
              {isLogin ? 'Login' : 'Register'}
            </button>
            
            {message && <div className="message">{message}</div>}
          </form>
        </div>
      </header>
    </div>
  );
}

export default App;
