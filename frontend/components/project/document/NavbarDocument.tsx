'use client'

import React from "react";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/breadcrumbs";
import {  Navbar,   NavbarBrand,   NavbarContent,   NavbarItem} from "@nextui-org/navbar";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

import UserDropdown from "@/components/global/UserDropdown";

interface NavbarDocumentProps {
  projectName: string;
  documentName: string;
  projectId: string
}

const NavbarDocument: React.FC<NavbarDocumentProps> = ({
  projectName,
  documentName,
  projectId
}) => {
  const router = useRouter()

  const handleBackHome = () => {
    router.push('/home')
  }
  const handleBackProject = () => {
    router.push(`/project/${projectId}`)
  }

  return (
    <Navbar
      isBordered
      className="bg-zinc-50 dark:bg-zinc-800 navbar-custom h-12"
      style={{ width: "calc(100%)" }}
    >
      <NavbarBrand className="basis-full">
        <Breadcrumbs>
          <BreadcrumbItem onClick={handleBackHome}>
            <HomeIcon className="w-4 h-4" />
          </BreadcrumbItem>
          <BreadcrumbItem onClick={handleBackProject}>{projectName}</BreadcrumbItem>
          <BreadcrumbItem>{documentName}</BreadcrumbItem>
        </Breadcrumbs>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-4" justify="center" />
      <NavbarContent justify="end">
        <NavbarItem className="">
          <UserDropdown />
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarDocument;
