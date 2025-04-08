const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProductos() {
  try {
    const res = await fetch(`${API_URL}/api/productos`);
    if (!res.ok) throw new Error("Error en la respuesta del servidor");
    return await res.json();
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
}
