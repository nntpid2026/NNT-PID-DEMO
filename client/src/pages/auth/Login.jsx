import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(email === 'admin@boq.com') {
      navigate('/admin');
    } else {
      navigate('/app');
    }
  };

  const handleRevokedDemo = () => {
    navigate('/auth/revoked');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">Enter your credentials to access your workspace.</p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none">Work Email</label>
          <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" placeholder="john@acme.com" />
          <p className="text-xs text-muted-foreground">Demo: admin@boq.com for super admin</p>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium leading-none">Password</label>
            <Link to="#" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
          </div>
          <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="field-input" />
        </div>
        
        <button type="submit" className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
          Log in
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Mock Testing</span>
        </div>
      </div>

      <button onClick={handleRevokedDemo} className="w-full inline-flex h-10 items-center justify-center rounded-md border border-input bg-transparent px-4 py-2 text-sm font-medium hover:bg-secondary transition-colors">
        Test "Revoked" state
      </button>
      
      <div className="text-center text-sm">
        New company? <Link to="/auth/register" className="font-medium text-primary hover:underline">Register workspace</Link>
      </div>
    </div>
  );
}
