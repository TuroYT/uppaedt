import { CapacitorHttp, HttpOptions, HttpResponse } from "@capacitor/core";
import API_URL from "./ConfApi";

// Example of a GET request
export const doGet = async (apiPath: string) => {
  if (apiPath[0] != "/") {
    apiPath = "/" + apiPath;
  }

  console.log("Get request to ", API_URL + apiPath);
  const options = {
    url: API_URL + apiPath,
  };

  const response: HttpResponse = await CapacitorHttp.get(options);
  return response.data;

  // or...
  // const response = await CapacitorHttp.request({ ...options, method: 'GET' })
};

// Example of a POST request. Note: data
// can be passed as a raw JS Object (must be JSON serializable)
export const doPost = async (apiPath: string, datas: any) => {
  if (apiPath[0] != "/") {
    apiPath = "/" + apiPath;
  }

  console.log("POST request to ", API_URL + apiPath, "with data ", datas);
  const options: HttpOptions = {
    url: API_URL + apiPath,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: new URLSearchParams(datas).toString(),
  };

  const response: HttpResponse = await CapacitorHttp.post(options);
  return response.data;

  // or...
  // const response = await CapacitorHttp.request({ ...options, method: 'POST' })
};
