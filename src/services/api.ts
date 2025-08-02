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
    let response;

    if (axiosmethod === "get") {
      response = await axios.get(`${api_base_url}${url}`, { headers });
    } else {
      response = await axios[axiosmethod](`${api_base_url}${url}`, body, { headers });
    }

    console.log("response backend is: ", response);
    

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
  storeEmail: async (data: { email: string, password: string }) => {
    await PublicRequest("emails/fetch-sentemails", { data }, "post")
    return PublicRequest("emails/fetch-emails", { data }, "post");
  },
  storeSentEmail: async (data: { email: string, password: string }) => {
    return PublicRequest("emails/fetch-sentemails", { data }, "post");
  },
  getintrestedemails: async (account: string) => {
    return PublicRequest("slack/notify", {account}, "post")
  }
};
