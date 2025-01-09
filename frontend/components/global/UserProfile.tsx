import { useState } from "react";
import { Edit2, Menu, Upload } from "lucide-react";
import { Tooltip } from "@nextui-org/react";
import { useTheme } from "next-themes";
import {
  UserCircleIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useDarkMode from "@/src/hook/useDarkMode";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserInfor, changePassword } from "@/service/apis";
import { useToast } from "@/hooks/use-toast";

interface User {
  user_id: string;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  created_at: string;
  updated_at: string;
  dob: string;
  phone?: string;
}

export default function AccountSettings({
  user,
  updateData,
}: {
  user: User;
  updateData: () => void;
}) {
  const [activePage, setActivePage] = useState("myProfile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const sidebarItems = [
    { label: "My Profile", value: "myProfile", icon: UserCircleIcon },
    { label: "Security", value: "security", icon: ShieldCheckIcon },
    { label: "System", value: "system", icon: Cog6ToothIcon },
  ];

  return (
    <div className="flex flex-col sm:flex-row h-[70vh] max-h-[600px]">
      <div className={`sm:w-48 ${isSidebarOpen ? "block" : "hidden"} sm:block`}>
        <div className="p-4 sm:border-r h-full">
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.value}
                  className={`cursor-pointer transition-all w-full text-left py-2 px-3 text-sm rounded ${
                    activePage === item.value
                      ? "bg-zinc-600 dark:bg-zinc-400 text-primary-foreground"
                      : "text-foreground hover:bg-accent"
                  }`}
                  onClick={() => {
                    setActivePage(item.value);
                    setIsSidebarOpen(false);
                  }}
                >
                  <Icon className="h-5 w-5 inline-block mr-2" />
                  <button>{item.label}</button>
                </div>
              );
            })}
          </nav>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <Button
          className="mb-2 sm:hidden"
          size="icon"
          variant="outline"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <Menu className="h-4 w-4" />
        </Button>
        {activePage === "myProfile" && (
          <MyProfilePage updateData={updateData} user={user} />
        )}
        {activePage === "security" && (
          <SecurityPage updateData={updateData} user={user} />
        )}
        {activePage === "system" && <SystemPage />}
      </div>
    </div>
  );
}

function MyProfilePage({
  user,
  updateData,
}: {
  user: User;
  updateData: () => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const data = await updateUserInfor(
        editedUser.email,
        editedUser.first_name,
        editedUser.last_name,
      );

      console.log(data);
      updateData();
      toast({
        title: "Updated user information successfully!",
        description: "Waiting for data loading",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Updated user information failed!",
        description: "Something went wrong",
      });
    }
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatarFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">My Profile</h1>
      <div className="flex items-center justify-between space-x-4">
        <div className="flex items-center space-x-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              alt={`${editedUser.first_name} ${editedUser.last_name}`}
              src={
                avatarFile
                  ? URL.createObjectURL(avatarFile)
                  : "/placeholder.svg?height=64&width=64"
              }
            />
            <AvatarFallback>
              {editedUser.first_name[0]}
              {editedUser.last_name[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-lg font-semibold">
              {editedUser.first_name} {editedUser.last_name}
            </h2>
            <p className="text-sm text-muted-foreground">
              {editedUser.username}
            </p>
          </div>
        </div>
        {isEditing ? (
          <div className="flex space-x-2">
            <input
              accept="image/*"
              className="hidden"
              id="avatar-upload"
              type="file"
              onChange={handleAvatarChange}
            />
            <label htmlFor="avatar-upload">
              <Button size="sm" variant="outline">
                <Upload className="w-4 h-4 mr-2" />
                Upload Avatar
              </Button>
            </label>
            <Button
              disabled={isLoading}
              size="sm"
              variant="default"
              onClick={handleSave}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <span>Save</span>
              )}
            </Button>
          </div>
        ) : (
          <Button size="sm" variant="outline" onClick={handleEdit}>
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
      <Section title="Personal Information">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field
            label="First Name"
            name="first_name"
            readOnly={!isEditing}
            value={editedUser.first_name}
            onChange={handleInputChange}
          />
          <Field
            label="Last Name"
            name="last_name"
            readOnly={!isEditing}
            value={editedUser.last_name}
            onChange={handleInputChange}
          />
          <Field
            label="Email address"
            name="email"
            readOnly={true}
            value={editedUser.email}
            onChange={handleInputChange}
          />
          <Field
            label="Phone"
            name="phone"
            readOnly={!isEditing}
            value={editedUser.phone || ""}
            onChange={handleInputChange}
          />
          <Field
            colSpan={2}
            label="Date of Birth"
            name="dob"
            readOnly={!isEditing}
            type="date"
            value={editedUser.dob}
            onChange={handleInputChange}
          />
        </div>
      </Section>
    </div>
  );
}

function SecurityPage({
  user,
  updateData,
}: {
  user: User;
  updateData: () => void;
}) {
  const { toast } = useToast();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState(user.email);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingPassword, setIsLoadingPassword] = useState<boolean>(false);

  const handleEmailSave = async () => {
    // Here you would typically send the new email to your backend
    setIsLoading(true);
    console.log(newEmail);
    try {
      const data = await updateUserInfor(
        newEmail,
        user.first_name,
        user.last_name,
      );

      console.log(data);
      updateData();
      toast({
        title: "Updated user information successfully!",
        description: "Waiting for data loading",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Updated user information failed!",
        description: "Something went wrong",
      });
    }
    console.log("Saving new email:", newEmail);
    setIsEditingEmail(false);
    setIsLoading(false);
  };

  const handlePasswordSave = async () => {
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");

      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");

      return;
    }
    if (
      !/[A-Z]/.test(newPassword) ||
      !/[a-z]/.test(newPassword) ||
      !/[0-9]/.test(newPassword)
    ) {
      setPasswordError(
        "Password must contain at least one uppercase letter, one lowercase letter, and one number",
      );

      return;
    }
    setIsLoadingPassword(true);

    try {
      const data = await changePassword(currentPassword, newPassword);

      console.log(data);
      toast({
        title: "Change password successfully!",
        description: "Waiting for data loading",
      });
    } catch (e) {
      console.log(e);
      toast({
        title: "Change password failed!",
        description: "Something went wrong",
      });
    }
    console.log("Saving new password");
    setIsChangingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoadingPassword(false);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Security</h1>
      <Section title="Email address">
        {isEditingEmail ? (
          <div className="space-y-2">
            <Input
              placeholder="New email address"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsEditingEmail(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoading}
                size="sm"
                variant="default"
                onClick={handleEmailSave}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <span>Save</span>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user.email}</p>
              <p className="text-xs text-muted-foreground">
                The email address associated with your account.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsEditingEmail(true)}
            >
              Edit
            </Button>
          </div>
        )}
      </Section>
      <Section title="Password">
        {isChangingPassword ? (
          <div className="space-y-2">
            <Input
              placeholder="Current password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <Input
              placeholder="New password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              placeholder="Confirm new password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {passwordError && (
              <p className="text-sm text-red-500">{passwordError}</p>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={isLoadingPassword}
                size="sm"
                variant="default"
                onClick={handlePasswordSave}
              >
                {isLoadingPassword ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <span>Save</span>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Set a unique password to protect your account.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          </div>
        )}
      </Section>
      <Section title="2-step verification">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Make your account extra secure</p>
            <p className="text-xs text-muted-foreground">
              Along with your password, you will need to enter a code
            </p>
          </div>
          <Tooltip content="Future Feature">
            <Switch disabled />
          </Tooltip>
        </div>
      </Section>
      <Section title="Delete Account">
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            This will delete your account permanently.
          </p>
          <Button size="sm" variant="destructive">
            Delete
          </Button>
        </div>
      </Section>
    </div>
  );
}

function SystemPage() {
  const { theme, setTheme } = useTheme();
  const [isDarkMode, toggleDarkMode] = useDarkMode();

  const handleTheme = () => {
    toggleDarkMode();
    if (isDarkMode) {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">System</h1>
      <Section title="Dark Mode">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">Use dark mode theme</p>
          <Switch checked={isDarkMode} onClick={handleTheme} />
        </div>
      </Section>
      <Section title="Language">
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Select your preferred language
          </p>
          <Select disabled defaultValue="en">
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-2">
      <h3 className="text-md font-semibold">{title}</h3>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  readOnly,
  colSpan,
  name,
  type = "text",
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  readOnly?: boolean;
  colSpan?: number;
  name?: string;
  type?: string;
}) {
  return (
    <div className={colSpan ? `col-span-1 sm:col-span-${colSpan}` : ""}>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input
        className="mt-1 text-sm"
        name={name}
        readOnly={readOnly}
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
