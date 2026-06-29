import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { citasData } from "../citas/citasData";
import { asesores } from "../citas/asesores";
import "./CitaAdmin.css";

export const CitaAdmin = () => {
  
  const [formData, setFormData] = useState({
    nombreCliente: "",
    clienteId: "",
    tipoCita: "",
    fechaAtencion: "",
    descripcion: "",
  });

  const [citas, setCitas] = useState(citasData);
  const [clients, setClients] = useState([]); // lista de clientes traidos por búsqueda
  const [emailSearch, setEmailSearch] = useState("");
  const [tiposCitasList, setTiposCitasList] = useState([]);
  const [userData, setUserData] = useState(null);

  const citasFiltradas = citas || [];

  const cancelarCitaAction = (id) => {
    setCitas((prev) => prev.map((cita) => cita.id === id ? { ...cita, estado: 'cancelado' } : cita));
  };

  const completarCitaAction = (id) => {
    setCitas((prev) => prev.map((cita) => cita.id === id ? { ...cita, estado: 'Completada' } : cita));
  };

  const buscarPorCorreo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/user/clientesPorCorreo/${encodeURIComponent(emailSearch)}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const list = response.data.clientes || response.data.usuarios || response.data || [];
      setClients(Array.isArray(list) ? list : []);
      return list;
    } catch (error) {
      console.error('Error buscarPorCorreo:', error);
      setClients([]);
      return [];
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  const obtenerMiInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const result = await axios.get('http://localhost:3000/api/user/myInfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(result.data.usuario);
      console.log('obtenerMiInfo result:', result.data.usuario);
      return result.data.usuario;
    } catch (error) {
      console.log('Error en obtenerMiInfo:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:3000/api/cita/crear', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Cita registrada con éxito");
      // Limpiar el formulario
      setFormData({
        nombreCliente: "",
        clienteId: "",
        tipoCita: "",
        fechaAtencion: "",
        descripcion: "",
      });
    } catch (err) {
      console.error('Error registrando cita:', err);
      alert("Error al registrar cita");
    }
  };


  return (
    <div className="admin-citas-container">
      <div className="admin-citas-card">
        <div className="admin-citas-header">
          <div>
            <h1 className="admin-citas-title">Gestión de Citas</h1>
            <p className="admin-citas-subtitle">Administra, filtra y elimina citas desde este panel.</p>
          </div>

          {/*(
          <div className="admin-citas-search">
            <label htmlFor="buscarFecha">Buscar por fecha</label>
            <input
              id="buscarFecha"
              type="date"
              value={busquedaFecha}
              onChange={(e) => setBusquedaFecha(e.target.value)}
            />
          </div>
          
          )*/}
        </div>
          <div className="admin-citas-grid">
          <form className="admin-citas-form" onSubmit={handleSubmit}>
            <h3>Registrar cita</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="email"
                name="emailSearch"
                placeholder="Buscar cliente por correo"
                value={emailSearch}
                onChange={(e) => setEmailSearch(e.target.value)}
              />
              <button type="button" className="admin-citas-btn" onClick={buscarPorCorreo}>Buscar</button>
            </div>

            <select name="clienteId" value={formData.clienteId} onChange={(e) => {
              const selected = clients.find(c => String(c._id || c.id || c.email) === e.target.value);
              setFormData(prev => ({ ...prev, clienteId: e.target.value, nombreCliente: selected ? (selected.nombre || selected.name || selected.email) : '' }));
            }}>
              <option value="">Seleccione cliente</option>
              {clients.map((c) => (
                <option key={c._id || c.id || c.email} value={c._id || c.id || c.email}>{(c.nombre || c.name) + ' — ' + (c.correo || c.email)}</option>
              ))}
            </select>

            <select name="tipoCita" value={formData.tipoCita} onChange={handleChange}>
              <option value="">Seleccione tipo de cita</option>
              {tiposCitasList.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>{t.type || t.name}</option>
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
            {(!citas || citas.length) === 0 ? (
              <div className="admin-citas-empty">No hay citas registradas.</div>
            ) : (
              <table className="admin-citas-table">
                <thead>
                      <tr>
                        <th>Asesor</th>
                        <th>Cliente</th>
                        <th>Correo cliente</th>
                        <th>Tipo de cita</th>
                        <th>Estado</th>
                        <th>Fecha de la cita</th>
                        <th>Descripción</th>
                        <th>Acción</th>
                      </tr>
                </thead>
                <tbody>
                      {citasFiltradas?.map((cita) => {
                        const asesor = asesores.find((item) => item.id === Number(cita.asesorId));
                        return (
                          <tr key={cita.id}>
                            <td>{asesor ? asesor.nombre : "Sin asesor"}</td>
                            <td>{cita.nombreCliente}</td>
                            <td>{cita.correo || cita.clienteCorreo || '-'}</td>
                            <td>{cita.tipoCita || cita.tipo || '-'}</td>
                            <td>{cita.estado || '-'}</td>
                            <td>{cita.fechaAtencion}</td>
                            <td>{cita.descripcion}</td>
                            <td style={{ display: 'flex', gap: 6 }}>
                              <button
                                className="admin-citas-btn"
                                onClick={() => cancelarCitaAction(cita.id)}
                                disabled={cita.estado === 'cancelado' || cita.estado === 'Completada'}
                              >
                                Cancelar
                              </button>
                              <button
                                className="admin-citas-btn"
                                onClick={() => completarCitaAction(cita.id)}
                                disabled={cita.estado === 'Completada' || cita.estado === 'cancelado'}
                              >
                                Completar
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