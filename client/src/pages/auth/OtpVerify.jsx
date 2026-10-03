import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OtpVerify() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your email';
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    const int = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(int);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if(otp.length === 6) {
      navigate('/auth/pending');
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
        <p className="text-sm text-muted-foreground">We sent a 6-digit verification code to <span className="font-medium text-foreground">{email}</span></p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <input 
            required 
            maxLength={6}
            value={otp} 
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} 
            className="field-input text-center text-2xl tracking-[0.5em] font-mono" 
            placeholder="000000" 
          />
        </div>
        
        <button type="submit" disabled={otp.length !== 6} className="w-full inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50">
          Verify Email
        </button>
      </form>
      
      <div className="text-center text-sm">
        {timer > 0 ? (
          <span className="text-muted-foreground">Resend code in {timer}s</span>
        ) : (
          <button onClick={() => setTimer(60)} className="font-medium text-primary hover:underline">Resend code</button>
        )}
      </div>
    </div>
  );
}
