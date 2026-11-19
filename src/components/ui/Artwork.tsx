import type { CSSProperties } from "react";

type Motif = "dots" | "bars" | "rings" | "wave";

const WIDTH = 640;
const HEIGHT = 360;

function hash(seed: number): number {
  return (seed * 7919) % 97;
}

/** Deterministic pseudo-random value in [0, 1) for a given seed and key. */
function noise(seed: number, key: number): number {
  return ((seed * 31 + key * 17 + hash(seed)) % 100) / 100;
}

function motifFor(seed: number): Motif {
  const motifs: Motif[] = ["dots", "bars", "rings", "wave"];
  return motifs[Math.abs(seed) % motifs.length];
}

export interface ArtworkProps {
  /** Any stable number, e.g. derived from an article id. */
  seed: number;
  className?: string;
  /** The hero rendition uses a wider canvas. */
  variant?: "card" | "hero";
}

/**
 * Generative placeholder artwork.
 *
 * Rendered as real SVG elements rather than an HTML string so it never needs
 * `dangerouslySetInnerHTML` and can never carry unescaped content.
 */
export function Artwork({ seed, className, variant = "card" }: ArtworkProps) {
  const width = variant === "hero" ? 960 : WIDTH;
  const height = variant === "hero" ? 540 : HEIGHT;
  const motif = motifFor(seed);
  const foreground: CSSProperties = { fill: "var(--fg)" };
  const stroke: CSSProperties = { fill: "none", stroke: "var(--fg)" };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label="Abstract generative illustration"
      className={className}
    >
      <rect width={width} height={height} style={{ fill: "var(--soft)" }} />

      {motif === "dots" &&
        Array.from({ length: 9 }, (_, row) =>
          Array.from({ length: 6 }, (_, column) => {
            const radius = 4 + noise(seed, row * 6 + column) * 18;
            return (
              <circle
                key={`${row}-${column}`}
                cx={40 + column * (width / 6)}
                cy={40 + row * (height / 5)}
                r={radius}
                style={foreground}
              />
            );
          }),
        )}

      {motif === "bars" &&
        Array.from({ length: 18 }, (_, index) => {
          const barHeight = 30 + noise(seed, index) * (height - 60);
          return (
            <rect
              key={index}
              x={24 + index * (width / 18)}
              y={height - 24 - barHeight}
              width={width / 18 - 16}
              height={barHeight}
              style={foreground}
            />
          );
        })}

      {motif === "rings" &&
        Array.from({ length: 12 }, (_, index) => (
          <circle
            key={index}
            cx={width / 2}
            cy={height / 2}
            r={20 + index * (variant === "hero" ? 26 : 18)}
            style={stroke}
            strokeWidth={index % 3 === 0 ? 3 : 1}
          />
        ))}

      {motif === "wave" && (
        <>
          <path
            d={Array.from({ length: 17 }, (_, index) => {
              const x = index * (width / 16);
              const y = height * 0.2 + noise(seed, index + 3) * height * 0.6;
              return `${index === 0 ? "M" : "L"}${x} ${y}`;
            }).join(" ")}
            style={stroke}
            strokeWidth={4}
          />
          {Array.from({ length: 17 }, (_, index) => {
            const x = index * (width / 16);
            const y = height * 0.2 + noise(seed, index + 3) * height * 0.6;
            return (
              <rect
                key={index}
                x={x - 5}
                y={y - 5}
                width={10}
                height={10}
                style={foreground}
              />
            );
          })}
        </>
      )}
    </svg>
  );
}
