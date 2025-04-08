"use client";
import React, { useState } from "react";

const RegistroPage = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    email: "",
    contraseña: "",
    direccionComprador: "",
    telefonoComprador: "",
  });

  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validar = () => {
    const nuevosErrores = {};

    if (!formData.nombre) nuevosErrores.nombre = "Campo obligatorio";
    if (!formData.apellido) nuevosErrores.apellido = "Campo obligatorio";
    if (!formData.email) nuevosErrores.email = "Campo obligatorio";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      nuevosErrores.email = "Correo inválido";

    if (!formData.contraseña) {
      nuevosErrores.contraseña = "Campo obligatorio";
    } else if (
      formData.contraseña.length < 6 ||
      formData.contraseña.length > 10
    ) {
      nuevosErrores.contraseña =
        "La contraseña debe tener entre 6 y 10 caracteres";
    }

    if (!formData.direccionComprador)
      nuevosErrores.direccionComprador = "Campo obligatorio";

    if (!formData.telefonoComprador) {
      nuevosErrores.telefonoComprador = "Campo obligatorio";
    } else if (!/^\d{9}$/.test(formData.telefonoComprador)) {
      nuevosErrores.telefonoComprador =
        "Debe contener exactamente 9 dígitos numéricos";
    }

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const erroresValidacion = validar();

    if (Object.keys(erroresValidacion).length > 0) {
      setErrores(erroresValidacion);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/registro`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        setMensaje("Registro exitoso");
        setFormData({
          nombre: "",
          apellido: "",
          email: "",
          contraseña: "",
          direccionComprador: "",
          telefonoComprador: "",
        });
        setErrores({});
      } else {
        const data = await res.json();
        setMensaje(data.message || "Error en el registro");
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <img
        src="/img/banner-aquiesta.png"
        alt="Banner AquíEstá"
        style={{
          width: "100%",
          maxHeight: "200px",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "2rem",
        }}
      />
      <h2 className="text-center mb-3">Crea tu cuenta</h2>
      <p className="text-center text-muted">Es gratis y rápido 😎</p>

      {mensaje && (
        <div className="alert alert-info text-center" role="alert">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {[
          { label: "Nombre", name: "nombre" },
          { label: "Apellido", name: "apellido" },
          { label: "Email", name: "email", type: "email" },
          { label: "Contraseña", name: "contraseña", type: "password" },
          { label: "Dirección", name: "direccionComprador" },
          { label: "Teléfono", name: "telefonoComprador", type: "tel" },
        ].map((field) => (
          <div className="mb-3" key={field.name}>
            <label className="form-label">{field.label}</label>
            <input
              type={field.type || "text"}
              className={`form-control ${
                errores[field.name] ? "is-invalid" : ""
              }`}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
            />
            {errores[field.name] && (
              <div className="invalid-feedback">{errores[field.name]}</div>
            )}
          </div>
        ))}

        <button type="submit" className="btn btn-primary w-100">
          Registrarse
        </button>
      </form>

      <div className="text-center mt-3">
        <a href="/" className="btn btn-link">
          ← Volver al inicio
        </a>
      </div>
    </div>
  );
};

export default RegistroPage;
