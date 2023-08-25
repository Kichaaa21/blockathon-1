import React from 'react';
import "./Login.css";

const Login = () => {
  return (
    <div className="loginform">
      <h2 className='loginTitle'>Login</h2>
      <div className="inputArea">
      <input className='loginInt' type="text" placeholder="Username" />
      </div>
      <div className="inputArea">
      <input className='loginInt' type="password" placeholder="Password" />
      </div>
      <button className='loginBtn'>Login</button>
      
    </div>
  );
};

export default Login;
