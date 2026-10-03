import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    password: '',
    confirm: ''
  });

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if(formData.password !== formData.confirm) {
      alert("Passwords do not match!");
      return;
    }
    // Mock navigating to OTP
    navigate('/auth/otp', { state: { email: formData.email } });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Create workspace</h1>
        <p className="text-sm text-muted-foreground">Enter your company details to get started.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Company Name</label>
          <input required name="companyName" value={formData.companyName} onChange={handleChange} className="field-input" placeholder="Acme Engineering Ltd." />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Contact Name</label>
          <input required name="contactName" value={formData.contactName} onChange={handleChange} className="field-input" placeholder="John Doe" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Work Email</label>
          <input required type="email" name="email" value={formData.email} onChange={handleChange} className="field-input" placeholder="john@acme.com" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Password</label>
          <input required type="password" name="password" value={formData.password} onChange={handleChange} className="field-input" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Confirm Password</label>
          <input required type="password" name="confirm" value={formData.confirm} onChange={handleChange} className="field-input" />
        </div>
        <button type="submit" className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Register Company
        </button>
      </form>
      
      <div className="text-center text-sm">
        Already registered? <Link to="/auth/login" className="font-medium text-primary hover:underline">Log in</Link>
      </div>
    </div>
  );
}
