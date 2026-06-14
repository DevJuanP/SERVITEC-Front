import React, { useState } from "react";
import  "./loginRegister.css";

function Register() {
  const [usuario, setUsuario] = useState({
    nombre: "",
    correo: "",
    password: "",
  });

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Registro:", usuario);

    alert("Usuario registrado correctamente");

    setUsuario({
      nombre: "",
      correo: "",
      password: "",
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Registro de Usuario</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={usuario.nombre}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="correo"
            placeholder="Correo electrónico"
            value={usuario.correo}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={usuario.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="auth-btn">
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;