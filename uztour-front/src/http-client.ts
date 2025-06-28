import axios from "axios";

export const BASE_URL = "https://uz-tours-backend-5286dae4a93e.herokuapp.com";
// const TEST_URL = "https://mw-test.tvcom.uz/";

const API = axios.create({
  baseURL: BASE_URL,
});

// const API_TEST = axios.create({
//   baseURL: TEST_URL,
//   method: "GET",
// });

API.interceptors.request.use(
  (config) => {
    config.params = {
      ...config.params,
    };
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export { API };
