import { getInfoUsers, getUsers, removeUser } from "../api/globalAPI";

export const processGroupMembers = (
  token,
  groupId,
  errorFun,
  userIdFun,
  setLoad,
  setCount
) => {
  return getUsers(token, groupId, 0).then((res) => {
    try {
      if (res.error) {
        errorFun((prev) => {
          return [...prev, res.error.error_msg];
        });
        return;
      } else {
        let count = res.response.count;
        let num_users = 1000;
        let users = res.response.items;
        let users_id = "";
        let usersIdDelete = [];

        const getNewUsers = () => {
          if (num_users < count) {
            try {
              getUsers(token, groupId, num_users).then((res) => {
                users = res.response.items;
                num_users = num_users + 1000;
                setDeactivatedUsers(users);
              });
            } catch (e) {
              setLoad(false);
              errorFun((prev) => [
                ...prev,
                "Ошибка сервера, повторите попытку",
              ]);
            }
          } else {
            window.deleteUser();
          }
        };

        const setDeactivatedUsers = (users) => {
          users.forEach((i) => {
            users_id = !users_id ? `${users_id}${i}` : `${users_id},${i}`;
          });
          getInfoUsers(token, users_id).then((res) => {
            try {
              if (res.error) {
                errorFun((prev) => {
                  return [...prev, res.error.error_msg];
                });
                return;
              }
              res.response.forEach((i) => {
                if (!!i.deactivated) {
                  usersIdDelete = [...usersIdDelete, i.id];
                }
              });
              users_id = "";
              getNewUsers();
            } catch (e) {
              setLoad(false);
              errorFun((prev) => [
                ...prev,
                "Ошибка сервера, повторите попытку",
              ]);
            }
          });
        };

        setDeactivatedUsers(users);

        window.deleteUser = () => {
          if (usersIdDelete.length <= 0) {
            errorFun((prev) => {
              let newError = [
                ...prev,
                "Все деактивированные пользователи удалены!",
              ];
              return newError;
            });
            setLoad(false);
            return;
          }
          let user = usersIdDelete.shift();
          setCount(usersIdDelete.length);
          userIdFun((prev) => {
            let newUsers = [...prev, user];
            return newUsers;
          });
          removeUser(token, groupId, user).then((res) => {
            try {
              if (res.error) {
                errorFun((prev) => {
                  let newError = [...prev, res.error.error_msg];
                  return newError;
                });
                userIdFun((prev) => {
                  let newUsers = prev;
                  newUsers.pop();
                  return newUsers;
                });
                setLoad(false);
                if (
                  res.error.error_msg ===
                  "Access denied: no access to this group"
                ) {
                  return;
                }
              }

              window.deleteUser();

              return res.response;
            } catch (e) {
              setLoad(false);
              errorFun((prev) => [
                ...prev,
                "Ошибка сервера, повторите попытку",
              ]);
            }
          });
        };
      }
    } catch (e) {
      setLoad(false);
      errorFun((prev) => [...prev, "Ошибка сервера, повторите попытку"]);
    }
  });
};
