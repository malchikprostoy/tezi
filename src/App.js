import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import Main from "./pages/Main/Main";
import Lesson from "./pages/Lesson/Lesson";
import Russian from "./pages/Exam/Russian/Russian";
import { useState } from "react";


function App() {

  const [userName, setUserName] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main setUserName={setUserName}/>}/>
        <Route path="/lesson" element={<Lesson userName={userName}/>}/>
        <Route path="/russian" element={<Russian userName={userName}/>} />
      </Routes>
    </Router>
  );
}

export default App;
