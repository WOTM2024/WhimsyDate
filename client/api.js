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
  const url = `api/activities${queryString}`;

  return api
    .get(url)
    .then(({ data }) => {
      return data.data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};
export const fetchFoods = () => {
  return api
    .get("/api/foods")
    .then(({ data }) => {
      return data.data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};
export const fetchTvShows = () => {
  return api
    .get("/api/tvshows")
    .then(({ data }) => {
      return data.data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};
export const fetchMovies = () => {
  return api
    .get("/api/movies")
    .then(({ data }) => {
      return data.data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};
      