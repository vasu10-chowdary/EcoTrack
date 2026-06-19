import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ToastContainer from './components/ui/Toast';
import AIAssistant from './components/chatbot/AIAssistant';
import Landing from './pages/Landing';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard';
import Recommendations from './pages/Recommendations';
import Challenges from './pages/Challenges';
import Profile from './pages/Profile';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/calculator" element={<Calculator />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/recommendations" element={<Recommendations />} />
                <Route path="/challenges" element={<Challenges />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer />
            <AIAssistant />
          </div>
        </AppProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
