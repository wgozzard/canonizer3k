// Fail-safe output for Canonizer 3000: Out of credits, offline, or manually disabled
'use client';

export default function FailSafeOutput() {
  return (
    <div className="vhs-container mt-12">
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-orbitron text-neon-orange mb-6 animate-flicker">🚫 SORRY — ALL TAPES ARE RENTED</div>
        <div className="text-lg md:text-xl font-orbitron text-white/80 mb-4">
          The shelves are empty, the VHS is worn out, and the Blockvideo's closed for the night.<br/>
          Try again later once the fog clears and the neon resets...
        </div>
        <div className="text-md text-neon-orange font-mono mt-2">
          (Translation: Our Canonizer is out of credits or offline. Check back soon!)
        </div>
      </div>
    </div>
  );
}
