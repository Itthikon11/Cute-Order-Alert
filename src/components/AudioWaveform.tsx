import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isPlaying: boolean;
  color?: string;
  barCount?: number;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isPlaying,
  color = '#ec4899', // pink-500
  barCount = 36,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      const barWidth = Math.max(2, (width / barCount) - 3);

      for (let i = 0; i < barCount; i++) {
        const x = i * (barWidth + 3);
        let barHeight = 4;

        if (isPlaying) {
          // Dynamic harmonic bounce
          const wave1 = Math.sin(phase + (i * 0.35));
          const wave2 = Math.cos(phase * 1.5 + (i * 0.2));
          const factor = Math.abs(wave1 * 0.6 + wave2 * 0.4);
          barHeight = Math.max(4, factor * (height - 6));
        }

        const y = (height - barHeight) / 2;

        // Gradient
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        gradient.addColorStop(0, color);
        gradient.addColorStop(1, '#f43f5e'); // rose-500

        ctx.fillStyle = isPlaying ? gradient : '#cbd5e1';
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 2);
        ctx.fill();
      }

      if (isPlaying) {
        phase += 0.12;
      }
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isPlaying, color, barCount]);

  return (
    <div className="w-full flex items-center justify-center py-1">
      <canvas
        ref={canvasRef}
        width={360}
        height={48}
        className="w-full max-w-sm h-12 rounded-lg bg-pink-50/50"
      />
    </div>
  );
};
