import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './pages/App.tsx'
import ImageUpload from './pages/ImageUpload.tsx';
import ImagenPrueba from './pages/ImagenPrueba.tsx';
import Login from './pages/Login.tsx'
import './index.css'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom'
import Register from './pages/Register.tsx'
import { GoogleOAuthProvider } from '@react-oauth/google'
import RegistroRapido from './pages/RegistroRapido.tsx'
import EditProfile from './pages/EditProfile.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId='707624544355-tt3o1jqfblee1ciqmcvu2plhuitc26b7.apps.googleusercontent.com'>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/registroRapido" element={<RegistroRapido/>} />
        <Route path="/subirImagenes" element={<ImageUpload/>} />
<<<<<<< HEAD
        <Route path="/imagenprueba" element={<ImagenPrueba/>}/>
=======
        <Route path="/editProfile" element={<EditProfile/>} />
>>>>>>> 4032a93df3ea796b8ba775a4a4cd096499bac636
      </Routes>
    </Router>
    </GoogleOAuthProvider>
  </StrictMode>,
)