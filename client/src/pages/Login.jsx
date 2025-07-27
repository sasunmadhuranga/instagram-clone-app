import {useState} from 'react';
import InputField from '../components/InputField';
import {Link, useNavigate} from 'react-router-dom';
import Logotext from '../assets/images/instagramlogo.png';
const Login = () =>{
    const [form, setForm] = useState({identifier: "", password: ""});
    const [message, setMessage] = useState(null);
    const [isError, setIsError] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) =>setForm({...form, [e.target.name]: e.target.value});

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!form.identifier.trim() || !form.password.trim()) {
            setMessage("Both fields are required.");
            setIsError(true);
            return;
            }
        
        try{
            const res = await fetch("http://localhost:5000/api/auth/login",{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(form),
            });
            const data = await res.json();
            //console.log("Received login data:", data);

            if(res.ok){
                //console.log("Received login data:", data);
                setMessage("Logging in successfully!")
                setIsError(false);
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        token: data.token,
                        ...data.user,
                    })
                );

                setTimeout(() => navigate("/feed"), 1000);
            }
            else{
                setMessage(data.msg || "Login failed");
                setIsError(true);
            }
        }catch(error){
            setMessage("Server error. Try again.")
            setIsError(true);
        }
        
    };

    return(
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-sm p-6 bg-white rounded shadow-md">
                <div className="flex justify-center items-center">
                    <img src={Logotext} className="h-[100px]" alt="logo"></img>
                </div>
                {message && (
                    <p className={`text-sm mb-4 text-center ${isError ? "text-red-500" : "text-green-600"}`}>
                        {message}
                    </p>
                )}

                <InputField
                label="Username or Email"
                type="text"
                name="identifier"
                value={form.identifier}
                onChange={handleChange}
                />
                
                <InputField
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                />
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">Login</button>
                <h1 className="mt-4 text-center">
                    Don't have an account? <Link to="/signup" className="text-blue-500 font-bold hover:underline">Sign Up</Link>
                </h1>
            </form>
        </div>
    );
};
export default Login;