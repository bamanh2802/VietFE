import { FC } from "react";
import React, { useState } from "react";
import { useRouter } from "next/router";

const Project: FC = () => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);
  const { projectId } = router.query;
  const validProjectId = Array.isArray(projectId)
    ? projectId[0]
    : projectId || "";

  return (
    <div className="flex box-border">
      {/* <div className="">
                <Sidebar projectId={validProjectId}/>
                </div>
            <div className="">
                <Sidebar />
            </div>
            <div className="flex flex-col w-full">
                <NavbarProject onOpenDialog={openDialog} />
                <WorkSpace />
                <NewWorkspace isOpen={isDialogOpen} onClose={closeDialog} />
            </div> */}
    </div>
  );
};

export default Project;
