import { useTranslations } from 'next-intl';
import Image from 'next/image'; 

export interface TestimonialProps {
  image: string;
  name: string;
  role: string;
  content: string;
}

export const TestimonialCard = ({ image, name, role, content }: TestimonialProps) => {
  const t = useTranslations('LandingPage');
  return (
    <div className="flex flex-col items-center min-w-[240px] w-[343px]">
      <div className="flex relative flex-col flex-1 p-6 w-full rounded-xl border border-solid bg-gray-100 border-gray-200 max-w-[343px] max-md:px-5">
        <div className="flex z-0 gap-2.5 items-center w-full leading-none">
          <Image
            loading="lazy"
            src={image}
            alt={`${name}'s profile`} 
            width={40} 
            height={40} 
            className="object-contain shrink-0 self-stretch my-auto w-10 rounded-xl aspect-square"
          />
          <div className="flex flex-col self-stretch my-auto w-40">
            <div className="text-base font-medium text-gray-800">
              {name}
            </div>
            <div className="mt-2.5 text-xs text-gray-500">
              {role}
            </div>
          </div>
        </div>
        <div className="z-0 mt-6 text-base leading-6 text-gray-800">
          {t(content)}
        </div>
        <Image
          loading="lazy"
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/0f3523233a7fa57af6bf46bc2dc70313356335e7303ccbe8e9e2f471207bbd3b?placeholderIfAbsent=true&apiKey=6f8a1d6b6ede4dea9ab29771b7b9c7dd"
          alt="" // Không cần alt nếu không có mô tả
          width={57} // Đặt kích thước cho image
          height={41} // Đặt kích thước cho image
          className="object-contain absolute z-0 aspect-[1.39] fill-gray-100 h-[41px] right-[25px] top-[25px] w-[57px]"
        />
      </div>
    </div>
  );
};
