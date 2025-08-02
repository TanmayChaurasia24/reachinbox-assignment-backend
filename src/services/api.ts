import axios from "axios";

const api_base_url = "http://localhost:3000/api/";

const PublicRequest = async (
  url: string,
  body: any = {},
  axiosmethod: "get" | "post" | "put" | "delete" = "get"
) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const config = {
      headers,
      ...(axiosmethod === "post" && { data: body }),
    };

    const response: any = await axios[axiosmethod](`${api_base_url}${url}`, config);

    if (!response.data) {
      throw new Error("No response data");
    }

    const data = response.data.emails;
    

    if (!data) {
      throw new Error("Invalid response format: No emails field");
    }

    return data;
  } catch (error: any) {
    console.error("API Request failed:", error.message || error);
    if (
      error instanceof TypeError &&
      error.message.includes("fetch")
    ) {
      throw new Error(
        "Network error: Unable to connect to the server. Please check if the backend is running."
      );
    }
    throw error;
  }
};

export const emailAPI = {
  getAll: async (account: string) => {
    return PublicRequest("emails/all/inbox", { account }, "post");
  },
  getsentemails: async (account: string) => {
    return PublicRequest("emails/all/sent", { account }, "post");
  },
};
