"use client";
import { useState, useEffect } from "react";

export default function LoginModal({ show, onClose }) {
  const [email, setEmail] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [verContraseña, setVerContraseña] = useState(false);
  const [errores, setErrores] = useState({});
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (!show) {
      setEmail("");
      setContraseña("");
      setVerContraseña(false);
      setErrores({});
      setMensaje("");
    }
  }, [show]);

  const validar = () => {
    const nuevosErrores = {};
    if (!email.includes("@")) nuevosErrores.email = "Correo inválido";
    if (contraseña.length < 6) nuevosErrores.contraseña = "Mínimo 6 caracteres";
    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = validar();
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, contraseña }),
        }
      );

      if (res.ok) {
        setMensaje("Login exitoso");
        onClose();
      } else {
        setMensaje("Credenciales incorrectas");
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err);
      setMensaje("Error de conexión");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">Iniciar sesión</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body px-4 pt-3">
              {mensaje && <div className="alert alert-info">{mensaje}</div>}

              <div className="mb-3">
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className={`form-control ${
                    errores.email ? "is-invalid" : ""
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errores.email && (
                  <div className="invalid-feedback">{errores.email}</div>
                )}
              </div>

              <div className="mb-3">
                <label className="form-label">Contraseña</label>
                <div className="input-group">
                  <input
                    type={verContraseña ? "text" : "password"}
                    className={`form-control ${
                      errores.contraseña ? "is-invalid" : ""
                    }`}
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setVerContraseña(!verContraseña)}
                  >
                    {verContraseña ? "Ocultar" : "Ver"}
                  </button>
                </div>
                {errores.contraseña && (
                  <div className="invalid-feedback">{errores.contraseña}</div>
                )}
              </div>
            </div>

            <div className="modal-footer px-4 d-flex justify-content-between">
              <button type="submit" className="btn btn-primary">
                Iniciar sesión
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
            </div>

            <div className="text-center pb-4">
              <span>¿No tienes cuenta? </span>
              <a href="/registro" className="text-decoration-none fw-semibold">
                Regístrate aquí
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
