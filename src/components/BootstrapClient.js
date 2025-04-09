"use client";

import { useEffect } from "react";

export default function BootstrapClient() {
  useEffect(() => {
    // Importar dinámicamente el bundle solo del lado del cliente
    import("bootstrap/dist/js/bootstrap.bundle.min");
  }, []);

  return null;
}
