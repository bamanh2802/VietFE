import * as React from 'react';
export interface IconTextProps {
    icon: string;
    text: string;
  }

export const IconText: React.FC<IconTextProps> = ({ icon, text }) => {
  return (
    <div className="flex gap-3 items-center max-md:text-4xl">
      <img loading="lazy" src={icon} alt="" className="object-contain shrink-0 self-stretch my-auto aspect-[1.43] w-[43px]" />
      <div className="self-stretch my-auto bg-clip-text text-slate-200 max-md:text-4xl">
        {text}
      </div>
    </div>
  );
};