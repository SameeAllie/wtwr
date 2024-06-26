import { checkResponse } from "./constants";

const baseUrl =
  process.env.NODE_ENV === "production"
    ? "https://api.wtwrallie.crabdance.com"
    : "http://localhost:3001";

const getItem = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item;
  } catch (error) {
    console.error("Error retrieving item from local storage:", error);
    return null;
  }
};

const itemsApi = {
  get: () => {
    return fetch(`${baseUrl}/items`).then(checkResponse);
  },
  add: ({ name, imageUrl, weather }) => {
    return fetch(`${baseUrl}/items`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getItem("jwt")}`,
      },
      body: JSON.stringify({
        name,
        imageUrl,
        weather,
      }),
    }).then(checkResponse);
  },
  remove: (id) => {
    return fetch(`${baseUrl}/items/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getItem("jwt")}`,
      },
    }).then(checkResponse);
  },
  like: (id) => {
    console.log(id);
    return fetch(`${baseUrl}/items/${id}/likes`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getItem("jwt")}`,
      },
    }).then(checkResponse);
  },

  unlike: (id) => {
    return fetch(`${baseUrl}/items/${id}/likes`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getItem("jwt")}`,
      },
    })
      .then(checkResponse)
      .catch((error) => {
        console.log("Error unliking item:", error);
        throw error;
      });
  },
};

export default itemsApi;

const userApi = {
  signup: (avatar, name, email, password) => {
    return fetch(`${baseUrl}/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getItem("jwt")}`,
      },
      body: JSON.stringify({
        avatar,
        name,
        email,
        password,
      }),
    }).then(checkResponse);
  },
  signin: (email, password) => {
    return fetch(`${baseUrl}/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getItem("jwt")}`,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(checkResponse);
  },

  getCurrentUser: () => {
    return fetch(`${baseUrl}/users/me`, {
      headers: {
        Authorization: `Bearer ${getItem("jwt")}`,
      },
    }).then(checkResponse);
  },

  updateCurrentUser: (data) => {
    return fetch(`${baseUrl}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${getItem("jwt")}`,
      },
      body: JSON.stringify(data),
    }).then(checkResponse);
  },
};

export { itemsApi, userApi };
