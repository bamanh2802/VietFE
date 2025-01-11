import axios from "axios";
import qs from "qs";

import API_URL from "./ApiUrl";

export async function QuickiesGatherInfo(document_ids: string[], keyword: string) {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        throw new Error("Access token is missing. Please log in.");
    }

    const response = await axios.get(
        `${API_URL}/quickies/gather-info`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                document_ids: document_ids.join(","),
                kw: keyword,
            },
        }
    );

    return response;
}

export async function QuickiesSearchWiki(keyword: string) {
    const accessToken = localStorage.getItem("access_token");

    const response = await axios.get(
        `${API_URL}/quickies/search-wikipedia`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                kw: keyword,
            },
        }
    );

    return response;
}
export async function QuickiesDefine(document_ids: string[], keyword: string) {
    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
        throw new Error("Access token is missing. Please log in.");
    }

    const response = await axios.get(
        `${API_URL}/quickies/define`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                document_ids: document_ids.join(","),
                kw: keyword,
            },
        }
    );

    return response;
}

export async function QuickiesCompare(document_ids: string[], keyword: string[]) {
    const accessToken = localStorage.getItem("access_token");

    const response = await axios.get(
        `${API_URL}/quickies/compare`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                document_ids: document_ids.join(","),
                kw_list: keyword.join(","),
            },
        }
    );

    return response;
}

export async function QuickiesSearchWeb(keyword: string) {
    const accessToken = localStorage.getItem("access_token");

    const response = await axios.get(
        `${API_URL}/quickies/search-web`,
        {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            params: {
                kw: keyword,
            },
        }
    );

    return response;
}
