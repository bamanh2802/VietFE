import axios from "axios";

import API_URL from "./ApiUrl";

export async function uploadDocument(projectId: string, selectedFiles: File[]) {
  const accessToken = localStorage.getItem("access_token");

  const formData = new FormData();

  selectedFiles.forEach((file: File) => formData.append("files", file));
  formData.append("project_id", projectId);

  const response = await axios.post(
    `${API_URL}/api/projects/new-document`,
    formData,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
}


export async function getDocumentsByConversation(conversation_id: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/conversations/${conversation_id}/documents`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getChunkDocument(documentId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/documents/${documentId}/chunks`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getConversationByDocument(documentId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/conversations/${documentId}/get-by-doc`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function deleteDocument(documentId: string, projectId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.post(
    `${API_URL}/api/documents/delete`,
    {
      document_id: documentId,
      project_id: projectId
    },
    {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function summarizeDocument(documentId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/documents/${documentId}/summarize`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function shallowOutlineDocument(documentId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/documents/${documentId}/shallow-outline`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}
export async function renameDocument(documentId: string, newName: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.post(
    `${API_URL}/api/documents/rename`,
    new URLSearchParams({
      document_id: documentId,
      new_name: newName,
    }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export async function keywordSearchChunks(documentId: string, query: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/documents/${documentId}/kw-search/chunks?query=${query}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getDocumentUrl (documentId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.get(
    `${API_URL}/api/get-download-url/${documentId}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'accept': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getDocumentById (documentId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(
    `${API_URL}/api/documents/${documentId}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        'accept': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function uploadUrlDocument(url: string, projectId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.post(
    `${API_URL}/api/projects/new-document-from-url`,
    {
      url: url,
      project_id: projectId,
    },
    {
      headers: {
        "Content-Type": "application/json", 
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );

  return response;
}