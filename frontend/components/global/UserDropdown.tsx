'use client'
import React, { useEffect, useState } from "react";
import {  Dropdown,  DropdownTrigger,  DropdownMenu,  DropdownSection,  DropdownItem} from "@nextui-org/dropdown";
import { useRouter } from "next/navigation";
import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter} from "@nextui-org/modal";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import {Avatar} from "@nextui-org/avatar";
import { Logout, getUser } from "@/service/apis";
import { RootState } from "@/src/store/store";
import { setUser, clearUser } from "@/src/store/userSlice";
import { clearProjects } from "@/src/store/projectsSlice";
import { clearDocuments } from "@/src/store/documentSlice";
import { clearConversations } from "@/src/store/conversationSlice";

import AccountSettings from "./UserProfile";

const Feedback = dynamic(() => import("./Feedback"), {
  loading: () => <p>Loading...</p>,
  ssr: false, 
});

const UserDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const [openSetting, setOpenSetting] = useState<boolean>(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState<boolean>(false);

  const handleToggleSetting = () => setOpenSetting(!openSetting);
  const handleToggleFeedback = () => setFeedbackOpen(!isFeedbackOpen);
  const handleOpenFeedback = () => {
    setFeedbackOpen(true);
    // Đóng dropdown khi mở modal feedback
    document.body.click();
  };

  useEffect(() => {
    if (!user.user_id) {
      handleGetUser();
    }
  }, [user.user_id]);

  const handleGetUser = async () => {
    try {
      const data = await getUser();
      if (data && data.data && data.data.msg) {
        dispatch(setUser(data.data.msg));
      } else {
        console.error("Invalid user data received");
      }
    } catch (e) {
      console.error("Error fetching user:", e);
    }
  };

  const handleLogout = async () => {
    try {
      await Logout();
      dispatch(clearUser())
      dispatch(clearProjects())
      dispatch(clearDocuments())
      dispatch(clearConversations())
      localStorage.removeItem("access_token");
      router.push("/");
    } catch (e) {
      console.error("Error during logout:", e);
    }
  };

  const handleFeedbackSubmit = (feedback: string) => {
    console.log("Feedback submitted:", feedback);
    // Xử lý gửi feedback ở đây
  };

  return (
    <>
      <Dropdown placement="bottom-end">
        <DropdownTrigger>
          <Avatar
            isBordered
            showFallback
            as="button"
            className="transition-transform"
            name={user?.last_name}
            size="sm"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="Profile Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user?.email}</p>
          </DropdownItem>
          <DropdownItem key="settings" onPress={handleToggleSetting}>
            Settings
          </DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="help_and_feedback" onPress={handleOpenFeedback}>
            Help & Feedback
          </DropdownItem>
          <DropdownItem key="logout" color="danger" onPress={handleLogout}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={openSetting} size="5xl" onOpenChange={handleToggleSetting}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                User Setting
              </ModalHeader>
              <ModalBody className="max-w-none">
                <AccountSettings updateData={handleGetUser} user={user} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {isFeedbackOpen && (
        <Feedback
          open={isFeedbackOpen}
          onClose={handleToggleFeedback}
          onSubmit={handleFeedbackSubmit}
        />
      )}
    </>
  );
};

export default UserDropdown;
