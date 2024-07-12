import axios from "axios";
import { API_KEY } from "@env";

const api = axios.create({
  baseURL: `https://whimsydate.onrender.com/api`,
  headers: {
    "Content-Type": "application/json",
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
  // console.log("category", category, "uid", uid);
  const query = [];
  if (uid) query.push(`${uid}`);
  if (category) query.push(`${category}`); // tv_shows
  // ["SqtaNzwPclaItIhPnyQV3U7v6g32", "tv_shows"]
  const queryString = query.length ? `${query.join("/")}` : "";
  const url = `/users/${queryString}`;

  // console.log("url", url);

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
  return api
    .delete(`/users/${uid}/delete`)
    .then((response) => {})
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

export const addActivity = (activity_name, category, isCollaborative, cost) => {
  return api
    .post(`/activities`, { activity_name, category, isCollaborative, cost })
    .then(({ data }) => {
      // console.log("data from api>>>>>>>>>>", data);
      return data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};

export const addMovie = (movieName, movieGenre) => {
  return api
    .post(`/movies`, JSON.stringify({ title: movieName, genre: movieGenre }))
    .then(({ data }) => {
      // console.log("add movies response ====> ", data);
      return data;
    })
    .catch((error) => {
      console.error("API error", error);
      throw error;
    });
};

export const addShow = (showName, showGenre) => {
  return api
    .post(`/tvshows`, JSON.stringify({ show: showName, genre: showGenre }))
    .then(({ data }) => {
      // console.log("add tv shows response ====> ", data);
      return data;
    })
    .catch((error) => {
      console.error("API error", error);
      throw error;
    });
};

export const addFood = (foodName, isVegetarian, isVegan, isMeat, isAllergies) => {
  return api
    .post(
      `/foods`,
      JSON.stringify({ food: foodName, vegetarian: isVegetarian, vegan: isVegan, meat: isMeat, allergies: isAllergies })
    )
    .then(({ data }) => {
      // console.log("add food response ====> ", data);
      return data;
    })
    .catch((error) => {
      console.error("API error", error);
      throw error;
    });
};

export const postUserEntryToCategory = (userId, category, entryId) => {
  return api
    .post(`/users/${userId}/${category}`, { entryId })
    .then(({ data }) => {
      // console.log("data from post user blabla>>>>", data);
      return data;
    })
    .catch((err) => {
      console.error("API error", err);
      throw err;
    });
};

export const patchUserNameWithNewName = (uid, body) => {
  return api
    .patch(`/users/${uid}/username`, JSON.stringify([{ newUsername: body }]))
    .then((response) => {
      // console.log(response);
      return response;
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};
