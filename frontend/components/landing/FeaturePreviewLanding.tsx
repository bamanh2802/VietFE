import * as React from 'react';
import {Image} from "@nextui-org/image";
import { useTranslations } from 'next-intl';
import { IconText } from './IconText';

const headerItems = [
    {
        icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/0e3b2518674cd40074753396fc4f9b23518d02ba507db4696f4536a3d53484de?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd",
        text: "Project,"
      },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/df8796388f39725fc36012921f0ef1db598c477bd807eb8a7fe412b8e5fd1537?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd",
      text: "Note,"
    },
    {
      icon: "https://cdn.builder.io/api/v1/image/assets/TEMP/66af239297a6be4d44e8d916c4f95077bbbc9af7ec6330d703e89623da82cafd?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd",
      text: "Documents"
    }
  ];

export const FeaturePreviewLanding: React.FC = () => {
  const t = useTranslations('LandingPage');

  return (
    <div className="bg-white flex flex-col justify-center items-center py-16">
      <div className="flex flex-col justify-center items-center max-w-full w-[1224px]">
        <div className="flex flex-col items-center font-bold text-center max-md:max-w-full">
          <div className="text-6xl tracking-tighter leading-none bg-clip-text text-gray-800 max-md:max-w-full max-md:text-4xl">
             {t('FeaturePreviewTitle')}
          </div>
          <div className="flex flex-wrap gap-8 items-start mt-5 text-5xl tracking-tighter leading-none whitespace-nowrap max-md:max-w-full max-md:text-4xl">
            {headerItems.map((item, index) => (
              <IconText key={index} {...item} />
            ))}
          </div>
        </div>

        <div className="flex flex-col mt-16 w-full max-w-[1224px] max-md:mt-10 max-md:max-w-full">
          <div className="flex relative gap-10 items-start p-16 w-full rounded-xl border border-solid bg-gray-100 border-gray-200 max-md:px-5">
            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7e06f12dd807dd5c94c30328dd7e6d657c32347728b3083af3b152d978f9790?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd" alt="" className="object-contain absolute top-0 left-0 z-0 self-start rounded-none aspect-[1.13] h-[512px] min-w-[240px] w-[577px] max-md:max-w-full" />
            
            <div className="flex z-0 flex-col my-auto min-w-[240px] w-[465px] max-md:max-w-full">
              <div className="flex flex-col w-full max-md:max-w-full">
                <div className="text-3xl font-bold tracking-tighter leading-10 text-gray-800 max-md:max-w-full">
                {t('FeaturePreviewCard1Title')}
                </div>
                <div className="mt-4 text-base leading-6 text-gray-600 max-md:max-w-full">
                {t('FeaturePreviewCard1Description')}
                </div>
              </div>
              <button className="gap-2.5 self-start px-6 py-4 mt-9 text-base font-medium leading-none border border-solid border-gray-300 rounded-[46px] text-gray-800 hover:bg-gray-100 transition-colors max-md:px-5">
                Learn More
              </button>
            </div>

            <div className="flex z-0 flex-col flex-1 shrink my-auto rounded-none basis-0 min-w-[240px] max-md:max-w-full">
              <div className="flex flex-col px-5 py-5 rounded-xl border border-solid bg-white border-gray-200 max-md:pr-5 max-md:max-w-full">
                <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/5cb72316eae9271b39a6ea2a94b8f06fd6f5c01cd7cbecc9429a7b5976aea7a1?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd" alt="" className="object-contain rounded-none aspect-[19.61] w-[473px] max-md:max-w-full" />
                <Image
                    isBlurred
                    isZoomed
                    alt="NextUI hero Image"
                    src="/img/notes.jpg"
                    className='w-full h-full mt-6'
                    radius="md"
                />
              </div>
            </div>

            <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/e17bc0ba2a4b7fe839aa1e1b5df3b375d99258b0534a8a10dc4a11440cbd2dd8?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd" alt="" className="object-contain absolute top-0 right-0 z-0 self-start rounded-none aspect-[1.21] h-[512px] min-w-[240px] w-[619px] max-md:max-w-full" />
          </div>

          <div className="flex gap-10 items-start mt-10 max-md:max-w-full">
            <div className="flex relative flex-col items-start px-14 py-12 rounded-xl border border-solid bg-gray-100 border-gray-200 min-w-[240px] w-[496px] max-md:px-5 max-md:max-w-full">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/659ae9e1ff4abebe12f4b0276e75d59a554d2ff1c768702563ea009db4e1477a?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd" alt="" className="object-contain absolute right-0 bottom-0 z-0 max-w-full rounded-none aspect-[2.31] h-[215px] w-[496px]" />
              <div className="flex z-0 flex-col self-center max-w-full w-[386px]">
                <div className="text-3xl font-bold tracking-tighter leading-none text-gray-800">
                {t('FeaturePreviewCard2Title')}
                </div>
                <div className="mt-4 text-base leading-6 text-gray-600">
                {t('FeaturePreviewCard2Description')}
                </div>
                <div className="m-auto mt-4 flex flex-col px-5 pt-5 w-fit rounded-xl border border-solid bg-gray-50 border-gray-200 max-md:max-w-full">
                <Image
                    isBlurred
                    alt="NextUI hero Image"
                    src="/img/note.jpg"
                    className='w-full h-full'
                    radius="md"
                />
                </div>
              </div>
            </div>

            <div className="flex relative flex-col items-center px-14 pt-12 rounded-xl border border-solid bg-gray-100 border-gray-200 min-w-[240px] w-[690px] max-md:px-5 max-md:max-w-full">
              <img loading="lazy" src="https://cdn.builder.io/api/v1/image/assets/TEMP/90ccec602f6137a9abb270e789ab8cb33450b39c4534372928ed073f778f26d7?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd" alt="" className="object-contain absolute top-0 left-0 z-0 max-w-full rounded-none aspect-[3.76] h-[183px] w-[689px]" />
              <div className="flex z-0 flex-col self-center max-w-full w-[578px]">
                <div className="text-3xl font-bold tracking-tighter leading-none text-gray-800 max-md:max-w-full">
                {t('FeaturePreviewCard3Title')}
                </div>
                <div className="mt-4 text-base leading-6 text-gray-600 max-md:max-w-full">
                {t('FeaturePreviewCard3Description')}
                </div>
              </div>
              <div className="flex z-0 flex-col self-center mt-8 max-w-full rounded-none w-[580px]">
                <div className="flex flex-col px-5 pt-5 w-full rounded-xl border border-solid bg-gray-50 border-gray-200 max-md:max-w-full">
                <Image
                    isBlurred
                    isZoomed
                    alt="NextUI hero Image"
                    src="/img/files.jpg"
                    className='w-full h-full'
                    radius="md"
                />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

