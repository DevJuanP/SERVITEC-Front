import React, { useState, useEffect } from "react";
import "./citas.css";
import { asesores } from "./asesores";
import { citasData } from "./citasData";
import jsPDF from "jspdf";

const FormularioCitas = () => {
  const today = new Date().toISOString().slice(0, 10);

  const [cita, setCita] = useState({
    nombreCliente: "",
    nroCliente: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCita({ ...cita, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nuevo = { ...cita, id: Date.now() };
    // si hubiera backend, aquí haríamos POST; por ahora añadimos directamente
    setCitas((prev) => [...prev, nuevo]);
    citasData.push(nuevo); // mantener sincronizado el arreglo precargado
    alert("Cita registrada correctamente ");
    setCita({
      nombreCliente: "",
      nroCliente: "",
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
      const linea = `${i + 1}. ${c.nroCliente} - ${c.nombreCliente} - ${c.dni} - ${c.correo} - ${asesor ? asesor.nombre : ""} - ${c.tipoCita} - ${formatDate(c.fechaSolicitud)} - ${formatDate(c.fechaAtencion)} - ${c.estado} - ${c.descripcion}`;
      doc.text(linea, 10, 20 + i * 10);
    });
    doc.save("citas.pdf");
  };

  return (
    <div className="contenedorcc" style={{ display: "flex", gap: "2rem", maxWidth: "1200px", margin: "0 auto" }}>
      <div style={{ flex: 1, minWidth: "300px" }}>
        <h2 className="titulo-cc">Registro de Citas</h2>

        <form onSubmit={handleSubmit} className="formulario-cc">
          <input type="text" name="nombreCliente" placeholder="Nombre del Cliente" value={cita.nombreCliente} onChange={handleChange} required />
          <input type="text" name="nroCliente" placeholder="Nro. de Cliente" value={cita.nroCliente} onChange={handleChange} required />
          <input type="email" name="correo" placeholder="Correo electrónico" value={cita.correo} onChange={handleChange} required />
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
            <input type="text" name="fechaSolicitud" value={formatDate(cita.fechaSolicitud)} readOnly style={{ background: '#f5f5f5', padding: '8px', borderRadius: 6, border: '1px solid #ccc' }} />
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
