import axios from "axios";
import { API_KEY } from "@env";

const api = axios.create({
  baseURL: `https://whimsydate.onrender.com/api`,
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
    .get("/foods")
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
    .get("/tvshows")
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
    .get("/movies")
    .then(({ data }) => {
      return data.data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};

export const addUserToDB = (reg_username, fb_uid) => {
  const userData = [{ username: reg_username, fb_id: fb_uid }];
  const convertedUserData = JSON.stringify(userData);
  // console.log(jsonData);

  return api
    .post("/users", convertedUserData)
    .then((response) => {
      // console.log(response);
      return response;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export const fetchUserByUID = (uid) => {
  return api
    .get(`/users/${uid}`)
    .then((response) => {
      // console.log("test123");
      return response;
    })
    .catch((error) => {
      // console.log("test321");
      console.error(error);
      throw error;
    });
};

export const fetchEntriesByUserCategory = (uid, category) => {
  console.log("category", category, "uid", uid);
  const query = [];
  if (uid) query.push(`${uid}`);
  if (category) query.push(`${category}`); // tv_shows
  // ["SqtaNzwPclaItIhPnyQV3U7v6g32", "tv_shows"]
  const queryString = query.length ? `${query.join("/")}` : "";
  const url = `/users/${queryString}`;

  console.log("url", url);

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

export const deleteUserByUID = (uid) => {
  // console.log("uid = ", uid);
  return api
    .delete(`/users/${uid}/delete`)
    .then((response) => {
      // console.log("Removed from database");
      // console.log(response);
      // return response.message;
    })
    .catch((error) => {
      // return { error: error };
      console.error(error);
    });
};

export const patchUserEntriesByEntryId = (userId, category, entryId) => {
  return api
    .patch(`/users/${userId}/${category}`, { entryId })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};
