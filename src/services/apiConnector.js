import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// function to handle both JSON and FormData
export const apiConnector = (method, url, bodyData, headers = {}, params) => {
  let contentType = "application/json";

  // if bodyData is FormData → switch content type
  if (bodyData instanceof FormData) {
    contentType = "multipart/form-data";
  }

  return axiosInstance({
    method,
    url,
    data: bodyData || null,
    headers: {
      "Content-Type": contentType,
      ...headers,
    },
    params: params || null,
  });
};
