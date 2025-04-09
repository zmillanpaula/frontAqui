"use client";
import { useEffect, useState } from "react";
import LoginModal from "@/components/LoginModal";
import CarritoModal from "@/components/CarritoModal";

export default function Page() {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [filtros, setFiltros] = useState({
    categoriaId: "",
    precioMin: "",
    precioMax: "",
    nombre: "",
    color: "",
  });
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [usuarioLogueado, setUsuarioLogueado] = useState(null);
  const [carrito, setCarrito] = useState([]);
  const [showCarrito, setShowCarrito] = useState(false);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
  }, []);

  useEffect(() => {
    const usuarioStr = localStorage.getItem("usuario");
    if (usuarioStr) {
      setUsuarioLogueado(JSON.parse(usuarioStr));
    }
  }, [showModal]);

  const fetchProductos = () => {
    const params = new URLSearchParams();
    if (filtros.categoriaId) params.append("categoriaId", filtros.categoriaId);
    if (filtros.precioMin) params.append("precioMin", filtros.precioMin);
    if (filtros.precioMax) params.append("precioMax", filtros.precioMax);
    if (filtros.nombre.trim()) params.append("nombre", filtros.nombre);
    if (filtros.color.trim()) params.append("color", filtros.color);

    fetch(
      `${
        process.env.NEXT_PUBLIC_API_URL
      }/api/productos/filtrar?${params.toString()}`
    )
      .then((res) => res.json())
      .then(setProductos)
      .catch((err) => {
        console.error("Error al obtener productos:", err);
        setError("No se pudieron cargar los productos.");
      });
  };

  const fetchCategorias = () => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/categorias`)
      .then((res) => res.json())
      .then(setCategorias)
      .catch((err) => console.error("Error al obtener categorías:", err));
  };

  const handleChange = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchProductos();
  };

  const handleClear = () => {
    setFiltros({
      categoriaId: "",
      precioMin: "",
      precioMax: "",
      nombre: "",
      color: "",
    });
    fetchProductos();
  };

  const agregarAlCarrito = (producto) => {
    if (!usuarioLogueado) {
      alert("Debes iniciar sesión para agregar al carrito");
      setShowModal(true);
      return;
    }

    const yaAgregado = carrito.find((item) => item.id === producto.id);
    if (!yaAgregado) {
      setCarrito([...carrito, producto]);
    } else {
      alert("Este producto ya está en el carrito");
    }
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <>
      {/* Banner */}
      <div className="text-center mb-2">
        <img
          src="/img/banner-aquiesta.png"
          alt="AQUÍESTÁ - Encuentra lo que buscas"
          className="img-fluid"
          style={{ maxHeight: "250px", objectFit: "cover", width: "100%" }}
        />
      </div>

      {/* Barra superior */}
      {usuarioLogueado && (
        <div className="bg-light border-bottom py-2 px-4 d-flex justify-content-between align-items-center">
          <div className="fw-semibold">Hola, {usuarioLogueado.nombre} 👋</div>

          <div className="d-flex gap-2 align-items-center">
            {usuarioLogueado.esVendedor && (
              <div className="dropdown">
                <button
                  className="btn btn-outline-dark btn-sm dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Mis ventas
                </button>
                <ul className="dropdown-menu">
                  <li>
                    <a className="dropdown-item" href="/vendedor/inventario">
                      Mi inventario
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href="/vendedor/agregar-producto"
                    >
                      Agregar producto
                    </a>
                  </li>
                </ul>
              </div>
            )}
            <a href="/cuenta" className="btn btn-outline-primary btn-sm">
              Mi cuenta
            </a>
            <button
              className="btn btn-outline-danger btn-sm"
              onClick={() => {
                localStorage.removeItem("usuario");
                setUsuarioLogueado(null);
                setCarrito([]);
                alert("Sesión cerrada");
              }}
            >
              Cerrar sesión
            </button>
            <button
              className="btn btn-outline-secondary position-relative btn-sm"
              onClick={() => setShowCarrito(true)}
            >
              🛒
              {carrito.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {carrito.length}
                </span>
              )}
            </button>
          </div>
        </div>
      )}

      {!usuarioLogueado && (
        <div className="d-flex justify-content-end p-3">
          <button
            className="btn btn-outline-primary"
            onClick={() => setShowModal(true)}
          >
            Iniciar sesión
          </button>
        </div>
      )}

      {/* Contenido principal */}
      <div className="container mt-4">
        <div className="row">
          {/* Filtros laterales */}
          <aside className="col-md-3 mb-4">
            <h5>Filtros</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Categoría</label>
                <select
                  name="categoriaId"
                  className="form-select"
                  value={filtros.categoriaId}
                  onChange={handleChange}
                >
                  <option value="">Todas</option>
                  {categorias.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  className="form-control"
                  value={filtros.nombre}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Color</label>
                <input
                  type="text"
                  name="color"
                  className="form-control"
                  value={filtros.color}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Precio mínimo</label>
                <input
                  type="number"
                  name="precioMin"
                  className="form-control"
                  value={filtros.precioMin}
                  onChange={handleChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Precio máximo</label>
                <input
                  type="number"
                  name="precioMax"
                  className="form-control"
                  value={filtros.precioMax}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Aplicar filtros
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary w-100 mt-2"
                onClick={handleClear}
              >
                Limpiar filtros
              </button>
            </form>
          </aside>

          <main className="col-md-9">
            <h2>Productos disponibles</h2>
            <p className="text-muted">
              {productos.length === 0
                ? "No se encontraron productos"
                : `Se encontraron ${productos.length} producto${
                    productos.length > 1 ? "s" : ""
                  }.`}
            </p>
            {error && <p className="text-danger">{error}</p>}

            <div className="row">
              {productos.map((producto) => (
                <div className="col-md-4 mb-4" key={producto.id}>
                  <div className="card h-100">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{producto.nombre}</h5>
                      <p className="card-text">{producto.descripcion}</p>
                      <p className="fw-bold">${producto.precio}</p>
                      <button
                        className="btn btn-warning mt-auto"
                        onClick={() => agregarAlCarrito(producto)}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>

      {/* Modales */}
      <LoginModal show={showModal} onClose={() => setShowModal(false)} />
      <CarritoModal
        show={showCarrito}
        onClose={() => setShowCarrito(false)}
        carrito={carrito}
        eliminarDelCarrito={eliminarDelCarrito}
        vaciarCarrito={vaciarCarrito}
      />
    </>
  );
}
