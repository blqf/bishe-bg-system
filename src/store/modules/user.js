import { login, whoami } from "@/api/admin";
import { getToken, removeToken } from "@/utils/auth";

const getDefaultState = () => {
  return {
    token: getToken(),
    name: "Admin",
    avatar: "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif",
    user: null,
  };
};

const state = getDefaultState();

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState());
  },
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar;
  },
  SET_USER(state, payload) {
    state.user = payload;
  },
};

const actions = {
  login({ commit }, userInfo) {
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password })
        .then((res) => {
          if (typeof res.data !== "string") {
            commit("SET_USER", res.data);
            commit("SET_AVATAR", res.data.avatar);
            commit("SET_NAME", res.data.username);
            resolve(res.data);
          } else {
            reject(res.data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // get user info
  whoami({ commit, state }) {
    return new Promise((resolve, reject) => {
      whoami(state.token)
        .then((response) => {
          const data = response.data;
          if (typeof data === "string") {
            resolve(data);
          } else {
            commit("SET_AVATAR", data.avatar);
            commit("SET_NAME", data.username);
            commit("SET_USER", data);
            resolve(data);
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken(); // must remove  token  first
      commit("RESET_STATE");
      resolve();
    });
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
