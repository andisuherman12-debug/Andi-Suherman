import { useState } from 'react';
import { Compass } from 'lucide-react';

interface SceneImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectClassName?: string;
  scrimClassName?: string;
  children?: React.ReactNode;
}

export function SceneImage({
  src,
  alt,
  className = '',
  aspectClassName = 'aspect-video',
  scrimClassName = 'bg-gradient-to-t from-[#060D1A]/90 via-[#060D1A]/30 to-transparent',
  children,
}: SceneImageProps) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-700/60 bg-[#0B162C] ${aspectClassName} ${className}`}
    >
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-[#0B162C] via-[#12213D] to-[#060D1A] p-6 text-center">
          <Compass className="h-10 w-10 text-[#D4AF37]" />
          <p className="text-sm font-medium text-slate-300">{alt}</p>
        </div>
      )}
      <div className={`pointer-events-none absolute inset-0 ${scrimClassName}`} />
      {children}
    </div>
  );
}
