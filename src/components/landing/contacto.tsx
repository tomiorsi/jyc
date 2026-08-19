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
 * En vez de un cartel flotante aparte, el propio botón cambia lo que dice: es
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
        className="tarjeta-viva group flex h-full w-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface p-5 text-left hover:border-accent/45 hover:shadow-[0_20px_44px_-28px_var(--ring)]"
      >
        <span
          aria-hidden
          className="icono-salton inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-text"
        >
          {copiado ? <Check className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
        </span>
        <div aria-live="polite">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
            {copiado ? "Copiado" : "Mail"}
          </p>
          <p className="mt-1 break-all text-base font-semibold text-foreground">
            {copiado ? "Ya lo tenés en el portapapeles" : email}
          </p>
        </div>
      </button>
    </li>
  );
}

/**
 * La sección de contacto: los tres canales del estudio, en un solo lugar.
 *
 * El WhatsApp redirige al chat porque ya tiene una intención clara —escribir
 * ahora—; los mails en cambio se copian, porque a un mail normalmente se le
 * responde después, desde el cliente de correo de cada uno, no en el momento.
 */
export function Contacto() {
  return (
    <section id="contacto" className="relative">
      <div className="mx-auto max-w-6xl px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative overflow-hidden rounded-3xl border border-border/70 bg-surface-2/60 px-6 py-12 sm:px-12 sm:py-16">
          {/* Solo el rótulo, sin título ni bajada: los tres chips de abajo ya
              dicen de qué se trata, y explicarlo primero era decir lo mismo
              dos veces. */}
          <p
            data-reveal
            className="landing-reveal text-xs font-semibold uppercase tracking-[0.2em] text-accent-text"
          >
            Contacto
          </p>

          <ul className="mt-10 grid gap-4 sm:grid-cols-3">
            <li data-reveal className="landing-reveal">
              <a
                href={WHATSAPP}
                target="_blank"
                rel="noreferrer noopener"
                className="tarjeta-viva group flex h-full flex-col gap-3 rounded-2xl border border-border/70 bg-surface p-5 hover:border-accent/45 hover:shadow-[0_20px_44px_-28px_var(--ring)]"
              >
                <span
                  aria-hidden
                  className="icono-salton inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent-text"
                >
                  <IconoWhatsApp className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    WhatsApp
                  </p>
                  <p className="mt-1 text-base font-semibold text-foreground">
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
      </div>
    </section>
  );
}
