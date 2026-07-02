import { BrowserRouter, Routes, Route } from "react-router-dom";
import PropTypes from "prop-types";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ChatWidget from "./components/ChatWidget";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Rent from "./pages/Rent";
import Post from "./pages/Post";
import Profile from "./pages/Profile";
import MyBookings from "./pages/MyBookings";
import MyListings from "./pages/MyListings";
import PersonalityForm from "./pages/PersonalityForm";
import PersonalityResult from "./pages/PersonalityResult";
import MatchesPage from "./pages/MatchesPage";
import VRViewer from "./pages/VRViewer";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ReportIssue from "./pages/ReportIssue";
import NotFound from "./pages/NotFound";

const Layout = ({ children }) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
    <ChatWidget />
  </div>
);

Layout.propTypes = {
  children: PropTypes.node,
};

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
        <Route path="/reset-password" element={<Layout><ResetPassword /></Layout>} />
        <Route path="/rent" element={<Layout><Rent /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/contact" element={<Layout><Contact /></Layout>} />
        <Route path="/report-issue" element={<Layout><ReportIssue /></Layout>} />
        <Route path="/personality-form" element={<Layout><PersonalityForm /></Layout>} />
        <Route path="/personality-result" element={<Layout><PersonalityResult /></Layout>} />
        <Route path="/vr-viewer" element={<VRViewer />} />

        <Route path="/profile" element={<Layout><ProtectedRoute element={<Profile />} /></Layout>} />
        <Route path="/post" element={<Layout><ProtectedRoute element={<Post />} /></Layout>} />
        <Route path="/my-bookings" element={<Layout><ProtectedRoute element={<MyBookings />} /></Layout>} />
        <Route path="/my-listings" element={<Layout><ProtectedRoute element={<MyListings />} /></Layout>} />
        <Route path="/matches" element={<Layout><ProtectedRoute element={<MatchesPage />} /></Layout>} />

        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
