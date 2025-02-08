import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Main from "./pages/Main/Main";
import Lesson from "./pages/Lesson/Lesson";
import Russian from "./pages/Exam/Russian/Russian";
import Level from "./components/level/Level";
import { useState } from "react";
import Year from "./components/type/Year";
import { AuthProvider } from "./features/AuthContext";
import Register from "./pages/Form/Register";
import Login from "./pages/Form/Login";
import Verific from "./pages/Form/Verific";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google"; // Import the provider

function App() {
  const [userName, setUserName] = useState("");

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      {" "}
      {/* Wrap the entire app with GoogleOAuthProvider */}
      <AuthProvider>
        <Router>
          <ToastContainer />
          <Routes>
            <Route path="/" element={<Main setUserName={setUserName} />} />
            <Route path="/lesson" element={<Lesson userName={userName} />} />
            <Route path="/russian" element={<Russian userName={userName} />} />
            <Route path="/level" element={<Level userName={setUserName} />} />
            <Route path="/type" element={<Year userName={setUserName} />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verific" element={<Verific />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
