import './styles/App.css';
import { AppProvider } from './contexts/AppContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Ленивая загрузка компонентов (убедитесь, что пути корректны!)
const Main = lazy(() => import('./pages/Main/Main'));
const Enter = lazy(() => import('./pages/Enter/Enter'));
const ShortStep1Phone = lazy(() => import('./pages/Registration/ShortRegistration/steps/ShortStep1Phone'));
const ShortStep2Name = lazy(() => import('./pages/Registration/ShortRegistration/steps/ShortStep2Name'));
const Step1Phone = lazy(() => import('./pages/Registration/FullRegistration/steps/Step1Phone'));
const Step2Activity = lazy(() => import('./pages/Registration/FullRegistration/steps/Step2Activity'));

function App() {
  return (
    <Router>
      <AppProvider>
        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/enter" element={<Enter />} />
            <Route path="/simplified_registration_step1" element={<ShortStep1Phone />} />
            <Route path="/simplified_registration_step2" element={<ShortStep2Name />} />
            <Route path="/full_registration_step1" element={<Step1Phone />} />
            <Route path="/full_registration_step2" element={<Step2Activity />} />
            {/*<Route path="/full_registration_step3" element={<Step3Passport />} />
            <Route path="/full_registration_step4" element={<Step4FullName />} />
            <Route path="/full_registration_step5" element={<Step5Experience />} />
            <Route path="/full_registration_step6" element={<Step6Service />} />
            <Route path="/full_registration_step7" element={<Step7Contacts />} /> */}
          </Routes>
        </Suspense>
      </AppProvider>
    </Router>
  );
}

export default App;
