import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "J&C Comex · Despachantes de Aduana",
  description:
    "Estudio de despachantes de aduana. Importación y exportación gestionadas de punta a punta.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
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
      </head>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
