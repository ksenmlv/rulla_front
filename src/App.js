import './styles/App.css';
import Main from './pages/Main/Main';
import { AppProvider } from './contexts/AppContext';
import Enter from './pages/Enter/Enter';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router>
      <AppProvider>

        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/enter" element={<Enter />} />
        </Routes>
        
      </AppProvider>
    </Router>
  )
}

export default App;
