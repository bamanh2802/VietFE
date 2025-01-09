import { Listbox, ListboxItem, Button, Selection, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@nextui-org/react";
import {
  PlusIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { ListboxWrapper } from "@/components/ListboxWrapper";
import { Project } from "@/src/types/types";
import { getAllProjectsWithInfo } from "@/service/apis";
import React, { useState, useEffect, FC } from "react";

import { useRouter } from "next/router";

interface AddProjectProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddProject: FC<AddProjectProps> = ({
  isOpen,
  onClose,
}) => {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([""]));
  const [searchValue, setSearchValue] = useState<string>("");
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys as Set<string>);
  };

  const handleGetProjects = async () => {
    try {
      const data = await getAllProjectsWithInfo();
      setProjects(data.data);
      setFilteredProjects(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleAddProject = async () => {
    const selectedDocsArray = Array.from(selectedKeys).filter(key => key !== '');
    console.log(selectedDocsArray)
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    
    const filtered = projects.filter(project => 
      project.name.toLowerCase().includes(value.toLowerCase())
    );
    
    setFilteredProjects(filtered);
  };

  useEffect(() => {
    if (filteredProjects !== undefined) {
        const selectedDocsArray = Array.from(selectedKeys).filter(key => key !== '');
      if (
        filteredProjects.length !== 0 &&
        selectedDocsArray.length !== 0
      ) {
        setIsDisable(false);
      } else {
        setIsDisable(true);
      }
    }
  }, [filteredProjects, selectedKeys]);

  useEffect(() => {
    handleGetProjects()
  }, [])
 
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      classNames={{
        base: "bg-zinc-50 dark:bg-zinc-900",
        header: "border-b-[1px] border-[#27272a]",
        footer: "border-t-[1px] border-[#27272a]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Project List</ModalHeader>
            <ModalBody>
              <Input
                placeholder="Search Project"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                className="mt-2"
              />
              <div className="custom-width mt-4">
                <ListboxWrapper>
                  <Listbox
                    disallowEmptySelection
                    aria-label="File selection"
                    className="max-w-none"
                    selectionMode="single"
                    variant="flat"
                    selectedKeys={selectedKeys}
                    onSelectionChange={handleSelectionChange}
                  >
                    {filteredProjects?.map((project) => (
                      <ListboxItem
                        key={project.project_id}
                        textValue="Add"
                        value={project.project_id}
                      >
                      <div className="flex items-center">
                      <UserIcon className="w-4 h-4 mr-1"/>
                        {project.name} 
                      </div>
                      </ListboxItem>
                    ))}
                  </Listbox>
                </ListboxWrapper>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                color="primary"
                isDisabled={isDisable}
                isLoading={isLoading}
                startContent={!isLoading && <PlusIcon className="w-5 h-5" />}
                onPress={handleAddProject}
              >
                Add
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default AddProject;

