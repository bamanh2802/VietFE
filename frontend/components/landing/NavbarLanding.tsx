import React from "react";

  import {Image} from "@nextui-org/image";
  import {Button, ButtonGroup} from "@nextui-org/button";
  import {Link} from "@nextui-org/link";
  import {  
    Navbar,   
    NavbarBrand,   
    NavbarContent,   
    NavbarItem} from "@nextui-org/navbar";
import { useTranslations } from 'next-intl';

interface NavbarLandingProps {
  openLogin: () => void
}

const NavbarLanding: React.FC<NavbarLandingProps> = ({openLogin}) => {
  const t = useTranslations('LandingPage');


  return (
    <Navbar 
      shouldHideOnScroll 
      className="bg-[#ffffff] border-b-1 border-[#e0ded8] shadow-sm"
    >
      <NavbarBrand>
        <Image
          alt="Logo"
          src="/favicon.ico"
          width={24}
          height={24}
          className="mr-2 invert"
        />
        <p className="font-bold text-inherit text-[#2c2c2c] text-lg tracking-tight">iet.</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center">
        <NavbarItem>
          <Link 
            className="text-[#4a4a4a] hover:text-[#2c2c2c] transition-colors duration-200" 
            href="#home"
          >
            {t('Home')}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            className="text-[#4a4a4a] hover:text-[#2c2c2c] transition-colors duration-200" 
            href="#feature"
          >
            {t('Feature')}
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link 
            className="text-[#4a4a4a] hover:text-[#2c2c2c] transition-colors duration-200" 
            href="#feedback"
          >
            {t('Pricing')}
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button 
            onClick={openLogin} 
            className="bg-[#3a3a3a] text-[#f8f7f4] hover:bg-[#2c2c2c] transition-colors duration-200"
          >
            Login
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default NavbarLanding;

