'use client'
import React, { useEffect, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@nextui-org/dropdown";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "@nextui-org/react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import { Avatar } from "@nextui-org/avatar";
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
  const [openSetting, setOpenSetting] = useState(false);
  const [isFeedbackOpen, setFeedbackOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!user.user_id) {
      handleGetUser();
    }
  }, [user.user_id]);

  const handleGetUser = async () => {
    try {
      const data = await getUser();
      if (data?.data?.msg) {
        dispatch(setUser(data.data.msg));
      } else {
        console.error("Invalid user data received");
      }
    } catch (e) {
      console.error("Error fetching user:", e);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      router.push("/");
      await Logout();
      dispatch(clearUser());
      dispatch(clearProjects());
      dispatch(clearDocuments());
      dispatch(clearConversations());
      localStorage.removeItem("access_token");
    } catch (e) {
      console.error("Error during logout:", e);
      alert("Failed to log out. Please try again.");
    } finally {
      setIsLoggingOut(false);
      setLogoutModalOpen(false);
    }
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
          <DropdownItem textValue="profile" key="profile" className="h-14 gap-2">
            <p className="font-semibold">Signed in as</p>
            <p className="font-semibold">{user?.email}</p>
          </DropdownItem>
          <DropdownItem textValue="settings" key="settings" onPress={() => setOpenSetting(true)}>
            Settings
          </DropdownItem>
          <DropdownItem textValue="analytics" key="analytics">Analytics</DropdownItem>
          <DropdownItem textValue="help_and_feedback" key="help_and_feedback" onPress={() => setFeedbackOpen(true)}>
            Help & Feedback
          </DropdownItem>
          <DropdownItem textValue="logout" key="logout" color="danger" onPress={() => setLogoutModalOpen(true)}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={openSetting} size="5xl" onOpenChange={setOpenSetting}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">User Setting</ModalHeader>
              <ModalBody>
                <AccountSettings updateData={handleGetUser} user={user} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {isFeedbackOpen && (
        <Feedback
          open={isFeedbackOpen}
          onClose={() => setFeedbackOpen(false)}
          onSubmit={(feedback) => console.log("Feedback submitted:", feedback)}
        />
      )}

      <Modal isOpen={isLogoutModalOpen} onOpenChange={setLogoutModalOpen}>
        <ModalContent>
          <ModalHeader>Confirm Logout</ModalHeader>
          <ModalBody>
            <p>Are you sure you want to log out?</p>
          </ModalBody>
          <ModalFooter>
            <Button onPress={() => setLogoutModalOpen(false)} disabled={isLoggingOut}>
              Cancel
            </Button>
            <Button color="danger" onPress={handleLogout} isLoading={isLoggingOut}>
              Log Out
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UserDropdown;
