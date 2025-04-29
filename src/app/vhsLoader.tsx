// A retro VHS loader animation for the Canonizer 3000
'use client';

export default function VHSLoader() {
  return (
    <div className="vhs-container mt-8">
      <div className="text-center">
        <h3 className="text-2xl font-orbitron text-neon-orange mb-4 animate-flicker">
          VHS IS REWINDING…
        </h3>
        <div className="vhs-loader-bar">
          <div className="vhs-loader-progress animate-vhs-rewind"></div>
        </div>
        <p className="text-white/70 mt-4 font-mono animate-pulse">
          Be kind, rewind! Your blockbuster is loading…
        </p>
      </div>
    </div>
  );
}
