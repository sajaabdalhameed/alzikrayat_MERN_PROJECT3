import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import PhotoDetail from './pages/PhotoDetail.jsx';
import AddPhoto from './pages/AddPhoto.jsx';
import LoginRegister from './pages/LoginRegister.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/photos" element={<Gallery />} />
          <Route path="/photos/:id" element={<PhotoDetail />} />
          <Route path="/photos/new" element={<AddPhoto />} />
          <Route path="/login" element={<LoginRegister />} />
          <Route path="*" element={<p>404 - Page Not Found</p>} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}
