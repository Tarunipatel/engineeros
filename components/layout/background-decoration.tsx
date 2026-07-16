/**
 * Purely decorative — a fine dot grid plus a few slow-drifting blurred color
 * blobs. Fixed to the viewport and painted before the sidebar/topbar/content,
 * so opaque surfaces (sidebar, cards) naturally cover it and it only peeks
 * through page whitespace. Kept slow and low-opacity so it stays in the
 * background of a tool used for focused daily work, not a distraction.
 */
export function BackgroundDecoration() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.05] dark:opacity-[0.07]"
        style={{
          backgroundImage: "radial-gradient(var(--foreground) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="bg-blob-a absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full bg-accent-blue/25 blur-[110px]" />
      <div className="bg-blob-b absolute top-1/3 -right-32 h-[26rem] w-[26rem] rounded-full bg-accent-purple/20 blur-[110px]" />
      <div className="bg-blob-c absolute bottom-[-6rem] left-1/4 h-[24rem] w-[24rem] rounded-full bg-accent-pink/15 blur-[110px]" />
    </div>
  );
}
