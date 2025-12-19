import './styles/App.css';
import { AppProvider } from './contexts/AppContext';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, lazy, useEffect } from 'react';


// Компонент для прокрутки вверх при смене страницы
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' // или 'smooth' для плавной прокрутки
    });
    
    // поддержка старых браузеров
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname]);

  return null;
}

// Ленивая загрузка компонентов 
const Main = lazy(() => import('./pages/Main/Main'));
const Enter = lazy(() => import('./pages/Enter/Enter'));
const ShortStep1Phone = lazy(() => import('./pages/Registration/ShortRegistration/steps/ShortStep1Phone'));
const ShortStep2Name = lazy(() => import('./pages/Registration/ShortRegistration/steps/ShortStep2Name'));
const Step0Phone = lazy(() => import('./pages/Registration/FullRegistration/steps/Step0Phone'));
const Step0_1Branch = lazy(() => import('./pages/Registration/FullRegistration/steps/Step0_1Branch'));
const Step1Activity = lazy(() => import('./pages/Registration/FullRegistration/steps/Step1Activity'));
const Step2FullName = lazy(() => import('./pages/Registration/FullRegistration/steps/Step2FullName'));
const Step3Passport = lazy(() => import('./pages/Registration/FullRegistration/steps/Step3Passport'));
const Step4Experience = lazy(() => import('./pages/Registration/FullRegistration/steps/Step4Experience'));
const Step5Services = lazy(() => import('./pages/Registration/FullRegistration/steps/Step5Services'));
const Step6Contacts = lazy(() => import('./pages/Registration/FullRegistration/steps/Step6Contacts'));
const MainExecutor = lazy(() => import('./pages/Main/MainExecutor'));
const MyOrders = lazy(() => import('./pages/Executor/MyOrders'));
const AllOrders = lazy(() => import('./pages/Executor/AllOrders'));
const OrderDetail = lazy(() => import('./pages/Executor/OrderDetail'));

function App() {
  return (
    <Router>
      <AppProvider>
        <ScrollToTop />

        <Suspense fallback={<div>Загрузка...</div>}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/enter" element={<Enter />} />
            <Route path="/simplified_registration_step1" element={<ShortStep1Phone />} />
            <Route path="/simplified_registration_step2" element={<ShortStep2Name />} />
            <Route path="/full_registration_step0" element={<Step0Phone />} />
            <Route path="/full_registration_step0_1" element={<Step0_1Branch/>} />
            <Route path="/full_registration_step1" element={<Step1Activity />} />
            <Route path="/full_registration_step2" element={<Step2FullName />} />
            <Route path="/full_registration_step3" element={<Step3Passport />} />
            <Route path="/full_registration_step4" element={<Step4Experience />} /> 
            <Route path="/full_registration_step5" element={<Step5Services />} />
            <Route path="/full_registration_step6" element={<Step6Contacts />} /> 
            <Route path="/main_executor" element={<MainExecutor />} />
            <Route path="/executor_my_orders" element={<MyOrders />} />
            <Route path="/executor_all_orders" element={<AllOrders />} />
            <Route path="/executor_order/:id" element={<OrderDetail />} />
          </Routes>
        </Suspense>
      </AppProvider>
    </Router>
  );
}

export default App;
