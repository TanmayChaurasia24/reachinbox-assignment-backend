import axios from "axios";

const api_base_url = "http://localhost:3000/api/";

const PublicRequest = async (url: string) => {
  const headers = {
    "Content-Type": "application/json",
  };

  try {
    const response: any = await axios.get(`${api_base_url}${url}`, {
      headers,
    });

    if (!response.data) {
      throw new Error("error in public request");
    }

    const data = await response.data.emails;

    if (!data) {
      throw new Error("Invalid response format: No data received");
    }

    return data;
  } catch (error) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error(
        "Network error: Unable to connect to the server. Please check if the backend is running."
      );
    }
    throw error;
  }
};

export const emailAPI = {
  getAll: async () => {
    return PublicRequest(`emails/allemails`);
  },
};
