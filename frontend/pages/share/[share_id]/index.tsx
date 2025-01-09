"use client"
import React, {useEffect, useState} from "react";
import { useRouter } from "next/router";
import NoteShare from "../NoteShare";
import ChatShare from "../ChatShare";

const Share: React.FC = () => {
    const router = useRouter()
    const {share_id} = router.query
    const [isNote, setIsNote] = useState<boolean>(false)

    useEffect(() => {
        if(share_id !== undefined) {
            setIsNote(String(share_id).startsWith("note-"));
        }
    }, [share_id])
    return (
        <>
        {isNote ? 
            (
                <NoteShare noteId={share_id as string} />
            ) 
            : 
            (
                <ChatShare chatId={share_id as string}/>
            )}
        </>
    )
}

export default Share