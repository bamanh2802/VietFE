import * as React from "react";

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="cursor-pointer relative flex bg-opacity-75 flex-col py-8 pr-10 pl-8 rounded-xl border border-solid bg-gray-100 backdrop-blur-sm border-gray-200 min-w-[240px] w-[393px] max-md:px-5 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-gray-50 hover:border-gray-300 hover:shadow-lg hover:shadow-blue-500/20 group">
      <img 
        loading="lazy"
        src="https://cdn.builder.io/api/v1/image/assets/TEMP/659ae9e1ff4abebe12f4b0276e75d59a554d2ff1c768702563ea009db4e1477a?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd" 
        alt="Background decoration"
        className="object-contain absolute top-[calc(-2rem+9px)] right-0 bottom-0 z-0 max-w-full rounded-none aspect-[2.31] h-[215px] w-[496px]"
      />

      <img
        loading="lazy"
        src={icon}
        alt=""
        className="z-20 object-contain w-12 aspect-square transition-transform duration-300 ease-in-out group-hover:scale-110 group-hover:rotate-3"
      />

      <div className="flex flex-col mt-8 w-full">
        <div className="text-2xl font-bold tracking-tighter leading-none text-gray-800 transition-colors duration-300 ease-in-out group-hover:text-blue-600">
          {title}
        </div>
        <div className="mt-3 text-base leading-6 text-gray-600 transition-colors duration-300 ease-in-out group-hover:text-gray-700">
          {description}
        </div>
      </div>
    </div>
  );
}
