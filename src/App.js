import { Routes, Route } from "react-router-dom"; // Убрали BrowserRouter
import Main from "./pages/Main/Main";
import { AuthProvider } from "./features/AuthContext";
import Register from "./pages/Form/Register";
import Login from "./pages/Form/Login";
import Verific from "./pages/Form/Verific";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LessonPageStudent from "./pages/Lesson/LessonPage";
import StudentDashboard from "./pages/Student/StudentDashboard";
import TeacherDashboard from "./pages/Teacher/TeacherDashboard";
import LessonPage from "./pages/Lesson/Lesson";

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verific" element={<Verific />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/lesson/:lessonId" element={<LessonPageStudent />} />
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/lesson/:lessonId" element={<LessonPage />} />
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
