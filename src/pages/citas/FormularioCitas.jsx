import React, { useState, useEffect } from "react";
import "./citas.css";
import jsPDF from "jspdf";
import axios from "axios";

const FormularioCitas = () => {
  const today = new Date().toISOString().slice(0, 10);

  const [cita, setCita] = useState({
    asesorId: "",
    tipoCita: "",
    fechaAtencion: "",
    estado: "Pendiente",
    descripcion: ""
  });

  const [citas, setCitas] = useState();
  const [userData, setUserData] = useState(null);
  const [asesores, setAsesores] = useState([]);
  const [tiposCitas, setTiposCitas] = useState([]);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        await Promise.all([obtenerMiInfo(), obtenerAsesores(), obtenerTiposCitas()]);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };

    cargarDatosIniciales();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCita({ ...cita, [name]: value });
  };

  const agregarCita = async (token, asesorId, tipoCitaId, fechaCita, descripcion) => {
    const payload = {
      asesorId,
      tipoCitaId: Number(tipoCitaId) || tipoCitaId,
      fechaCita: fechaCita instanceof Date ? fechaCita.toISOString() : new Date(fechaCita).toISOString(),
    };

    payload.descripcion = descripcion || "";
    console.log('Payload para agregar cita:', payload);

    const result = await axios.post('http://localhost:3000/api/cita/agregarCita', payload, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return result.data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const fechaCita = cita.fechaAtencion;
      const data = await agregarCita(token, cita.asesorId, cita.tipoCita, fechaCita, cita.descripcion);
      console.log('Cita agregada:', data);
      // Aquí puedes actualizar la lista de citas si es necesario
    } catch (error) {
      console.log('Error al agregar la cita:', error);
    }
  };

  // formatea YYYY-MM-DD or Date into dd/mm/yyyy
  const formatDate = (value) => {
    if (!value) return "";
    if (typeof value === "string" && value.includes("-")) {
      const parts = value.split("-");
      if (parts.length >= 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    const d = new Date(value);
    if (isNaN(d)) return value;
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    doc.text("Resumen de citas", 10, 10);
    citas.forEach((c, i) => {
      const asesor = asesores.find((a) => a.id === Number(c.asesorId));
      const linea = `${i + 1}. ${c.nombreCliente} - ${c.dni} - ${c.correo} - ${asesor ? asesor.nombre : ""} - ${c.tipoCita} - ${formatDate(c.fechaSolicitud)} - ${formatDate(c.fechaAtencion)} - ${c.estado} - ${c.descripcion}`;
      doc.text(linea, 10, 20 + i * 10);
    });
    doc.save("citas.pdf");
  };

  const cancelarCita = (id) => {

  };



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

  const obtenerAsesores = async () => {
    try {
      const token = localStorage.getItem('token');
      const result = await axios.get('http://localhost:3000/api/user/asesores', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setAsesores(result.data.asesores);
      console.log('obtenerAsesores result:', result.data.asesores);
      return result.data.asesores;
    } catch (error) {
      console.log('Error en obtenerAsesores:', error);
      throw error;
    }
  };

  const obtenerTiposCitas = async () => {
    try {
      const result = await axios.get('http://localhost:3000/api/cita/tipoCita');
      setTiposCitas(result.data.tiposCitas);
      console.log('obtenerTiposCitas result:', result.data.tiposCitas);
      return result.data.tiposCitas;
    } catch (error) {
      console.log('Error en obtenerTiposCitas:', error);
      throw error;
    }
  };





  return (
    <div className="contenedorcc" style={{ display: "flex", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ flex: 1, minWidth: "300px" }}>
        <h2 className="titulo-cc">Registro de Citas</h2>

        <form onSubmit={handleSubmit} className="formulario-cc">
          <input type="text" name="nombreCliente" placeholder="Nombre del Cliente" value={userData?.nombre} required disabled />
          <input type="email" name="correo" placeholder="Correo electrónico" value={userData?.correo} required disabled />

          <select name="asesorId" value={cita.asesorId} onChange={handleChange} required>
            <option value="">Seleccione asesor</option>
            {asesores.map((a) => (
              <option key={a._id} value={a._id}>{a.nombre}</option>
            ))}
          </select>

          <select name="tipoCita" value={cita.tipoCita} onChange={handleChange} required>
            <option value="">Seleccione tipo de cita</option>
            {tiposCitas.map(t => (
              <option key={t._id} value={t._id}>{t.type}</option>
            ))}
          </select>

          {/* El estado se asigna automáticamente al crear la cita (Pendiente) */}

          <textarea name="descripcion" placeholder="Descripción (opcional)" value={cita.descripcion} onChange={handleChange} rows={3} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: '#333' }}>Fecha de atención:</label>
            <input type="date" name="fechaAtencion" value={cita.fechaAtencion} onChange={handleChange} style={{ padding: '8px', borderRadius: 6, border: '1px solid #ccc' }} required />
          </div>

          <button type="submit">Registrar Cita</button>
        </form>
      </div>

      <div className="reporte" style={{ flex: 3, minWidth: "500px" }}>
        <h2 className="titulo-cc">Citas Registradas</h2>
        <button className="btn-pdf" onClick={generarPDF}>Generar PDF</button>
        <div className="reporte-wrapper" style={{ marginTop: "1rem" }}>
          <table className="tabla-citas" style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Correo</th>
                <th>Asesor</th>
                <th>Fecha de atención</th>
                <th>Tipo de cita</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            {/* <tbody>
              {citas.map((c) => {
                const asesor = asesores.find((a) => a.id === Number(c.asesorId));

                return (
                  <tr key={c.id}>
                    <td>{c.nombreCliente}</td>
                    <td>{c.dni}</td>
                    <td>{c.telefono}</td>
                    <td>{c.correo}</td>
                    <td>{asesor ? asesor.nombre : ""}</td>
                    <td>{formatDate(c.fechaAtencion)}</td>
                    <td>{c.tipoCita}</td>
                    <td>{c.descripcion}</td>
                    <td>{c.estado}</td>
                    <td>
                      {c.estado !== "Cancelada" && c.estado !== "Completada" && (
                        <button style={{ background: '#c0392b', color: '#fff', padding: '6px 8px', borderRadius: 6, border: 'none', cursor: 'pointer' }} onClick={() => cancelarCita(c.id)}>Cancelar</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>*/}
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormularioCitas;
