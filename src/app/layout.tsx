import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DatosEstructurados } from "@/components/datos-estructurados";
import { DESCRIPCION, SITIO } from "./seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * Lo que Google y las redes leen de esta página.
 *
 * `metadataBase` es la que convierte las rutas relativas de acá abajo en URLs
 * absolutas. Sin ella, la imagen de `openGraph` se publica como `/media/og.jpg`
 * —una ruta que fuera del sitio no apunta a ninguna parte— y WhatsApp, LinkedIn
 * y X muestran el enlace pelado, sin ficha.
 *
 * El título lleva las tres palabras con las que alguien busca esto en Google
 * —despachante, aduana, Buenos Aires— y no sólo el nombre del estudio: nadie
 * que todavía no lo conoce busca «J&C Comex».
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITIO.dominio),
  title: {
    default: "Despachante de Aduana en Buenos Aires · J&C Comex",
    // Para cuando haya más páginas: cada una pone su nombre y hereda la marca.
    template: "%s · J&C Comex",
  },
  description: DESCRIPCION,
  applicationName: SITIO.nombre,
  authors: [{ name: SITIO.nombre }],
  creator: SITIO.nombre,
  publisher: SITIO.nombre,
  category: "Comercio exterior",
  /**
   * La canónica evita que el sitio compita consigo mismo. Sin ella, Google
   * puede indexar `www.` y sin `www.`, con y sin barra final, como si fueran
   * páginas distintas con el mismo contenido, y reparte entre todas la
   * autoridad que debería ir a una sola.
   */
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: "/",
    siteName: SITIO.nombreLargo,
    title: "Despachantes de Aduana en Buenos Aires · J&C Comex",
    description: DESCRIPCION,
    images: [
      {
        url: "/media/og.jpg",
        width: 1200,
        height: 630,
        alt: "J&C Comex, despachantes de aduana: un remolcador junto a un buque portacontenedores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Despachantes de Aduana en Buenos Aires · J&C Comex",
    description: DESCRIPCION,
    images: ["/media/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      // Sin techo en el largo del fragmento ni en el tamaño de la miniatura:
      // por defecto Google recorta ambos, y acá no hay nada que esconder.
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  // El teléfono se detecta solo en iOS y Safari le pinta encima al número un
  // enlace azul que se pelea con la tipografía del sitio.
  formatDetection: { telephone: false, address: false, email: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es-AR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        {/*
         * Aplica el tema guardado ANTES del primer pintado. Si esto corriera en
         * un efecto de React, alguien en modo noche vería un destello blanco en
         * cada carga.
         *
         * Ya no sigue la preferencia del sistema: este sitio no tiene ningún
         * botón para cambiar de tema, así que a quien le tocaba oscuro por su
         * sistema operativo quedaba con el fondo negro y sin forma de volver a
         * claro. Por eso ahora el sitio arranca siempre en claro, salvo que en
         * el futuro se agregue un selector propio y alguien elija oscuro a
         * mano —ese `localStorage` queda funcionando para ese caso—.
         */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{if(localStorage.getItem("tema")==="oscuro"){document.documentElement.classList.add("dark")}}catch(e){}})()`,
          }}
        />
        <DatosEstructurados />
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
