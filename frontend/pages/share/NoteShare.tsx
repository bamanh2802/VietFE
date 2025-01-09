import React, {useEffect, useState} from "react"
import { Note } from "@/src/types/types"
import RichTextEditor from "../project/[project_id]/Note"
import { getSharedNoteInfo } from "@/service/noteApi"
import NavbarShare from "./NavbarShare"
import { Button } from "@/components/ui/button"
import { PencilSquareIcon } from "@heroicons/react/24/outline"
import SignInForm from "@/components/global/SignInForm"
import AddProject from "./AddProject"

interface NoteShareProps {
    noteId: string
}

const NoteShare: React.FC<NoteShareProps> = ({noteId}) => {
    const [note, setNote] = useState<Note>()
    const token = localStorage.getItem('access_token');
    const isAuthenticated = !!token;
    const [isOpenSignIn, setIsOpenSignIn] = useState<boolean>(false)
    const [isOpenProjectList, setIsOpenProjectList] = useState<boolean>(false)

    const handleToggleOpenProjectList = () => {
        setIsOpenProjectList(!isOpenProjectList)
    }
    const handleToggleSignIn = () => {
        setIsOpenSignIn(!isOpenSignIn)
    }

    const handleGetNote = async () => {
        try {
            const data = await getSharedNoteInfo(noteId)
            setNote(data.data);
            console.log(data)
        } catch (e) {
            console.log(e)
        }
    }

    const handleEditNote = () => {
        if (!isAuthenticated) {
            handleToggleSignIn()
        } else {
            handleToggleOpenProjectList()
        }
    }

    useEffect(() => {
        if(noteId !== undefined) {
            handleGetNote()
        }
    }, [noteId])
    

    return (
        <>
            <div className="relative w-full h-screen bg-[#ffffff] dark:bg-[#1f1f1f]">
                <NavbarShare isChat={false} openSigIn={handleToggleSignIn} isLogin={isAuthenticated}/>
                <RichTextEditor 
                    editNote={() => {}}
                    note={note as Note}
                    renameNote={() => {}}
                    selectedNote={noteId}
                    editable={false}
                    type="share"
                />
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <Button
                    onClick={handleEditNote}
                    >
                        <PencilSquareIcon className="w-4 h-4 mr-2"/>
                        Edit this note
                    </Button>
                </div>
                <SignInForm isOpen={isOpenSignIn} closeForm={handleToggleSignIn}/>
                <AddProject isOpen={isOpenProjectList} onClose={handleToggleOpenProjectList}/>
            </div>
        </>
    )
}

export default NoteShare