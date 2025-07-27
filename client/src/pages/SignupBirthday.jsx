import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Logotext from '../assets/images/instagramlogo.png';

const SignupBirthday = () => {
  const { state } = useLocation();
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!state) {
      navigate('/signup');
    }
  }, [state, navigate]);

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { name: 'January', value: '01' }, { name: 'February', value: '02' }, { name: 'March', value: '03' },
    { name: 'April', value: '04' }, { name: 'May', value: '05' }, { name: 'June', value: '06' },
    { name: 'July', value: '07' }, { name: 'August', value: '08' }, { name: 'September', value: '09' },
    { name: 'October', value: '10' }, { name: 'November', value: '11' }, { name: 'December', value: '12' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleSubmit = async (e) => {
    

    e.preventDefault();
    if (!day || !month || !year) {
      setMessage('Please select your full birthday');
      setIsError(true);
      return;
    }

    const birthday = `${year}-${month}-${String(day).padStart(2, '0')}`;
    console.log("Submitting full data:", { ...state, birthday });
    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...state, birthday }),
      });
      const data = await res.json();

      if (res.ok) {
        setMessage("Account created successfully. Please log in.");
        setIsError(false);
        navigate('/login');
      } else {
        setMessage(data.msg || 'Signup failed');
        setIsError(true);
      }

    } catch (err) {
      setMessage('Server error');
      setIsError(true);
    }
  };

  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-100 pt-20">

      <form onSubmit={handleSubmit} className="w-full max-w-sm p-10 bg-white rounded shadow-md">
        <div className="flex justify-center items-center">
            <img src={Logotext} className="h-[100px]" alt="logo"></img>
        </div>

        {message && (
          <p className={`text-sm mb-4 text-center ${isError ? 'text-red-500' : 'text-green-600'}`}>
            {message}
          </p>
        )}

        <div className="flex space-x-2 mb-4">
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            <option value="">Day</option>
            {days.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>

          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            <option value="">Month</option>
            {months.map((m) => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-1/3 border p-2 rounded"
          >
            <option value="">Year</option>
            {years.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Create Account
        </button>
        <h1 className= "mt-4 text-center">
                    Have an account? <Link to="/login" className="text-blue-500 font-bold hover:underline">Log in</Link>
        </h1>
      </form>
    </div>
  );
};
export default SignupBirthday;
