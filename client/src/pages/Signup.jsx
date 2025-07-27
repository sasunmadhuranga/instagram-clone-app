import { useState } from 'react';
import InputField from '../components/InputField';
import { Link, useNavigate } from 'react-router-dom';
import Logotext from '../assets/images/instagramlogo.png';

const Signup = () => {
  const [form, setForm] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullname || !form.username || !form.email || !form.password) {
      setMessage("All fields are required");
      setIsError(true);
      return;
    }

    const trimmedForm = {
      fullname: form.fullname.trim(),
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedForm.email)) {
      setMessage("Please enter a valid email");
      setIsError(true);
      return;
    }

    navigate("/signup/birthday", { state: trimmedForm });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm p-6 bg-white rounded shadow-md"
      >
        <div className="flex justify-center items-center">
          <img src={Logotext} className="h-[100px]" alt="logo" />
        </div>

        {message && (
          <p
            className={`text-sm mb-4 text-center ${
              isError ? "text-red-500" : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}

        <InputField
          label="Full Name"
          type="text"
          name="fullname"
          value={form.fullname}
          onChange={handleChange}
        />

        <InputField
          label="Username"
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
        />

        <InputField
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <InputField
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Sign Up
        </button>

        <h1 className="mt-4 text-center">
          Have an account?{" "}
          <Link
            to="/login"
            className="text-blue-500 font-bold hover:underline"
          >
            Log in
          </Link>
        </h1>
      </form>
    </div>
  );
};

export default Signup;
