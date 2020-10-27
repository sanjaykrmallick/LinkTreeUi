import config from "../config.js";
import {
  makePostRequest,
  makeGetRequest,
  makePutRequest,
  uploadFileMultiPart,
} from "./http-service";

const BASE_URL = config.BASE_URL; // create a config.js to maintain the BASE_URL

export const signUp = (signupData) => {
  // console.log("BASE_URL :", BASE_URL);
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/signup", false, signupData)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        // Add Toastify
        // E11000 duplicate key error collection: link_tree.users index: email_1 dup key: { : "sanjay90319031@gmail.com" }
        reject(e);
      });
  });
};

export const checkUsername = userName => {
  console.log('BASE_URL :', BASE_URL);
  return new Promise((resolve, reject) => {
    makePostRequest(
      BASE_URL + "/check-userName",
      false,
      userName
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const forgot_pass = (forgot_passData) => {
  // console.log("BASE_URL :", BASE_URL);
  return new Promise((resolve, reject) => {
    makePostRequest(BASE_URL + "/forgotPassword", false, forgot_passData)
      .then((res) => {
        resolve(res);
      })
      .catch((e) => {
        console.log("API call error: ", e);
        // Add Toastify
        // E11000 duplicate key error collection: link_tree.users index: email_1 dup key: { : "sanjay90319031@gmail.com" }
        reject(e);
      });
  });
};


export const login = loginData => {
  return new Promise((resolve, reject) => {
    makePostRequest(
      BASE_URL + "/login",
      false,
      loginData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};


export const findPage = () => {
  return new Promise((resolve, reject) => {
    makeGetRequest(
      BASE_URL + "/pages",
      true
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const createContent = (contentData, id) => {
  return new Promise((resolve, reject) => {
    makePutRequest(
      BASE_URL + `/page/${id}`,
      true,
      contentData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};

export const createPage = (contentData) => { // pagecreate
  return new Promise((resolve, reject) => {
    makePostRequest(
      BASE_URL + "/page",
      true,
      contentData
    )
      .then(res => {
        resolve(res);
      })
      .catch(e => {
        console.log("API call error: ", e);
        reject(e);
      });
  });
};