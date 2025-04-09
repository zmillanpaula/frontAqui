"use client";
import React from "react";

export default function CarritoModal({
  show,
  onClose,
  carrito,
  eliminarDelCarrito,
  vaciarCarrito,
}) {
  if (!show) return null;

  const handleFinalizarCompra = () => {
    alert("Compra finalizada (simulada)");
    vaciarCarrito();
    onClose();
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)", zIndex: 1050 }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tu carrito</h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {carrito.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              <ul className="list-group">
                {carrito.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{item.nombre}</strong> - ${item.precio}
                    </div>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      Eliminar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
            {carrito.length > 0 && (
              <button
                className="btn btn-success"
                onClick={handleFinalizarCompra}
              >
                Finalizar compra
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
