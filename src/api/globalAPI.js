import fetchJsonp from "fetch-jsonp";

export const getGroups = (token) => {
  return fetchJsonp(
    `https://api.vk.com/method/groups.get?extended=1&v=5.131&access_token=${token}&callback=callbackFunction`
  )
    .then(function (response) {
      if (response.error) {
        return response.error;
      } else {
        return response.json();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  function callbackFunction(response) {
    return response;
  }
};

export const getInfoGroup = (token, groupName) => {
  return fetchJsonp(
    `https://api.vk.com/method/utils.resolveScreenName?screen_name=${groupName}&extended=1&v=5.131&access_token=${token}&callback=callbackFunction`
  )
    .then(function (response) {
      if (response.error) {
        return response.error;
      } else {
        return response.json();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  function callbackFunction(response) {
    return response;
  }
};

export const getUsers = (token, group_id, count) => {
  return fetchJsonp(
    `https://api.vk.com/method/groups.getMembers?group_id=${group_id}&offset=${count}&v=5.131&access_token=${token}&callback=callbackFunction`
  )
    .then(function (response) {
      if (response.error) {
        return response.error;
      } else {
        return response.json();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  function callbackFunction(response) {
    return response;
  }
};

export const removeUser = (token, group_id, user_id) => {
  const apiUrl = "https://api.vk.com/method/execute";
  const access_token = token;
  const groupId = group_id;
  const userId = user_id;

  const executeCode = `return API.groups.removeUser({
    "group_id": ${groupId},
    "user_id": ${userId},
    "access_token": "${access_token}",
    "v": "5.131"
});`;

  return fetchJsonp(
    `${apiUrl}?code=${executeCode}&access_token=${access_token}&v=5.131`
  )
    .then((response) => {
      if (response.error) {
        return response.error;
      }
      return response.json();
    })
    .catch((error) => {
      console.error(error);
    });
  function callbackFunction(response) {
    return response;
  }
};

export const getInfoUsers = (token, user_id) => {
  return fetchJsonp(
    `https://api.vk.com/method/users.get?user_ids=${user_id}&fields=photo_200&access_token=${token}&v=5.131`
  )
    .then(function (response) {
      if (response.error) {
        return response.error;
      } else {
        return response.json();
      }
    })
    .catch(function (error) {
      console.log(error);
    });
  function callbackFunction(response) {
    return response;
  }
};
