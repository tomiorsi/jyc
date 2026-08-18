"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ArrowRight,
  BadgeCheck,
  Calculator,
  Car,
  ChevronDown,
  Cpu,
  Factory,
  FileText,
  FlaskConical,
  Handshake,
  Landmark,
  Plane,
  Receipt,
  Scale,
  Search,
  Shirt,
  ShoppingBag,
  Ship,
  Tags,
  Truck,
  UtensilsCrossed,
  Warehouse,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { BandaCourier } from "@/components/landing/banda-courier";
import { InstagramPosts } from "@/components/landing/instagram-posts";
import { MapaOficina } from "@/components/landing/mapa-oficina";

/**
 * Adónde manda cada botón de contacto: el WhatsApp del estudio,
 * +54 9 11 3055-9538. wa.me lo quiere sin signos ni espacios.
 */
const CONTACTO = "https://wa.me/5491130559538";
import { WorldRoutes } from "@/components/landing/world-routes";

/* ───────────────────────── Reveal on scroll ───────────────────────── */

function useReveal() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    // Scroll listener + getBoundingClientRect (sin IntersectionObserver): es
    // determinístico en todos los navegadores y para ~20 nodos cuesta nada.
    let pendientes = Array.from(
      root.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)"),
    );

    // Respaldo por si algún entorno no despacha eventos de scroll con fluidez.
    const intervalo = window.setInterval(() => check(), 500);

    const detach = () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
      window.clearInterval(intervalo);
    };

    const check = () => {
      const vh =
        window.innerHeight || document.documentElement.clientHeight || 800;
      const limite = vh * 0.94;
      pendientes = pendientes.filter((el) => {
        if (el.getBoundingClientRect().top < limite) {
          el.classList.add("is-visible");
          return false;
        }
        return true;
      });
      if (pendientes.length === 0) detach();
    };

    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    check();
    return detach;
  }, []);

  return rootRef;
}

/* ───────────────────── Scroll suave con easing para anclas ─────────────────────
 * Los enlaces internos (#portal, #proceso) hacen un desplazamiento animado con
 * curva easeInOutCubic en vez del salto directo. Respeta prefers-reduced-motion.
 */
function useSmoothAnchors(rootRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId: number | null = null;

    const animarHasta = (destino: number) => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      const inicio = window.scrollY;
      const delta = destino - inicio;
      const duracion = Math.min(900, Math.max(450, Math.abs(delta) * 0.6));
      const t0 = performance.now();
      const ease = (t: number) =>
        t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const paso = (now: number) => {
        const t = Math.min(1, (now - t0) / duracion);
        window.scrollTo({ top: inicio + delta * ease(t), behavior: "instant" });
        if (t < 1) rafId = requestAnimationFrame(paso);
        else rafId = null;
      };
      rafId = requestAnimationFrame(paso);
    };

    const onClick = (e: MouseEvent) => {
      const enlace = (e.target as HTMLElement)?.closest?.(
        'a[href^="#"]',
      ) as HTMLAnchorElement | null;
      if (!enlace) return;
      const id = enlace.getAttribute("href")?.slice(1);
      if (!id) return;
      const destinoEl = document.getElementById(id);
      if (!destinoEl) return;
      e.preventDefault();
      const margen = 24;
      const destino = Math.max(
        0,
        window.scrollY + destinoEl.getBoundingClientRect().top - margen,
      );
      animarHasta(destino);
      history.replaceState(null, "", `#${id}`);
    };

    root.addEventListener("click", onClick);
    return () => {
      root.removeEventListener("click", onClick);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [rootRef]);
}

/* ───────────────────────── Pieza visual del hero ─────────────────────────
 * Círculo con ruta punteada animada y el modo de transporte que rota:
 * avión → barco → camión (CSS puro, sin timers).
 */

function TransportOrb() {
  const modos = [
    { Icon: Plane, label: "Aéreo" },
    { Icon: Ship, label: "Marítimo" },
    { Icon: Truck, label: "Terrestre" },
  ];

  return (
    <div className="landing-orb relative mx-auto aspect-square w-[280px] sm:w-[340px] md:w-[400px] lg:w-[420px]">
      {/* Anillos */}
      <div className="absolute inset-0 rounded-full border border-border/70" />
      <div className="absolute inset-[12%] rounded-full border border-border/50" />
      <div className="absolute inset-[26%] rounded-full border border-dashed border-accent/30" />

      {/* Ruta orbital punteada con punto viajando */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="none"
          stroke="var(--accent)"
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="3 7"
          className="landing-orbit-dash"
        />
        <circle r="3" fill="var(--accent)">
          <animateMotion
            dur="14s"
            repeatCount="indefinite"
            path="M 100 12 A 88 88 0 1 1 99.99 12"
          />
        </circle>
      </svg>

      {/* Núcleo con el modo de transporte rotante */}
      <div className="absolute inset-[33%] rounded-full bg-surface/80 shadow-[0_20px_60px_-20px_var(--ring)] ring-1 ring-border backdrop-blur">
        {modos.map(({ Icon, label }, i) => (
          <div
            key={label}
            className="landing-transport absolute inset-0 flex flex-col items-center justify-center gap-1.5"
            style={{ animationDelay: `${i * 4}s` }}
          >
            <Icon className="h-12 w-12 text-accent sm:h-14 sm:w-14" strokeWidth={1.6} />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Chips satélite */}
      <span className="landing-float absolute -left-1 top-[18%] rounded-full border border-border bg-surface/90 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur">
        IMPO
      </span>
      <span
        className="landing-float absolute -right-2 top-[34%] rounded-full border border-border bg-surface/90 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur"
        style={{ animationDelay: "1.2s" }}
      >
        EXPO
      </span>
      <span
        className="landing-float absolute bottom-[14%] left-[8%] rounded-full border border-border bg-surface/90 px-3 py-1 text-[11px] font-semibold text-foreground shadow-sm backdrop-blur"
        style={{ animationDelay: "2.1s" }}
      >
        NCM
      </span>
      <span
        className="landing-float absolute bottom-[6%] right-[16%] rounded-full border border-accent/40 bg-accent-soft px-3 py-1 text-[11px] font-semibold text-accent shadow-sm"
        style={{ animationDelay: "0.6s" }}
      >
        SIM
      </span>
    </div>
  );
}

/* ───────────────────────── Datos de las secciones ───────────────────────── */

/** Cada tarjeta de servicio o de rubro: un ícono, un nombre y qué implica. */
type Item = {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  titulo: string;
  texto: string;
};

/**
 * Las dos líneas de trabajo del estudio. La separación no es decorativa: son
 * dos servicios que se contratan por separado y a públicos distintos —el
 * despacho lo necesita todo el que importa; el agente de compras, solo el que
 * además quiere que le busquen el proveedor—.
 */
const LIBERACIONES: Item[] = [
  {
    Icon: ArrowLeftRight,
    titulo: "Importación y exportación",
    texto:
      "El proceso completo, de la apertura del legajo a la liberación de la mercadería.",
  },
  {
    Icon: Tags,
    titulo: "Clasificación arancelaria",
    texto:
      "Definimos la posición NCM de cada producto y la sostenemos con la documentación técnica.",
  },
  {
    Icon: FileText,
    titulo: "Documentación aduanera",
    texto:
      "Armamos y presentamos el legajo: factura, packing list, transporte, certificados y permisos.",
  },
  {
    Icon: Landmark,
    titulo: "Representación aduanera",
    texto:
      "Actuamos en tu nombre ante la Aduana y resolvemos las observaciones que aparezcan.",
  },
  {
    Icon: Scale,
    titulo: "Asesoría en Incoterms",
    texto:
      "Elegimos con vos el término que mejor reparte costos y riesgos en cada operación.",
  },
  {
    Icon: Receipt,
    titulo: "Gestión de pagos aduaneros",
    texto:
      "Liquidamos derechos, tasas e impuestos, y emitimos los VEP a tiempo.",
  },
  {
    Icon: Warehouse,
    titulo: "Control de inventarios",
    texto:
      "Mercadería en depósito fiscal y zona franca, con el stock conciliado contra lo declarado.",
  },
  {
    Icon: Calculator,
    titulo: "Costeo y factibilidad",
    texto:
      "El costo puesto en tu depósito, calculado antes de que compres.",
  },
];

const COMPRAS: Item[] = [
  {
    Icon: Search,
    titulo: "Búsqueda de proveedores",
    texto:
      "Proveedores en origen, evaluados con referencias y muestras antes de avanzar.",
  },
  {
    Icon: Handshake,
    titulo: "Negociación de contratos",
    texto:
      "Precio, plazo y garantía cerrados para que un incumplimiento no te deje sin respaldo.",
  },
  {
    Icon: Ship,
    titulo: "Logística internacional",
    texto:
      "Elegimos la vía que mejor equilibra costo y tiempo, y coordinamos el transporte.",
  },
  {
    Icon: BadgeCheck,
    titulo: "Auditoría de proveedores",
    texto:
      "Inspección de calidad en origen, antes del embarque y no cuando ya llegó.",
  },
];

/** Rubros con los que el estudio ya trabajó. Cada uno tiene su propia vuelta. */
const RUBROS: Item[] = [
  {
    Icon: Car,
    titulo: "Automotriz",
    texto: "Autopartes y vehículos completos, con su régimen y sus certificaciones.",
  },
  {
    Icon: Cpu,
    titulo: "Tecnología y electrónica",
    texto: "Despacho y logística de productos electrónicos y sus componentes.",
  },
  {
    Icon: UtensilsCrossed,
    titulo: "Alimentos y bebidas",
    texto: "Perecederos y no perecederos, cumpliendo la normativa sanitaria.",
  },
  {
    Icon: Shirt,
    titulo: "Moda y textil",
    texto: "Indumentaria y telas, donde la clasificación define el costo final.",
  },
  {
    Icon: Factory,
    titulo: "Maquinaria y equipos",
    texto: "Maquinaria pesada y equipamiento industrial, de origen a planta.",
  },
  {
    Icon: FlaskConical,
    titulo: "Productos químicos",
    texto: "Clasificación y gestión, con las habilitaciones que cada sustancia exige.",
  },
  {
    Icon: ShoppingBag,
    titulo: "Bienes de consumo",
    texto: "Consumo masivo, optimizando tiempos y costos por lote.",
  },
];

/**
 * Un número que sube hasta su valor en vez de aparecer puesto.
 *
 * El valor final es también lo que se pinta en el servidor: si el JavaScript
 * tarda o no llega, se lee «+20» y no «+0», que sería peor que no animar nada.
 * La curva frena sobre el final —arranca rápido y se acomoda— porque un
 * contador lineal se lee como un cronómetro, no como un dato.
 */
function Contador({ hasta, sufijo = "" }: { hasta: number; sufijo?: string }) {
  const [valor, setValor] = useState<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const DURACION = 1500;
    let cuadro = 0;
    let arranque = 0;
    let anterior = 0;

    const paso = (ahora: number) => {
      if (!arranque) arranque = ahora;
      // Si la pestaña se fue a segundo plano, el navegador dejó de dar cuadros
      // pero el reloj siguió corriendo. Sin correr el arranque por el hueco, al
      // volver el número ya estaría en su valor final y nadie vería la cuenta.
      if (anterior && ahora - anterior > 200) arranque += ahora - anterior;
      anterior = ahora;

      const avance = Math.min(1, (ahora - arranque) / DURACION);
      setValor(Math.round(hasta * (1 - Math.pow(1 - avance, 3))));
      if (avance < 1) cuadro = requestAnimationFrame(paso);
    };

    cuadro = requestAnimationFrame(paso);
    return () => cancelAnimationFrame(cuadro);
  }, [hasta]);

  return (
    <>
      +{valor ?? hasta}
      {sufijo}
    </>
  );
}

/**
 * El sello del estudio.
 *
 * Un despachante vive de sellar: es el gesto más reconocible del oficio, y
 * traerlo a la página dice «veinte años de esto» mejor que otra tarjeta con
 * texto. El aro exterior gira despacio; el centro queda quieto para que el
 * número se pueda leer.
 */
function Sello() {
  return (
    <div className="sello relative aspect-square w-[230px] sm:w-[260px]">
      <svg viewBox="0 0 200 200" className="h-full w-full" role="img" aria-label="J&C Comex, más de 20 años">
        <defs>
          {/* El aro sobre el que corre el texto. Va por dentro de los bordes
              para que las letras no toquen las circunferencias. */}
          <path
            id="sello-aro"
            d="M 100,100 m -74,0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
            fill="none"
          />
        </defs>

        <g className="sello-trazo" fill="none">
          <circle cx="100" cy="100" r="94" strokeWidth="1.5" />
          <circle cx="100" cy="100" r="86" strokeWidth="3" />
          <circle cx="100" cy="100" r="56" strokeWidth="1.5" strokeDasharray="3 4" />
        </g>

        <g className="sello-giro">
          <text className="sello-leyenda" fontSize="11" letterSpacing="2">
            <textPath href="#sello-aro" startOffset="0%">
              J&amp;C COMEX · DESPACHANTES DE ADUANA · BUENOS AIRES ·
            </textPath>
          </text>
        </g>

        <text
          className="sello-cifra"
          x="100"
          y="99"
          textAnchor="middle"
          fontSize="42"
          fontWeight="800"
        >
          +20
        </text>
        <text
          className="sello-pie"
          x="100"
          y="120"
          textAnchor="middle"
          fontSize="11"
          letterSpacing="4.5"
          fontWeight="600"
        >
          AÑOS
        </text>
      </svg>
    </div>
  );
}

/* ───────────────────────── Piezas compartidas ───────────────────────── */

/**
 * El logotipo de WhatsApp. Va escrito acá y no sale de lucide porque la
 * librería no incluye marcas registradas.
 */
function IconoWhatsApp({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

/**
 * El contacto del sitio, fijo abajo a la derecha y siempre a mano.
 *
 * El verde es el de WhatsApp y queda igual en los dos temas: es el color de la
 * marca, no el de la paleta del sitio.
 */
function WhatsAppFlotante() {
  return (
    <div className="fixed bottom-5 right-5 z-50 h-14 w-14 sm:bottom-7 sm:right-7">
      <span aria-hidden className="pulso-wa" />
      <a
        href={CONTACTO}
        target="_blank"
        rel="noreferrer noopener"
        aria-label="Escribinos por WhatsApp"
        className="relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_34px_-10px_rgba(37,211,102,0.65)] transition-transform duration-300 hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366]"
      >
        <IconoWhatsApp className="h-7 w-7" />
      </a>
    </div>
  );
}

/**
 * Encabezado de sección: el rótulo chico en naranja y el título.
 *
 * El rótulo no es decoración —dice en qué parte del sitio está parado el
 * visitante, que es lo único que se pierde al no haber menú de navegación—.
 */
function TituloSeccion({
  rotulo,
  titulo,
  children,
  className = "",
}: {
  rotulo: string;
  titulo: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div data-reveal className={`landing-reveal ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent-text">
        {rotulo}
      </p>
      <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {titulo}
      </h2>
      {children}
    </div>
  );
}

/**
 * Título de una línea de servicio, con la regla que se apaga hacia la derecha.
 * La regla marca dónde empieza cada bloque sin cortar la página en dos, que es
 * justo lo que hacían los bordes de sección que había antes.
 */
function TituloBloque({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal className="landing-reveal flex items-center gap-4">
      <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
        {children}
      </h3>
      <span
        aria-hidden
        className="regla-bloque h-px flex-1 bg-gradient-to-r from-accent/50 to-transparent"
      />
    </div>
  );
}

/**
 * Tarjeta de servicio. Translúcida a propósito: el fondo de la página tiene
 * que verse por detrás, si no vuelve a leerse como un bloque aparte.
 */
function Tarjeta({ Icon, titulo, texto, retraso }: Item & { retraso: number }) {
  return (
    <li
      data-reveal
      style={{ transitionDelay: `${retraso}ms` }}
      className="landing-reveal tarjeta-viva group flex gap-4 rounded-2xl border border-border/70 bg-surface/80 p-5 hover:border-accent/45 hover:shadow-[0_20px_44px_-28px_var(--ring)]"
    >
      <span className="icono-salton mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </span>
      <div>
        <h4 className="text-[15px] font-semibold text-foreground">{titulo}</h4>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{texto}</p>
      </div>
    </li>
  );
}

/* ───────────────────────── Página ───────────────────────── */

export function Landing() {
  const rootRef = useReveal();
  useSmoothAnchors(rootRef);

  return (
    <div ref={rootRef} className="relative min-h-screen overflow-x-clip">
      {/* ── Header ── */}
      {/* Solo la marca, centrada. El contacto vive en el botón flotante de
          WhatsApp, así que nada le compite al logo. La altura sigue siendo
          h-16 porque el hero la descuenta. */}
      <header className="relative z-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-center px-5 sm:px-8">
          <Brand size="sm" />
        </div>
      </header>

      {/* ── Hero ── */}
      {/* El hero ocupa exactamente una pantalla: así la flecha del pie queda
          visible sin scrollear, que es lo único que le pide al visitante. */}
      <section className="relative flex min-h-[calc(100dvh-4rem)] flex-col overflow-hidden">
        <WorldRoutes className="absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="absolute left-1/2 top-0 -z-10 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/10 blur-[140px]"
        />

        <div className="relative mx-auto grid w-full max-w-6xl flex-1 content-center items-center gap-14 px-5 py-10 sm:px-8 md:grid-cols-[1.05fr_0.95fr]">
          <div className="text-center md:text-left">
            <h1
              data-reveal
              className="landing-reveal text-5xl font-extrabold leading-[1.04] tracking-tight text-foreground md:text-6xl"
            >
              Tu carga cruza fronteras.
              <br />
              <span className="text-accent">Nosotros la despachamos.</span>
            </h1>

            <p
              data-reveal
              className="landing-reveal mt-6 text-lg text-muted"
            >
              Despachamos tu importación o exportación de punta a punta.
            </p>

            <div data-reveal className="landing-reveal mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start">
              <div className="flex flex-col items-center rounded-2xl bg-accent-soft px-5 py-3">
                <span className="text-3xl font-extrabold text-accent">
                  <Contador hasta={20} />
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-accent">
                  años
                </span>
              </div>
              <div className="flex flex-col items-center rounded-2xl bg-accent-soft px-5 py-3">
                <span className="text-3xl font-extrabold text-accent">
                  <Contador hasta={10} sufijo="K" />
                </span>
                <span className="text-xs font-medium uppercase tracking-wide text-accent">
                  despachos
                </span>
              </div>
            </div>

          </div>

          <div data-reveal className="landing-reveal hidden md:block">
            <TransportOrb />
          </div>
        </div>

        {/* Invitación a seguir bajando: es lo único que pedimos en esta pantalla. */}
        <div data-reveal className="landing-reveal relative flex shrink-0 justify-center pb-8">
          <a
            href="#nosotros"
            aria-label="Conocer el estudio"
            className="group flex flex-col items-center gap-2 text-muted transition-colors hover:text-accent"
          >
            <span className="text-xs font-medium uppercase tracking-[0.2em]">
              Conocenos
            </span>
            <ChevronDown className="landing-flecha h-10 w-10" strokeWidth={1.5} />
          </a>
        </div>
      </section>

      {/* ── Todo lo que va debajo del hero ──
          Un solo contenedor con un solo fondo. Las secciones de adentro no
          pintan nada: la continuidad del color es lo que evita que se lean
          como páginas distintas pegadas una con otra. */}
      <div className="relative">
        <div aria-hidden className="trama-mapa absolute inset-0" />
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          <span className="mancha left-[-14%] top-[6%] h-[520px] w-[680px]" />
          <span
            className="mancha right-[-18%] top-[30%] h-[580px] w-[720px]"
            style={{ animationDelay: "-7s" }}
          />
          <span
            className="mancha left-[-12%] top-[58%] h-[540px] w-[640px]"
            style={{ animationDelay: "-13s" }}
          />
          <span
            className="mancha right-[-14%] top-[84%] h-[500px] w-[680px]"
            style={{ animationDelay: "-4s" }}
          />
        </div>

        {/* ── Nosotros ── */}
        <section id="nosotros" className="relative">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_auto] lg:gap-20">
              <div>
                <TituloSeccion
                  rotulo="Nosotros"
                  titulo={
                    <>
                      Más de <span className="text-accent-text">20 años</span>{" "}
                      despachando para PyMEs
                    </>
                  }
                />
                <div
                  data-reveal
                  className="landing-reveal mt-6 space-y-4 text-base leading-relaxed text-muted"
                >
                  <p>
                    En todo ese tiempo construimos una reputación que se apoya en dos
                    cosas simples: hacer lo que decimos y avisar a tiempo cuando algo
                    cambia.
                  </p>
                  <p>
                    La normativa se mueve, los plazos aprietan y cada operación tiene su
                    vuelta. Nos hacemos cargo del trámite y te lo contamos en castellano,
                    sin que tengas que aprender de aduana para saber en qué anda tu carga.
                  </p>
                </div>
              </div>

              <div data-reveal className="landing-reveal flex justify-center lg:justify-end">
                <Sello />
              </div>
            </div>

          </div>
        </section>

        {/* ── Servicios ── */}
        <section id="servicios" className="relative">
          <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
            {/* Solo el rótulo, sin título ni bajada: los dos nombres de línea
                que vienen abajo ya dicen de qué se trata, y repetirlo arriba
                era decir lo mismo tres veces. */}
            <p
              data-reveal
              className="landing-reveal text-xs font-semibold uppercase tracking-[0.2em] text-accent-text"
            >
              Servicios
            </p>

            <div className="mt-8">
              <TituloBloque>Liberaciones aduaneras</TituloBloque>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {LIBERACIONES.map((item, i) => (
                  <Tarjeta key={item.titulo} {...item} retraso={i * 60} />
                ))}
              </ul>
            </div>

            <div className="mt-16">
              <TituloBloque>Agente de compras internacionales</TituloBloque>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {COMPRAS.map((item, i) => (
                  <Tarjeta key={item.titulo} {...item} retraso={i * 60} />
                ))}
              </ul>
            </div>
          </div>
        </section>

        <BandaCourier />

        {/* ── Rubros ── */}
        <section id="rubros" className="relative">
          <div className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:px-8 sm:pb-28 sm:pt-28">
            <TituloSeccion
              rotulo="Clientes"
              titulo={
                <>
                  Los rubros que{" "}
                  <span className="text-accent-text">ya despachamos</span>
                </>
              }
              className="max-w-2xl"
            />

            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {RUBROS.map((item, i) => (
                <li
                  key={item.titulo}
                  data-reveal
                  style={{ transitionDelay: `${i * 60}ms` }}
                  className="landing-reveal tarjeta-viva group rounded-2xl border border-border/70 bg-surface/80 p-5 hover:border-accent/45 hover:shadow-[0_20px_44px_-28px_var(--ring)]"
                >
                  <span className="icono-salton inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-text">
                    <item.Icon className="h-5 w-5" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-foreground">
                    {item.titulo}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.texto}
                  </p>
                </li>
              ))}

              {/* Octava celda: cierra la grilla de dos filas y, de paso, le da
                  salida al visitante cuyo rubro no está en la lista. */}
              <li
                data-reveal
                style={{ transitionDelay: `${RUBROS.length * 60}ms` }}
                className="landing-reveal"
              >
                <a
                  href={CONTACTO}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="tarjeta-viva group flex h-full flex-col justify-between rounded-2xl border border-dashed border-accent/45 bg-accent-soft/70 p-5 hover:border-accent hover:shadow-[0_20px_44px_-28px_var(--ring)]"
                >
                  <h3 className="text-[15px] font-semibold text-foreground">
                    ¿Tu rubro no está en la lista?
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    Contanos qué importás y te decimos cómo se despacha.
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent-text">
                    Escribinos
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <MapaOficina />

        <InstagramPosts />

        {/* ── Pie ── */}
        <footer className="relative border-t border-border/60">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 px-5 py-10 sm:flex-row sm:justify-between sm:px-8">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
              <Brand size="sm" />
              <p className="text-sm text-muted">Despachantes de aduana</p>
            </div>
            <p className="text-center text-xs text-muted sm:text-right">
              {`© ${new Date().getFullYear()} J&C Comex · Todos los derechos reservados`}
            </p>
          </div>
        </footer>
      </div>

      <WhatsAppFlotante />
    </div>
  );
}
