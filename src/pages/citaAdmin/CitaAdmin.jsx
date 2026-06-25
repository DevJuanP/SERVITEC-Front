import React, { useMemo, useState } from "react";
import { citasData } from "../citas/citasData";
import { asesores } from "../citas/asesores";
import "./CitaAdmin.css";

export const CitaAdmin = () => {
  const [citas, setCitas] = useState(citasData);
  const [busquedaFecha, setBusquedaFecha] = useState("");
  const [formData, setFormData] = useState({
    nombreCliente: "",
    asesorId: "",
    fechaAtencion: "",
    descripcion: "",
  });

  const citasFiltradas = useMemo(() => {
    if (!busquedaFecha) return citas;
    return citas.filter((cita) => cita.fechaAtencion === busquedaFecha);
  }, [citas, busquedaFecha]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.nombreCliente || !formData.asesorId || !formData.fechaAtencion || !formData.descripcion) {
      alert("Completa todos los campos del formulario");
      return;
    }

    const nuevoRegistro = {
      id: Date.now(),
      nombreCliente: formData.nombreCliente,
      asesorId: formData.asesorId,
      fechaAtencion: formData.fechaAtencion,
      descripcion: formData.descripcion,
      estado: "Pendiente",
      tipoCita: "Presencial",
    };

    setCitas((prev) => [nuevoRegistro, ...prev]);
    setFormData({ nombreCliente: "", asesorId: "", fechaAtencion: "", descripcion: "" });
    alert("Cita agregada correctamente");
  };

  const eliminarCita = (id) => {
    setCitas((prev) => prev.filter((cita) => cita.id !== id));
  };

  return (
    <div className="admin-citas-container">
      <div className="admin-citas-card">
        <div className="admin-citas-header">
          <div>
            <h1 className="admin-citas-title">Gestión de Citas</h1>
            <p className="admin-citas-subtitle">Administra, filtra y elimina citas desde este panel.</p>
          </div>

          <div className="admin-citas-search">
            <label htmlFor="buscarFecha">Buscar por fecha</label>
            <input
              id="buscarFecha"
              type="date"
              value={busquedaFecha}
              onChange={(e) => setBusquedaFecha(e.target.value)}
            />
          </div>
        </div>

        <div className="admin-citas-grid">
          <form className="admin-citas-form" onSubmit={handleSubmit}>
            <h3>Registrar cita</h3>
            <input
              type="text"
              name="nombreCliente"
              placeholder="Nombre del cliente"
              value={formData.nombreCliente}
              onChange={handleChange}
              required
            />

            <select name="asesorId" value={formData.asesorId} onChange={handleChange} required>
              <option value="">Seleccione asesor</option>
              {asesores.map((asesor) => (
                <option key={asesor.id} value={asesor.id}>{asesor.nombre}</option>
              ))}
            </select>

            <input
              type="date"
              name="fechaAtencion"
              value={formData.fechaAtencion}
              onChange={handleChange}
              required
            />

            <textarea
              name="descripcion"
              placeholder="Descripción de la cita"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />

            <button className="admin-citas-btn" type="submit">Guardar cita</button>
          </form>

          <div className="admin-citas-list">
            <h3>Citas registradas</h3>
            {citasFiltradas.length === 0 ? (
              <div className="admin-citas-empty">No hay citas para la fecha seleccionada.</div>
            ) : (
              <table className="admin-citas-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Asesor</th>
                    <th>Fecha</th>
                    <th>Descripción</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {citasFiltradas.map((cita) => {
                    const asesor = asesores.find((item) => item.id === Number(cita.asesorId));
                    return (
                      <tr key={cita.id}>
                        <td>{cita.nombreCliente}</td>
                        <td>{asesor ? asesor.nombre : "Sin asesor"}</td>
                        <td>{cita.fechaAtencion}</td>
                        <td>{cita.descripcion}</td>
                        <td>
                          <button className="admin-citas-delete" onClick={() => eliminarCita(cita.id)}>
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};