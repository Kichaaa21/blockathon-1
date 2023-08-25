import React from 'react';
import "./Register.css";

const Register = () => {
  return (
    <div className="regform">
      <h2 className='regTitle'>Register</h2>
      <div className="inputArea">
      <input className='regInt' type="text" placeholder="Username" />
      </div>
      <div className="inputArea">
      <input className='regInt' type="password" placeholder="Password" />
      </div>
      <div className="inputArea">
      <input className='regInt' type="text" placeholder="Refer Code" />
      </div>
      <button className='regBtn'>Register</button>
      
    </div>
  );
};

export default Register;
