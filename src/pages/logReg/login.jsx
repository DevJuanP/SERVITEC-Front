import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginRegister.css";

function Login() {
  const navigate = useNavigate();
  const [datos, setDatos] = useState({
    correo: "",
    password: "",
  });

  const handleChange = (e) => {
    setDatos({
      ...datos,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(datos);
  };

  const handleRegister = () => {
    console.log("Ir a registro");
    navigate("/register");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar Sesión</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={datos.correo}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={datos.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Ingresar
          </button>

          
          <button
            type="button"
            className="auth-btn auth-btn-secondary"
            onClick={handleRegister}
          >
            ¿No tienes cuenta? Regístrate
          </button>
        </form>

        <div className="video-container">
          <iframe
            width="100%"
            height="250"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ"
            title="Video informativo"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Login;