'use client'
import * as React from 'react';
import { Button } from '@nextui-org/button';
import { useTypingEffect } from '@/src/hook/useTypingEffect';
import { useTranslations } from 'next-intl';


interface HeroLandingProps {
  openLogin: () => void
}

const HeroLanding:React.FC<HeroLandingProps> = ({openLogin}) => {
  const typingText = useTypingEffect(['Knowledge Management', 'Research'], 100, 50, 2000);
  const t = useTranslations('LandingPage');



  return (
    <div id='home' className="flex relative flex-col pt-16 pb-10 bg-[#ffffff]">
      <div className="flex z-0 justify-center items-center self-center max-w-full w-[1224px]">
        <div className="mt-12 flex flex-col items-center self-stretch my-auto min-w-[240px] max-md:max-w-full">
          <div className="flex flex-col items-center max-md:max-w-full">
            <div className="flex flex-col items-center text-center max-md:max-w-full">
              <h1 className="text-6xl text-slate-800 font-bold tracking-tighter leading-none bg-clip-text max-md:max-w-full max-md:text-4xl">
                {t('HeroTitle')} <span className="text-[#3a7bd5]">{typingText}</span>
              </h1>
              <p className="mt-8 text-lg leading-7 text-slate-700 w-[799px] max-md:max-w-full">
              {t('HeroDescription')}
              </p>
            </div>
            <div className="flex gap-8 items-start mt-8 text-base">
              <Button 
                variant="flat" 
                onClick={openLogin}
                className="bg-[#3a3a3a] text-[#f8f7f4] hover:bg-[#2c2c2c] transition-colors duration-200"

              >
                Get Started
              </Button>
            </div>
          </div>
          <div className="relative mt-12 max-w-[1052px] max-md:mt-10">
            <div className="absolute inset-0 bg-[#3a7bd5] opacity-5 rounded-lg"></div>
            <img
              loading="lazy"
              src="/img/home.jpg"
              alt="User interface demonstration"
              className="w-full h-full rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 shadow-lg shadow-[#3a7bd5]/10 rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroLanding;

