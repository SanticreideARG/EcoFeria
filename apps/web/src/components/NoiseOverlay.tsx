/** Textura kraft global: overlay de ruido fractal detrás del contenido. */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden
      className="noise-overlay pointer-events-none fixed inset-0 z-[-1] mix-blend-multiply"
    />
  );
}
