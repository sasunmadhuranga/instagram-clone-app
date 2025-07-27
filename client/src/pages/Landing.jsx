import Login from './Login'; 
import Logo from '../assets/images/instagram.png';

const Landing = () => (
  <div className="h-screen flex flex-row justify-center items-center bg-gray-100 gap-12 px-8">
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold mb-6 text-gray-600">Instagram</h1>
      <img src={Logo} alt="Logo" className="w-[300px]" />
    </div>
    <div className="w-full max-w-md">
      <Login />
    </div>
  </div>
);
export default Landing;
