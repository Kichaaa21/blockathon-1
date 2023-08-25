import React, { useState } from 'react';
import Register from './Register';
import Login from './Login';
import "./AuthForm.css";

const AuthForm = () => {
  const [isRegister, setIsRegister] = useState(true);

  const toggleForm = () => {
    setIsRegister(!isRegister);
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="toggle-btns">
          <button onClick={toggleForm} className={isRegister ? 'active' : ''}>
            Register
          </button>
          <button onClick={toggleForm} className={!isRegister ? 'active' : ''}>
            Login
          </button>
        </div>
        {isRegister ? <Register /> : <Login />}
      </div>
    </div>
  );
};

export default AuthForm;
