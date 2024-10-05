import 'bulma/css/bulma.min.css';
import './App.css';
import { useEffect } from 'react';
import QuizPage from './pages/QuizPage';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from './pages/HomePage';
import Map from './pages/Map';


function App() {


  useEffect(() => {
    document.documentElement.setAttribute("data-theme", "light");
  }, []);

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/homepage' element={<HomePage />} />
          <Route path='/map' element={<Map />} />
          <Route path='/quizpage/:userName' element={<QuizPage  />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
