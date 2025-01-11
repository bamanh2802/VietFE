import axios from "axios";
import qs from "qs";

import API_URL from "./ApiUrl";

export async function createNewNote(
  projectId: string,
  title: string = "Untitled Note",
  content: string = "",
  chunkIds: string[] = [],
  formatted_text: string = ""
) {
  const accessToken = localStorage.getItem("access_token");

  const data = qs.stringify({
    project_id: projectId,
    title: title,
    content: content,
    chunk_ids: chunkIds.join(","),
    formatted_text: formatted_text
  });
  console.log(data)

  const response = await axios.post(`${API_URL}/api/projects/new-note`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response;
}

export async function getAllNotesByUser(projectId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(
    `${API_URL}/api/notes/all-by-user?user_id=${projectId}`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getNoteById(noteId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(`${API_URL}/api/notes/${noteId}`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}

export async function renameNote(noteId: string, newName: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.put(
    `${API_URL}/api/notes/rename`,
    new URLSearchParams({
      note_id: noteId,
      new_name: newName,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function editNote(noteId: string, content: string, formatted_text: string) {
  const accessToken = localStorage.getItem("access_token");
  console.log(formatted_text)
  const response = await axios.put(
    `${API_URL}/api/notes/edit`,
    new URLSearchParams({
      note_id: noteId,
      content: content,
      formatted_text: formatted_text
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function deleteNote(noteId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.delete(`${API_URL}/api/notes/delete`, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
    },
    data: {
      note_id: noteId,
    },
  });

  return response;
}

export async function createNoteFromIdShared(shareId: string, projectId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.post(
    `${API_URL}/api/notes/create-shared-note`, {

    }, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      }
    }
  )
  return response
}

export async function getSharedNoteId(noteId: string, userId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/notes/${noteId}/get-shared-id`,
    {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        user_id: userId,
      },
    }
  );

  return response;
}

export async function getSharedNoteInfo (noteId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/notes/${noteId}/get-shared-info`, {
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )

  return response
}