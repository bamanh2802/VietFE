import * as React from 'react';
export interface SocialIconProps {
    src: string;
    alt: string;
  }
  

export const SocialIcon: React.FC<SocialIconProps> = ({ src, alt }) => (
  <div className="flex gap-2.5 justify-center items-center px-1.5 rounded-lg border border-solid bg-slate-900 border-slate-800 h-[34px] w-[34px]">
    <img
      loading="lazy"
      src={src}
      alt={alt}
      className="object-contain self-stretch my-auto w-6 aspect-square"
    />
  </div>
);