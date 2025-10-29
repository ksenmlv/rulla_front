import './styles/App.css';
import Main from './pages/Main/Main';
import { AppProvider } from './contexts/AppContext';
import Enter from './pages/Enter/Enter';
import ShortStep1Phone from './pages/Registration/ShortRegistration/steps/ShortStep1Phone'
import ShortStep2Name from './pages/Registration/ShortRegistration/steps/ShortStep2Name'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <AppProvider>

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/enter" element={<Enter />} />
          <Route path="/simplified_registration_step1" element={<ShortStep1Phone />} />
          <Route path="/simplified_registration_step2" element={<ShortStep2Name />} />
        </Routes>
        
      </AppProvider>
    </Router>
  )
}

export default App;
