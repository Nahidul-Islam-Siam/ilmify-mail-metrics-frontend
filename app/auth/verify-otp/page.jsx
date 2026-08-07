'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef([]);
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e, index) => {
    const val = e.target.value;
    if (/[^0-9]/.test(val)) return; // numbers only

    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // auto-focus next
    if (val && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleResend = () => {
    setCountdown(30);
    // Trigger API call for resend here
  };

  return (
    <>
      <div className="auth-header">
        <h1>Check your email</h1>
        <p>We sent a 4-digit verification code to your email.</p>
      </div>

      <form action="/auth/reset-password">
        <div className="otp-inputs">
          {otp.map((data, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={data}
              onChange={e => handleChange(e, index)}
              onKeyDown={e => handleKeyDown(e, index)}
              ref={el => (inputs.current[index] = el)}
              required
            />
          ))}
        </div>

        <button type="submit" className="auth-btn">
          Verify OTP
        </button>
      </form>

      <div className="auth-links" style={{ justifyContent: 'center', marginTop: '32px' }}>
        <span className="sub">Didn't receive the code? </span>
        {countdown > 0 ? (
          <span style={{ color: 'var(--slate)', marginLeft: '6px' }}>
            Resend in 00:{countdown.toString().padStart(2, '0')}
          </span>
        ) : (
          <button 
            onClick={handleResend}
            style={{ 
              background: 'none', border: 'none', 
              color: 'var(--blue-accent)', fontWeight: '600', 
              cursor: 'pointer', marginLeft: '6px', fontSize: '13.5px' 
            }}
          >
            Resend now
          </button>
        )}
      </div>
    </>
  );
}
