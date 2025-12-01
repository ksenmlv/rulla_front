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
const Step1_2Branch = lazy(() => import('./pages/Registration/FullRegistration/steps/Step1_2Branch'));
const Step2Activity = lazy(() => import('./pages/Registration/FullRegistration/steps/Step2Activity'));
const Step3FullName = lazy(() => import('./pages/Registration/FullRegistration/steps/Step3FullName'));
const Step4Passport = lazy(() => import('./pages/Registration/FullRegistration/steps/Step4Passport'));
const Step5Experience = lazy(() => import('./pages/Registration/FullRegistration/steps/Step5Experience'));
const Step6Services = lazy(() => import('./pages/Registration/FullRegistration/steps/Step6Services'));
const Step7Contacts = lazy(() => import('./pages/Registration/FullRegistration/steps/Step7Contacts'));

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
            <Route path="/full_registration_step1_2" element={<Step1_2Branch/>} />
            <Route path="/full_registration_step2" element={<Step2Activity />} />
            <Route path="/full_registration_step3" element={<Step3FullName />} />
            <Route path="/full_registration_step4" element={<Step4Passport />} />
            <Route path="/full_registration_step5" element={<Step5Experience />} /> 
            <Route path="/full_registration_step6" element={<Step6Services />} />
            <Route path="/full_registration_step7" element={<Step7Contacts />} /> 
          </Routes>
        </Suspense>
      </AppProvider>
    </Router>
  );
}

export default App;
