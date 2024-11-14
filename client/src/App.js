import React from "react";
import Home from './components/student/Home';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter as Router, Route, Routes ,useLocation } from 'react-router-dom';
import Navbar from "./components/student/Navbar";
import Locations from "./components/student/Locations";
import Category from "./components/student/Category";
import Courses from "./components/student/Courses";
import Chats from "./components/student/Chats";
import Alerts from "./components/student/Alerts";
import Profile from "./components/student/Profile";
import Resume from "./components/student/Resume";
import Login from './components/student/auth/Login';
import Main from "./components/common/Main";
import Signup from "./components/student/auth/Signup";
import SignupRecruit from "./components/recruiter/auth/Signup";
import LoginRecruit from "./components/recruiter/auth/Login"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import RecruiterDash from "./components/recruiter/RecruiterDash";
import RecNavbar from "./components/recruiter/RecNavbar";
import RecProfile from "./components/recruiter/RecProfile";
import RecruiterHome from "./components/recruiter/RecruiterHome";
import RecPosting from "./components/recruiter/RecPosting";
import Internships from "./components/student/Internships";
import MyApplications from "./components/student/MyApplications";
import RecDashboard from "./components/recruiter/RecDashboard";
import Applicants from "./components/recruiter/Applicants";
import RecChatRoom from "./components/recruiter/RecChatRoom";
import ApplicationDetails from "./components/recruiter/ApplicationDetails";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminDashboard from "./components/Admin/AdminDashboard";
import RecPricing from "./components/recruiter/RecPricing";
import Footer from "./components/common/Footer";
import About from "./components/common/About";
import Contact from "./components/common/Contact";
import Privacy from "./components/common/Privacy";
import Terms from "./components/common/Terms";
import Cancellation from "./components/common/Cancellation";
import HomeUniversal from "./components/common/HomeUniversal";
import NavbarUniversal from "./components/common/NavbarUniversal";
import InternDetails from "./components/student/InternDetails";
import InternshipsUniversal from './components/common/InternshipsUniversal'
// import forgetPassword from "./components/common/forgetPassword";
// import ForgetPassword from "./components/common/ForgetPassword";
import ForgetPasswordRecruiter from "./components/common/ForgetPasswordRecruiter";
import ForgetPasswordStudent from "./components/common/ForgetPasswordStudent";


// import InternshipDetails from "./components/student/InternshipDetails";



//import broswerRouter for different routes





function App() {
  const location = useLocation();
  return (
    <>
      {(location.pathname === '/' || location.pathname==='/internships') && <NavbarUniversal />}
      { !location.pathname.endsWith('/signup') && !location.pathname.endsWith('/login') && location.pathname !== '/' && location.pathname.startsWith('/student')&&  <Navbar />}
      { !location.pathname.endsWith('/signup') && !location.pathname.endsWith('/login') && location.pathname !== '/' && location.pathname.startsWith('/recruiter')&&  <RecNavbar />}
      <Routes>
        {/* <Route path="/" element={<Main />} /> */}
        {/* <Route path="/spinner" element={<Spinner />} /> */}
        <Route path="/" element={<HomeUniversal/>}/>
        <Route path="/internships" element={<InternshipsUniversal/>}/>

        <Route path="/student/signup" element={<Signup />} />
        <Route path="/student/login" element={<Login />} />
        <Route path="/student/dashboard/:userId" element={<Home />} />
        <Route path="/student/resume/:userId" element={<Resume />} />
        <Route path="/student/locations" element={<Locations />} />
        <Route path="/student/category" element={<Category />} />
        <Route path="/student/courses" element={<Courses />} />
        <Route path="/student/:studentId/chats" element={<Chats />} />
        <Route path="/student/alerts" element={<Alerts />} />
        <Route path="/student/Resume" element={<Resume />} />
        <Route path="/student/profile/:userId" element={<Profile />} />
        <Route path="/student/internships/:userId" element={<Internships />} />
        <Route path="/student/myApplications/:userId" element={<MyApplications />} />
        <Route path="/internshipDetails/:internshipId" element={<InternDetails />} />
       
        


        
        <Route path="/recruiter/signup" element={<SignupRecruit/>} />
        <Route path="/recruiter/login" element={<LoginRecruit/>} />
        <Route path="/recruiter/home/:userId" element={<RecruiterHome/>} />
        <Route path="/recruiter/profile/:userId" element={<RecProfile/>} />
        <Route path="/recruiter/dashboard/:userId" element={<RecDashboard/>} />
        <Route path="/recruiter/dashboard/:recruiterId/applicants/:internshipId" element={<Applicants/>} />
        <Route path="/recruiter/posting/:userId" element={<RecPosting/>} />
        <Route path="/recruiter/:recruiterId/chatroom" element={<RecChatRoom/>} />
        <Route path="/recruiter/:internshipId/application-details/:studentId" element={<ApplicationDetails/>} />
        <Route path="/recruiter/:recruiterId/pricing" element={<RecPricing/>} />

        <Route path="/adminLogin$$$" element={<AdminLogin/>} />
        <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        
        <Route path='/about-us' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/privacy-policy' element={<Privacy/>}/>
        <Route path='/terms-conditions' element={<Terms/>}/>
        <Route path='/Cancellation' element={<Cancellation/>}/>
        <Route path='/recruiter/forget-pass' element={<ForgetPasswordRecruiter/>}/>
        <Route path='/student/forget-pass' element={<ForgetPasswordStudent/>}/>
        
      </Routes>
      <Footer />
      <ToastContainer
      autoClose={1500}
      position="top-center"

      />
      </>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
      
    </Router>
  );
}
