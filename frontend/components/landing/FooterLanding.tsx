import * as React from 'react';
import { SocialIcon } from './SocialIcon';
import { NewsletterForm } from './NewsletterForm';

const socialIcons = [
  { src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/d7430755a5ef7c4060856c3d092f565597e0a752f6bbb85d8f51e7963f26d6f8?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd', alt: 'Social media icon 1' },
  { src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/89e914090388690d034e64ca3f13c2f0a7c2827ec72c57836c87ebd7c0549157?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd', alt: 'Social media icon 2' },
  { src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/ad956b4595e0a510df95aef86f508d7c97abe812ab49ecea9946e52e1889eb0e?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd', alt: 'Social media icon 3' },
  { src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9fd75effeefca27075b75e8b3bcb00282c6efee6404c7595146cf5e240f231fc?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd', alt: 'Social media icon 4' }
];

export const FooterLanding: React.FC = () => {
  return (
    <div className="bg-[#fbfbfb] flex flex-col items-center pt-24 pb-10 w-full  max-md:max-w-full">
      <div className="flex relative flex-col justify-center max-w-full w-[1224px]">
        <img
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/85bec4d7fd70d1602d06df5d04d9c5f16613fc6156faa19cbf3572e3e33cb243?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd"
          alt="Background decoration"
          className="object-contain absolute top-2/4 left-2/4 z-0 -translate-x-2/4 -translate-y-2/4 aspect-[3.28] h-full w-[1920px] max-md:max-w-full"
        />
        <div className="flex z-0 flex-col self-center max-md:max-w-full">
          <div className="flex flex-wrap gap-10 max-md:max-w-full">
            <div className="flex flex-col self-start min-w-[240px] w-[393px]">
              <div className="flex relative flex-col max-w-full w-[155px]">
                <div className="flex z-0 gap-2.5 items-center w-full max-w-[155px]">
                  <img src="favicon.ico" alt="logo" className='w-[40px]'/>
                  <div className="flex gap-0.5 justify-center items-end self-stretch my-auto">
                    {[2, 3, 4, 5, 6, 7, 8].map((num) => (
                      <img
                        key={num}
                        loading="lazy"
                        src={`http://b.io/ext_${num}-`}
                        alt=""
                        className="object-contain shrink-0 w-3.5 aspect-[0.74]"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col font-medium text-slate-400">
             
            </div>

            

            <div className="flex flex-col font-medium text-slate-400">
              
            </div>
          </div>

          <div className="flex flex-col mt-11 w-full max-w-[1224px] max-md:mt-10 max-md:max-w-full">
            <div className="w-full border border-solid bg-slate-800 border-slate-800 min-h-[1px]" />
            <div className="flex flex-wrap gap-10 justify-between items-center mt-8 w-full max-md:max-w-full">
              <div className="self-stretch my-auto text-base leading-6 text-neutral-100 max-md:max-w-full">
                <span className="text-slate-400">Copyright © </span>Product
              </div>
              <div className="flex gap-4 items-start self-stretch my-auto">
                {socialIcons.map((icon, index) => (
                  <SocialIcon key={index} {...icon} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};