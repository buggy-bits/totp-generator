import React, { useEffect, useRef } from "react";

interface DrainingTimerProps {
  text: string;
  endTime: number; // epoch timestamp in milliseconds - not used anymore, keeping for compatibility
}

const DrainingTimer: React.FC<DrainingTimerProps> = ({
  text,
  endTime, // keeping this prop but not using it
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const svg = svgRef.current;
    const clipRect = clipRectRef.current;
    if (!svg || !clipRect) return;

    const fullHeight = parseFloat(svg.getAttribute("height") || "80");

    // Cancel any existing animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    function updateFill() {
      const now = Date.now();

      // Get current seconds within the minute (0-59)
      const currentSeconds = Math.floor((now / 1000) % 60);

      // Calculate which 30-second cycle we're in and remaining time
      let remainingSeconds: number;

      if (currentSeconds < 30) {
        // First half: 0-29 seconds, next refresh at 30
        remainingSeconds = 30 - currentSeconds;
      } else {
        // Second half: 30-59 seconds, next refresh at 60 (0 of next minute)
        remainingSeconds = 60 - currentSeconds;
      }

      // Add milliseconds precision
      const currentMs = (now % 1000) / 1000;
      remainingSeconds = remainingSeconds - currentMs;

      // Calculate progress (0 = full/start of cycle, 1 = empty/end of cycle)
      const progress = Math.max(0, 1 - remainingSeconds / 30);

      // Calculate fill height (starts full at top, drains downward)
      const fillHeight = fullHeight * (1 - progress);

      // Update clip rect to show filled portion from top
      clipRect.setAttribute("y", "0");
      clipRect.setAttribute("height", Math.max(0, fillHeight).toString());

      // Continue animation
      animationFrameRef.current = requestAnimationFrame(updateFill);
    }

    // Start the animation immediately
    animationFrameRef.current = requestAnimationFrame(updateFill);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [text]); // Re-run when text changes (component refresh)

  return (
    <div className="flex justify-center items-center w-full">
      <svg
        ref={svgRef}
        width="440"
        height="80"
        viewBox="0 0 440 80"
        className="max-w-full h-auto"
      >
        <defs>
          <clipPath id={`fill-clip-${Date.now()}`}>
            <rect ref={clipRectRef} x="0" y="0" width="440" height="80" />
          </clipPath>
        </defs>
        {/* Outline Text */}
        <text
          x="10"
          y="75"
          fill="none"
          stroke="white"
          strokeWidth="0.4"
          fontSize="95"
          fontWeight="bold"
          style={{ paintOrder: "stroke fill" }}
        >
          {text}
        </text>
        {/* Filled Text (drains from top to bottom) */}
        <text
          x="10"
          y="75"
          fill="white"
          stroke="none"
          fontSize="95"
          fontWeight="bold"
          style={{ paintOrder: "stroke fill" }}
          clipPath={`url(#fill-clip-${Date.now()})`}
        >
          {text}
        </text>
      </svg>
    </div>
  );
};

export default DrainingTimer;
