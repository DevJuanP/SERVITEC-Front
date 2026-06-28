import React, { useState, useEffect } from "react";
import "./citas.css";
import { asesores } from "./asesores";
import { citasData } from "./citasData";
import jsPDF from "jspdf";

const FormularioCitas = () => {
  const today = new Date().toISOString().slice(0, 10);

  const getStoredNombre = () => {
    try {
      const keys = ["nombreUsuario", "authUserName", "user", "usuario", "usuarioNombre", "userName"];
      for (let k of keys) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          const name = (parsed && (parsed.name || parsed.nombre)) || "";
          if (name) return name;
        } catch (e) {
          // raw not JSON
          return raw;
        }
      }
    } catch (err) {
      return "";
    }
    return "";
  };

  const getStoredUserId = () => {
    try {
      const keys = ["user", "usuario", "userId", "idUsuario"];
      for (let k of keys) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          const id = (parsed && (parsed.id || parsed._id || parsed.userId)) || "";
          if (id) return id;
        } catch (e) {
          // raw not JSON, might be an id string
          return raw;
        }
      }
    } catch (err) {
      return null;
    }
    return null;
  };

  const getStoredEmail = () => {
    try {
      const keys = ["correo", "email", "userEmail", "correoUsuario", "authEmail", "usuario"];
      for (let k of keys) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          const email = (parsed && (parsed.email || parsed.correo || parsed.usuario || parsed.mail)) || "";
          if (email) return email;
          // if parsed itself may be a user object with 'nombre' and 'correo'
          if (parsed && typeof parsed === 'object') {
            if (parsed.correo) return parsed.correo;
            if (parsed.email) return parsed.email;
          }
        } catch (e) {
          // raw not JSON, might be the email string
          return raw;
        }
      }
    } catch (err) {
      return "";
    }
    return "";
  };

  const [cita, setCita] = useState({
    nombreCliente: "",
    correo: "",
    dni: "",
    telefono: "",
    asesorId: "",
    tipoCita: "",
    fechaSolicitud: today,
    fechaAtencion: "",
    estado: "Pendiente",
    descripcion: ""
  });

  const [citas, setCitas] = useState(citasData);

  useEffect(() => {
    // inicializar desde arreglo predefinido
    setCitas(citasData);
  }, []);

  useEffect(() => {
    const nombre = getStoredNombre();
    const userId = getStoredUserId();
    const token = localStorage.getItem("token");
    const email = getStoredEmail();
    if (nombre) setCita((prev) => ({ ...prev, nombreCliente: nombre }));
    // solo establecer correo si hay sesión (token) o hay nombre de usuario
    if (token || nombre) {
      if (email) setCita((prev) => ({ ...prev, correo: email }));
    }

    // cargar citas del usuario desde API (preparado para MongoDB)
    const cargar = async () => {
      try {
        // Preferir buscar por userId si existe, si no usar nombre
        let url = null;
        if (userId) {
          url = `/api/citas?userId=${encodeURIComponent(userId)}`;
        } else if (nombre) {
          url = `/api/citas?nombre=${encodeURIComponent(nombre)}`;
        }

        if (url && (token || nombre)) {
          const res = await fetch(url);
          if (res.ok) {
            const data = await res.json();
            setCitas(data);
            return;
          }
        }
      } catch (err) {
        // si falla la llamada a la API, continuamos con el fallback
      }

      // fallback: filtrar `citasData` local para sólo mostrar las citas del usuario
      if (nombre) {
        setCitas(citasData.filter((c) => c.nombreCliente === nombre));
      } else {
        setCitas(citasData);
      }
    };

    cargar();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCita({ ...cita, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = getStoredUserId();
    const nuevo = { ...cita, id: Date.now(), userId: userId || null };
    // si hubiera backend, aquí haríamos POST; por ahora añadimos directamente
    setCitas((prev) => [...prev, nuevo]);
    citasData.push(nuevo); // mantener sincronizado el arreglo precargado
    alert("Cita registrada correctamente ");
    const nombreAfter = getStoredNombre();
    const correoAfter = getStoredEmail();
    const tokenAfter = localStorage.getItem("token");
    setCita({
      nombreCliente: nombreAfter || "",
      correo: (tokenAfter || nombreAfter) ? (correoAfter || "") : "",
      dni: "",
      telefono: "",
      asesorId: "",
      tipoCita: "",
      fechaSolicitud: today,
      fechaAtencion: "",
      estado: "Pendiente",
      descripcion: ""
    });
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
    setCitas((prev) => prev.map((c) => (c.id === id ? { ...c, estado: "Cancelada" } : c)));
    // aquí se puede añadir llamada a una API para persistir el cambio en MongoDB
  };

  return (
    <div className="contenedorcc" style={{ display: "flex", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ flex: 1, minWidth: "300px" }}>
        <h2 className="titulo-cc">Registro de Citas</h2>

        <form onSubmit={handleSubmit} className="formulario-cc">
          <input type="text" name="nombreCliente" placeholder="Nombre del Cliente" value={cita.nombreCliente} onChange={handleChange} required disabled />
          <input type="email" name="correo" placeholder="Correo electrónico" value={cita.correo} onChange={handleChange} required disabled />
          <input type="text" name="dni" placeholder="DNI" value={cita.dni} onChange={handleChange} maxLength="8" required />
          <input type="tel" name="telefono" placeholder="Número de Teléfono" value={cita.telefono} onChange={handleChange} required />

          <select name="asesorId" value={cita.asesorId} onChange={handleChange} required>
            <option value="">Seleccione asesor</option>
            {asesores.map((a) => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>

          <select name="tipoCita" value={cita.tipoCita} onChange={handleChange} required>
            <option value="">Seleccione tipo de cita</option>
            <option value="Presencial">Presencial</option>
            <option value="Virtual">Virtual</option>
          </select>

          {/* El estado se asigna automáticamente al crear la cita (Pendiente) */}

          <textarea name="descripcion" placeholder="Descripción (opcional)" value={cita.descripcion} onChange={handleChange} rows={3} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 12, color: '#333' }}>Fecha de solicitud</label>
            <input type="date" name="fechaSolicitud" value={cita.fechaSolicitud} onChange={handleChange} style={{ padding: '8px', borderRadius: 6, border: '1px solid #ccc' }} required />
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
                <th>DNI</th>
                <th>Teléfono</th>
                <th>Correo</th>
                <th>Asesor</th>
                <th>Fecha de atención</th>
                <th>Tipo de cita</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FormularioCitas;
