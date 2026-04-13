import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import Habitaciones from './pages/Habitaciones';
import PersonalizarHabitacion from './pages/PersonalizarHabitacion';
import Resumen from './pages/Resumen';
import Contacto from './pages/Contacto';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-white text-stone-900">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/habitaciones" element={<Habitaciones />} />
            <Route path="/personalizar" element={<PersonalizarHabitacion />} />
            <Route path="/resumen" element={<Resumen />} />
            <Route path="/contacto" element={<Contacto />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
