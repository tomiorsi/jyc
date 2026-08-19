"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Mail } from "lucide-react";
import { IconoWhatsApp } from "@/components/landing/icono-whatsapp";

const WHATSAPP = "https://wa.me/5491130559538";
const NUMERO_VISIBLE = "+54 9 11 3055-9538";

const EMAILS = ["info@jyccomex.com.ar", "jcavezzali@jyccomex.com.ar"];

/** Cuánto queda arriba el aviso de «Copiado» antes de volver al mail. */
const DURACION_AVISO = 1800;

/**
 * Copia un texto al portapapeles.
 *
 * `navigator.clipboard` pide contexto seguro (https, o localhost en
 * desarrollo) y puede faltar en navegadores viejos. El resto del sitio no
 * tenía ningún caso que lo necesitara; acá sí, así que el respaldo con un
 * textarea oculto y `execCommand` va local y no en una utilidad aparte.
 */
async function copiarAlPortapapeles(texto: string) {
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(texto);
      return;
    } catch {
      // sigue al respaldo de abajo
    }
  }
  const area = document.createElement("textarea");
  area.value = texto;
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

/**
 * Un mail que se copia solo al tocarlo.
 *
 * En vez de un cartel flotante aparte, el propio texto cambia lo que dice: es
 * la confirmación más directa posible de que la copia fue justo esa dirección
 * y no otra cosa en la pantalla. Vuelve solo al estado original, sin que haga
 * falta cerrar nada.
 */
function ChipEmail({ email, retraso }: { email: string; retraso: number }) {
  const [copiado, setCopiado] = useState(false);
  const temporizador = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(temporizador.current), []);

  const alTocar = () => {
    void copiarAlPortapapeles(email);
    setCopiado(true);
    window.clearTimeout(temporizador.current);
    temporizador.current = window.setTimeout(() => setCopiado(false), DURACION_AVISO);
  };

  return (
    <li
      data-reveal
      style={{ transitionDelay: `${retraso}ms` }}
      className="landing-reveal"
    >
      <button
        type="button"
        onClick={alTocar}
        className="group flex items-center gap-3 text-left"
      >
        <span
          aria-hidden
          className="icono-salton inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text"
        >
          {copiado ? <Check className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
        </span>
        <div aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {copiado ? "Copiado" : "Mail"}
          </p>
          <p className="mt-1 break-all text-base font-semibold text-foreground transition-colors group-hover:text-accent-text">
            {copiado ? "Ya lo tenés en el portapapeles" : email}
          </p>
        </div>
      </button>
    </li>
  );
}

/**
 * La sección de contacto: los tres canales del estudio, sueltos sobre el
 * fondo de la página, sin ninguna tarjeta que los agrupe.
 *
 * El WhatsApp redirige al chat porque ya tiene una intención clara —escribir
 * ahora—; los mails en cambio se copian, porque a un mail normalmente se le
 * responde después, desde el cliente de correo de cada uno, no en el momento.
 */
export function Contacto() {
  return (
    <section id="contacto" className="relative">
      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <ul className="flex flex-wrap items-start justify-center gap-x-14 gap-y-8">
          <li data-reveal className="landing-reveal">
            <a
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer noopener"
              className="group flex items-center gap-3"
            >
              <span
                aria-hidden
                className="icono-salton inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-text"
              >
                <IconoWhatsApp className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  WhatsApp
                </p>
                <p className="mt-1 text-base font-semibold text-foreground transition-colors group-hover:text-accent-text">
                  {NUMERO_VISIBLE}
                </p>
              </div>
            </a>
          </li>

          {EMAILS.map((email, i) => (
            <ChipEmail key={email} email={email} retraso={(i + 1) * 90} />
          ))}
        </ul>
      </div>
    </section>
  );
}
