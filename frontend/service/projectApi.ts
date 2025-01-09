import axios from "axios";
import qs from "qs";

import API_URL from "./ApiUrl";

export async function getDocumentInProject(projectId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(
    `${API_URL}/api/projects/${projectId}/documents`,
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

export async function getImagesInProject(projectId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(
    `${API_URL}/api/projects/${projectId}/images`,
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
export async function getConversationInProject(projectId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(
    `${API_URL}/api/projects/${projectId}/conversations`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getDocumentById(documentId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(`${API_URL}/api/documents/${documentId}`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/json",
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return response;
}

export async function createNewConversation(
  name: string,
  projectId: string,
  documentIds: string[],
) {
  const accessToken = localStorage.getItem("access_token");

  const data = qs.stringify({
    project_id: projectId,
    name: name,
    document_ids: documentIds.join(","),
  });

  const response = await axios.post(
    `${API_URL}/api/projects/new-conversation`,
    data,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getProjectById(projectId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(`${API_URL}/api/projects/${projectId}`, {
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return response;
}

export async function getNotesInProject(projectId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(
    `${API_URL}/api/projects/${projectId}/notes`,
    {
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function renameConversation(
  conversationId: string,
  newName: string,
) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.post(
    `${API_URL}/api/conversations/${conversationId}/rename`,
    new URLSearchParams({
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

export async function deleteConversation(conversationId: string) {
  const accessToken = localStorage.getItem("access_token");

  const response = await axios.delete(
    `${API_URL}/api/conversations/${conversationId}`,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return response;
}

export async function getChatHistory(conversationId: string) {
  const accessToken = localStorage.getItem("access_token");
  const response = await axios.get(
    `${API_URL}/api/conversations/${conversationId}/get-chat-history`, {
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )
  return response
}

export async function translateText(text: string, source: string, target: string) {
  const accessToken = localStorage.getItem("access_token");

  const url = `${API_URL}/translate/text?text=${encodeURIComponent(text)}&source_language=${encodeURIComponent(source)}&target_language=${encodeURIComponent(target)}`;

  const response = await axios.get(url, {
    headers: {
      'accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
  });

  return response
}