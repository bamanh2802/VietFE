import * as React from 'react';
export interface FileItemProps {
    icon: string;
    name: string;
    type: string;
    size: string;
  }

export const FileItem: React.FC<FileItemProps> = ({ icon, name, type, size }) => {
  return (
    <div className="flex flex-wrap gap-10 items-center w-full max-md:max-w-full">
      <div className="flex gap-4 items-center self-stretch my-auto w-44">
        <div className="flex shrink-0 self-stretch my-auto w-4 h-4 rounded border border-gray-700 border-solid bg-slate-900" />
        <div className="flex gap-2.5 items-center self-stretch my-auto">
          <div className="flex gap-2.5 items-center self-stretch p-2 my-auto w-9 h-9 rounded-md border border-solid bg-slate-900 border-slate-800">
            <img loading="lazy" src={icon} alt="" className="object-contain w-5 aspect-square" />
          </div>
          <div className="self-stretch my-auto text-sm leading-none text-slate-400">
            {name}
          </div>
        </div>
      </div>
      <div className="flex-1 shrink self-stretch my-auto text-sm leading-none basis-0 text-slate-400">
        {type}
      </div>
      <div className="flex-1 shrink self-stretch my-auto text-sm leading-none text-right basis-0 text-slate-400">
        {size}
      </div>
        <div className="flex shrink-0 self-stretch my-auto w-4 h-4 rounded border border-gray-700 border-solid bg-slate-900" />

    </div>
  );
};