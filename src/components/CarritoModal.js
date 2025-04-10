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

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * (item.cantidad || 1),
    0
  );

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose} // Esto permite cerrar haciendo clic fuera
    >
      <div
        className="modal-dialog modal-lg"
        onClick={(e) => e.stopPropagation()} // Esto evita que el click en el interior cierre el modal
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Tu carrito</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {carrito.length === 0 ? (
              <p>El carrito está vacío.</p>
            ) : (
              <ul className="list-group">
                {carrito.map((item) => (
                  <li
                    key={item.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {item.nombre}
                    <span>
                      ${item.precio} x {item.cantidad || 1}
                    </span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminarDelCarrito(item.id)}
                    >
                      Quitar
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="modal-footer">
            <strong>Total: ${total}</strong>
            <button
              className="btn btn-success"
              onClick={() => {
                alert("Compra simulada realizada ✅");
                vaciarCarrito();
                onClose(); // 👈 Esto asegura que se cierre
              }}
            >
              Finalizar compra
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
