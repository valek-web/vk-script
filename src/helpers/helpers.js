export const extractToken = (input) => {
  let match = input.match(/access_token=([^&]*)/);
  if (match) {
    return match[1];
  }
  return input;
};

export const localStorageDeleteUsers = (token, group_id) => {
  localStorage.setItem("token", token);
  localStorage.setItem("groupId", group_id);
};
