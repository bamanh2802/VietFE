import { FC } from "react";
import { Share1Icon, TrashIcon } from "@radix-ui/react-icons";

interface NoteNavbarProps {
  title: string;
  lastModified: string;
}

const NoteNavbar: FC<NoteNavbarProps> = ({ title, lastModified }) => {
  return (
    <nav className=" flex justify-between h-9 items-center p-4 bg-zinc-900 text-white">
      {/* Tên Note */}
      <div className="text-sm ">{title}</div>

      {/* Các biểu tượng */}
      <div className="flex items-center space-x-4">
        <button className="hover:text-blue-400">
          <Share1Icon className="w-5 h-5" />
        </button>
        <button className="hover:text-red-400">
          <TrashIcon className="w-5 h-5" />
        </button>
        <span className="text-sm text-gray-400">{lastModified}</span>
      </div>
    </nav>
  );
};

export default NoteNavbar;
