/**
 * Purely decorative page background — "premium engineering notebook" in
 * light mode, "midnight engineering blueprint" in dark mode. Same layered
 * language in both themes: a tinted canvas wash, a fine technical dot grid,
 * a handful of sparse hand-drawn blueprint elements (construction lines,
 * rounded outlines, a faint sketch curve with a couple of circuit-like
 * nodes), and quiet ambient color hints at the far edges only.
 *
 * Fixed to the viewport with a negative z-index, so it stacks behind all
 * normal page content regardless of DOM order (a `position: fixed` element
 * without an explicit z-index would otherwise paint above static content
 * per CSS stacking rules — harmless with the old, very faint decoration,
 * but a real bug once this had an opaque canvas fill). Never touches
 * `--background`, `--card`, or any component color, only adds a layer
 * beneath them that shows through page whitespace.
 */
export function BackgroundDecoration() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base canvas tint */}
      <div className="absolute inset-0" style={{ backgroundColor: "var(--notebook-canvas)" }} />

      {/* Fine technical dot grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(var(--notebook-grid) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      {/* Quiet ambient color hints, far edges only */}
      <div
        className="notebook-ambient absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full blur-[140px]"
        style={{ backgroundColor: "var(--notebook-edge-blue)" }}
      />
      <div
        className="notebook-ambient absolute top-1/2 -right-40 h-[28rem] w-[28rem] rounded-full blur-[140px]"
        style={{ backgroundColor: "var(--notebook-edge-lavender)", animationDelay: "8s" }}
      />
      <div
        className="notebook-ambient absolute -bottom-40 left-1/3 h-[26rem] w-[26rem] rounded-full blur-[140px]"
        style={{ backgroundColor: "var(--notebook-edge-mint)", animationDelay: "16s" }}
      />

      {/* Sparse blueprint sketch elements */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        stroke="var(--notebook-line)"
      >
        {/* Top-right measurement bracket */}
        <path d="M 1220 60 L 1220 110 L 1270 110" strokeWidth="1" />
        <path d="M 1300 90 L 1300 130 L 1340 130" strokeWidth="1" />
        <line x1="1220" y1="60" x2="1340" y2="60" strokeWidth="1" strokeDasharray="2 6" />

        {/* Left-side sketch curve with two circuit-like nodes */}
        <path d="M -40 460 C 60 420, 120 520, 220 470 S 340 430, 420 480" strokeWidth="1.1" />
        <circle cx="220" cy="470" r="4" strokeWidth="1" />
        <circle cx="380" cy="452" r="4" strokeWidth="1" />
        <line x1="224" y1="470" x2="376" y2="452" strokeWidth="0.75" strokeDasharray="1 5" />

        {/* Bottom-right soft rounded outline */}
        <rect x="1120" y="700" width="260" height="160" rx="36" strokeWidth="1" />

        {/* Sparse diagonal construction lines */}
        <line x1="40" y1="120" x2="220" y2="40" strokeWidth="0.75" />
        <line x1="900" y1="860" x2="1080" y2="780" strokeWidth="0.75" />

        {/* A few faint node points scattered near edges */}
        <circle cx="150" cy="780" r="2.5" strokeWidth="1" />
        <circle cx="1380" cy="420" r="2.5" strokeWidth="1" />
      </svg>
    </div>
  );
}
