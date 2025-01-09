import { FC } from "react";
import { useRouter } from "next/router";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/react";
import {Image} from "@nextui-org/react";
import { EyeIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";
import { Tooltip } from "@nextui-org/react";

import UserDropdown from "@/components/global/UserDropdown";

import { Button } from "@/components/ui/button";

import { RootState } from "@/src/store/store";

interface NavbarShareProps {
    isLogin: boolean
    openSigIn: () => void
    isChat: boolean
}
const NavbarShare: FC<NavbarShareProps> = ({
    isLogin,
    openSigIn,
    isChat
}) => {

  return (
    <Navbar
      className={`${!isChat ? "dark:bg-[#1f1f1f] bg-[#ffffff]" : "dark:bg-zinc-800 bg-zinc-100"}   navbar-custom h-14 max-w-none w-full`}
    >
      <NavbarBrand>
        <Image
            width={20}
            alt="NextUI hero Image"
            src="/favicon.ico" 
        />
        iet.
      </NavbarBrand>

      <NavbarContent as="div" className="max-w-none" justify="end">
        <NavbarItem>
                <Button
                disabled
                    className="flex dark:bg-zinc-900 border-none shadow-none"
                    size="sm"
                    variant="outline"
                >
                    <EyeIcon className="w-4 h-4 mr-3" />
                    Watch Only
                </Button>
        </NavbarItem>
        {isLogin ? (
            <UserDropdown />
        ) : (
            <>
            <NavbarItem>
                <Button
                    size="sm"
                    className="border-none"
                    onClick={openSigIn}
                >Login
                </Button>
            </NavbarItem>
            </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarShare;
