import { getInfoUsers, getUsers } from "../api/globalAPI";

export const getUsersScript = (token, groupId, setUsers, errorFun, setLoad) => {
  getUsers(token, groupId, 0).then((res) => {
    try {
      if (res.error) {
        errorFun((prev) => {
          return [...prev, res.error.error_msg];
        });
        return;
      } else {
        let count = res.response.count;
        let num_users = 1000;
        let users = [];
        let users_id = "";

        const getNewUsers = () => {
          if (num_users < count) {
            getUsers(token, groupId, num_users).then((res) => {
              try {
                if (res.error) {
                  errorFun((prev) => {
                    return [...prev, res.error.error_msg];
                  });
                  return;
                }
                num_users = num_users + 1000;
                setDeactivatedUsers(res.response.items);
              } catch (e) {
                setLoad(false);
                errorFun((prev) => [
                  ...prev,
                  "Ошибка сервера, повторите попытку",
                ]);
              }
            });
            return;
          }
          setUsers(JSON.stringify(users, null, 4));
          setLoad(false);
          return;
        };

        const setDeactivatedUsers = (usersId) => {
          usersId.forEach((i) => {
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
              users = [...users, ...res.response];
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

        setDeactivatedUsers(res.response.items);
      }
    } catch (e) {
      setLoad(false);
      errorFun((prev) => [...prev, "Ошибка сервера, повторите попытку"]);
    }
  });
};

export const downloadFile = (textFile, setError) => {
  function download(filename, text) {
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const filename = "users.txt";
  if (!!textFile) {
    download(filename, JSON.parse(textFile));
    return;
  }
  setError((prev) => {
    return [...prev, "Нет пользователей!"];
  });
};
