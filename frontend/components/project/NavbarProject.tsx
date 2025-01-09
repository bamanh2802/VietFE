'use client'
import { FC } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Breadcrumbs,
  BreadcrumbItem,
} from "@nextui-org/react";
import { UsersIcon } from "lucide-react";
import { HomeIcon } from "@heroicons/react/24/outline";
import { useSelector } from "react-redux";

import { Note } from "@/src/types/types";

import UserDropdown from "../global/UserDropdown";
import { Button } from "../ui/button";

import { RootState } from "@/src/store/store";

interface NavbarProjectProps {
  ignoreNote: () => void;
  onOpenDialog: () => void;
  onOpenShare: () => void;
  setSelectedNote: (note: string) => void;
  note: Note;
  params: { project_id: string }; 

}
const NavbarProject: FC<NavbarProjectProps> = ({
  ignoreNote,
  setSelectedNote,
  onOpenDialog,
  onOpenShare,
  note,
  params
}) => {
  const router = useRouter();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const { project_id } = params

  const handleBackHome = () => {
    router.push("/home");
  };
  const getProjectNameById = (projectId: string | null) => {
    const project = projects?.find((proj) => proj.project_id === projectId);

    return project ? project.name : "Loading...";
  };

  const handleBackProject = () => {
    setSelectedNote("");
    ignoreNote();
  };

  return (
    <Navbar
      className={`${note ? "dark:bg-[#1f1f1f] bg-[#ffffff]" : "dark:bg-zinc-800 bg-zinc-100"}   navbar-custom h-14 max-w-none w-full`}
    >
      <NavbarBrand>
        <Breadcrumbs>
          <BreadcrumbItem onPress={handleBackHome}>
            <HomeIcon className="w-4 h-4" />
          </BreadcrumbItem>
          <BreadcrumbItem onPress={handleBackProject}>
            {getProjectNameById(project_id as string)}
          </BreadcrumbItem>
          {note && <BreadcrumbItem>{note.title}</BreadcrumbItem>}
        </Breadcrumbs>
      </NavbarBrand>

      <NavbarContent as="div" className="max-w-none" justify="end">
        <NavbarItem>
          {/* <Button
           size="sm"
          onClick={onOpenDialog}
          color="primary" variant="bordered" startContent={<PlusIcon className="w-5 h-5"/>}>
            New
          </Button>   */}
        </NavbarItem>
        <NavbarItem>
          <Button
            className="flex dark:bg-zinc-900"
            size="sm"
            variant="outline"
            onClick={onOpenShare}
          >
            <UsersIcon className="w-4 h-4 mr-3 " />
            Share
          </Button>
        </NavbarItem>
        <UserDropdown />
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarProject;
