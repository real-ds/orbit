const SEGMENTS = [
  "ARTIFICIAL INTELLIGENCE",
  "GENERATIVE AI",
  "AGENTIC SYSTEMS",
  "LLMs",
  "MACHINE LEARNING",
  "DEEP LEARNING",
  "AI RESEARCH",
  "MULTIMODAL AI",
  "ROBOTICS",
  "AI AGENTS",
  "REASONING MODELS",
  "OPEN-SOURCE AI",
  "AI CHIPS",
  "RAG SYSTEMS",
  "COMPUTER VISION",
  "AI CODING",
  "PHYSICAL AI",
  "MODEL TRAINING",
  "AI SAFETY",
  "VOICE AI",
  "WORLD MODELS",
  "AI INFRASTRUCTURE",
  "AUTONOMOUS SYSTEMS",
  "VIDEO GENERATION",
  "FOUNDATION MODELS",
  "AI STARTUPS",
  "EDGE AI",
  "SYNTHETIC DATA",
];

export default function CategoryRibbon() {
  return (
    <div
      className="about-ribbon"
      aria-label="Topics: artificial intelligence, generative AI, agentic systems, LLMs, machine learning and more"
    >
      <div className="about-ribbon__track">
        {[0, 1].map((copy) => (
          <div
            className="about-ribbon__group"
            key={copy}
            aria-hidden={copy === 1 ? true : undefined}
          >
            {SEGMENTS.map((segment) => (
              <span className="about-ribbon__item" key={segment}>
                {segment}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
