import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Signup from './pages/Signup';
import SignupBirthday from './pages/SignupBirthday';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import ProtectedLayout from './components/ProtectedLayout';
import ProfileSection from './components/Profile/ProfileSection';
import PasswordSection from './components/Profile/PasswordSection';
import PersonalSection from './components/Profile/PersonalSection';

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<Landing/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup/birthday" element={<SignupBirthday/>}/>
        <Route element={<ProtectedLayout />}>
          <Route path="/feed" element={<Feed />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/editprofile/*" element={<EditProfile/>}>
            <Route index element={<Navigate to="profiles" replace />} />
            <Route path="profiles" element={<ProfileSection/>}/>
            <Route path="password" element={<PasswordSection/>}/>
            <Route path="personal" element={<PersonalSection/>}/>
            <Route/>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}
export default App;