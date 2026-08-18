import { Landing } from "@/components/landing/landing";

/**
 * La web pública de J&C Comex.
 *
 * Acá vive solamente la landing: el software del estudio corre en otro
 * dominio, así que este sitio no tiene sesión, ni API, ni base de datos.
 * Es una página estática con la misma identidad visual del portal.
 */
export default function Home() {
  return <Landing />;
}
