import axios from "axios";
import { API_KEY } from "@env";

const api = axios.create({
  baseURL: `https://eu-west-2.aws.data.mongodb-api.com/app/data-gcmynou/endpoint`,
  headers: {
    "Content-Type": "application/json",
    "api-key": API_KEY,
  },
});

export const fetchActivities = (category, isCollaborative, cost) => {
  const query = [];
  if (category) query.push(`category=${category}`);
  if (isCollaborative) query.push(`isCollaborative=${isCollaborative}`);
  if (cost) query.push(`cost=${cost}`);
  const queryString = query.length ? `?${query.join("&")}` : "";
  const url = `/activities${queryString}`;

  return api
    .get(url)
    .then((response) => {
      console.log(response.data, "API response <<<<<<");
      return response.data.data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};

export const addUserToDB = (reg_username, fb_uid) => {
  const userData = [{ username: reg_username, fb_id: fb_uid }];

  return api
    .post("/api/users", userData)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.error(error);
    });
};
