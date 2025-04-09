"use client";
import { useEffect, useState } from "react";

export default function MiCuentaPage() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  });
  const [erroresUsuario, setErroresUsuario] = useState({});

  const [vendedorForm, setVendedorForm] = useState({
    nombreTienda: "",
    descripcionTienda: "",
    direccionTienda: "",
    telefonoContacto: "",
  });
  const [mostrarFormularioVendedor, setMostrarFormularioVendedor] =
    useState(false);
  const [erroresVendedor, setErroresVendedor] = useState({});

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      const parsed = JSON.parse(usuarioStr);
      setUsuario(parsed);
      setFormData({
        nombre: parsed.nombre,
        apellido: parsed.apellido,
        direccion: parsed.direccionComprador || "",
        telefono: parsed.telefonoComprador || "",
      });
    }
  }, []);

  const handleUsuarioChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleVendedorChange = (e) => {
    setVendedorForm({ ...vendedorForm, [e.target.name]: e.target.value });
  };

  const validarUsuario = () => {
    const errores = {};
    if (formData.telefono && !/^\d{9}$/.test(formData.telefono)) {
      errores.telefono = "Debe contener exactamente 9 dígitos";
    }
    return errores;
  };

  const validarVendedor = () => {
    const errores = {};
    if (!vendedorForm.nombreTienda) {
      errores.nombreTienda = "Campo obligatorio";
    } else if (vendedorForm.nombreTienda.length > 100) {
      errores.nombreTienda = "Máximo 100 caracteres";
    }

    if (vendedorForm.descripcionTienda.length > 255) {
      errores.descripcionTienda = "Máximo 255 caracteres";
    }

    if (!vendedorForm.direccionTienda) {
      errores.direccionTienda = "Campo obligatorio";
    }

    if (!vendedorForm.telefonoContacto) {
      errores.telefonoContacto = "Campo obligatorio";
    } else if (!/^\d{9}$/.test(vendedorForm.telefonoContacto)) {
      errores.telefonoContacto = "Debe contener exactamente 9 dígitos";
    }

    return errores;
  };

  const cancelarEdicion = () => {
    setEditando(false);
    if (usuario) {
      setFormData({
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        direccion: usuario.direccionComprador || "",
        telefono: usuario.telefonoComprador || "",
      });
    }
    setErroresUsuario({});
  };

  const guardarCambiosUsuario = async () => {
    const errores = validarUsuario();
    if (Object.keys(errores).length > 0) {
      setErroresUsuario(errores);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/usuarios/${usuario.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        const actualizado = await res.json();
        localStorage.setItem("usuario", JSON.stringify(actualizado));
        setUsuario(actualizado);
        setEditando(false);
        alert("Información actualizada correctamente");
      } else {
        alert("No se pudo actualizar la información");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const guardarPerfilVendedor = async () => {
    const errores = validarVendedor();
    if (Object.keys(errores).length > 0) {
      setErroresVendedor(errores);
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/vendedores`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...vendedorForm,
            usuarioId: usuario.id,
          }),
        }
      );

      if (res.ok) {
        const creado = await res.json();
        const actualizado = { ...usuario, esVendedor: true };
        localStorage.setItem("usuario", JSON.stringify(actualizado));
        setUsuario(actualizado);
        setMostrarFormularioVendedor(false);
        alert("Perfil de vendedor creado exitosamente");
      } else {
        alert("Error al crear perfil de vendedor");
      }
    } catch (err) {
      console.error("Error al crear vendedor:", err);
    }
  };

  return (
    <>
      {/* Banner */}
      <div className="text-center mb-4">
        <img
          src="/img/banner-aquiesta.png"
          alt="AQUÍESTÁ - Encuentra lo que buscas"
          className="img-fluid"
          style={{ maxHeight: "250px", objectFit: "cover", width: "100%" }}
        />
      </div>

      {/* Botón volver al inicio */}
      <div className="d-flex justify-content-end px-4 mb-2">
        <a href="/" className="btn btn-outline-secondary btn-sm">
          Volver al inicio
        </a>
      </div>

      {/* Contenido */}
      <div className="container">
        <div className="row justify-content-center">
          {/* Card de perfil de usuario */}
          <div className="col-md-6 mb-4">
            <div className="card shadow p-4">
              <h3 className="mb-4 text-center">Mi cuenta</h3>

              {usuario && (
                <>
                  <div className="text-center mb-4">
                    <span className="fw-semibold">
                      <strong>Correo:</strong> {usuario.email}
                    </span>
                  </div>

                  <div className="mb-3">
                    <strong>Nombre:</strong>{" "}
                    {editando ? (
                      <input
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleUsuarioChange}
                        className="form-control"
                      />
                    ) : (
                      usuario.nombre
                    )}
                  </div>

                  <div className="mb-3">
                    <strong>Apellido:</strong>{" "}
                    {editando ? (
                      <input
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleUsuarioChange}
                        className="form-control"
                      />
                    ) : (
                      usuario.apellido
                    )}
                  </div>

                  <div className="mb-3">
                    <strong>Dirección:</strong>{" "}
                    {editando ? (
                      <input
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleUsuarioChange}
                        className={`form-control ${
                          erroresUsuario.direccion ? "is-invalid" : ""
                        }`}
                      />
                    ) : (
                      usuario.direccionComprador || "No registrada"
                    )}
                  </div>

                  <div className="mb-4">
                    <strong>Teléfono:</strong>{" "}
                    {editando ? (
                      <>
                        <input
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleUsuarioChange}
                          className={`form-control ${
                            erroresUsuario.telefono ? "is-invalid" : ""
                          }`}
                        />
                        {erroresUsuario.telefono && (
                          <div className="invalid-feedback">
                            {erroresUsuario.telefono}
                          </div>
                        )}
                      </>
                    ) : (
                      usuario.telefonoComprador || "No registrado"
                    )}
                  </div>

                  {editando ? (
                    <div className="d-flex gap-3">
                      <button
                        className="btn btn-primary"
                        onClick={guardarCambiosUsuario}
                      >
                        Guardar cambios
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={cancelarEdicion}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => setEditando(true)}
                    >
                      Editar información
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Card de perfil vendedor */}
          <div className="col-md-6 mb-4">
            <div className="card shadow p-4">
              <h4 className="mb-3 text-center">Perfil vendedor</h4>

              {usuario?.esVendedor ? (
                <div className="text-center">
                  <p className="text-success fw-semibold mb-3">
                    Ya tienes un perfil de vendedor activo.
                  </p>
                  <button className="btn btn-outline-primary btn-sm" disabled>
                    Administrar perfil vendedor (próximamente)
                  </button>
                </div>
              ) : mostrarFormularioVendedor ? (
                <>
                  <div className="mb-3">
                    <label className="form-label">Nombre de tienda</label>
                    <input
                      name="nombreTienda"
                      value={vendedorForm.nombreTienda}
                      onChange={handleVendedorChange}
                      className={`form-control ${
                        erroresVendedor.nombreTienda ? "is-invalid" : ""
                      }`}
                    />
                    {erroresVendedor.nombreTienda && (
                      <div className="invalid-feedback">
                        {erroresVendedor.nombreTienda}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea
                      name="descripcionTienda"
                      value={vendedorForm.descripcionTienda}
                      onChange={handleVendedorChange}
                      className={`form-control ${
                        erroresVendedor.descripcionTienda ? "is-invalid" : ""
                      }`}
                    ></textarea>
                    {erroresVendedor.descripcionTienda && (
                      <div className="invalid-feedback">
                        {erroresVendedor.descripcionTienda}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Dirección tienda</label>
                    <input
                      name="direccionTienda"
                      value={vendedorForm.direccionTienda}
                      onChange={handleVendedorChange}
                      className={`form-control ${
                        erroresVendedor.direccionTienda ? "is-invalid" : ""
                      }`}
                    />
                    {erroresVendedor.direccionTienda && (
                      <div className="invalid-feedback">
                        {erroresVendedor.direccionTienda}
                      </div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Teléfono contacto</label>
                    <input
                      name="telefonoContacto"
                      value={vendedorForm.telefonoContacto}
                      onChange={handleVendedorChange}
                      className={`form-control ${
                        erroresVendedor.telefonoContacto ? "is-invalid" : ""
                      }`}
                    />
                    {erroresVendedor.telefonoContacto && (
                      <div className="invalid-feedback">
                        {erroresVendedor.telefonoContacto}
                      </div>
                    )}
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-success"
                      onClick={guardarPerfilVendedor}
                    >
                      Guardar perfil
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => setMostrarFormularioVendedor(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center">
                  <p className="mb-3">Aún no tienes un perfil de vendedor.</p>
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => setMostrarFormularioVendedor(true)}
                  >
                    Activar perfil vendedor
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
