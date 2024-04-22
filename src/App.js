import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Main from "./pages/Main/Main";
import Lesson from "./pages/Lesson/Lesson";
import Russian from "./pages/Exam/Russian/Russian";


function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main/>}/>
        <Route path="/lesson" element={<Lesson/>}/>
        <Route path="/russian" element={<Russian />} />
      </Routes>
    </Router>
  );
}

export default App;
