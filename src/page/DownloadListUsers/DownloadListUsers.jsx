import React, { useState, useEffect } from "react";

import Stack from "@mui/material/Stack";
import { Popup } from "../../components/Popup/Popup";
import { MyButton } from "../../components/MyButton/MyButton";
import { Input } from "../../components/Input/Input";
import { Error } from "../../components/Error/Error";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { CustomSelect } from "../../components/Select/CustomSelect";
import { extractToken, localStorageDeleteUsers } from "../../helpers/helpers";
import { Box, TextField } from "@mui/material";
import { Preloader } from "../../components/Preloader/Preloader";

import logo from "../../img/vk-panel-logo.svg";
import { getGroups, getInfoGroup } from "../../api/globalAPI";
import { downloadFile, getUsersScript } from "../../scripts/downloadUsers";

export const DownloadListUsers = (props) => {
  const [token, setToken] = useState("");
  const [tokenValidate, setTokenValidate] = useState(false);

  const [groupID, setgroupID] = useState("");
  const [groupIdValidate, setGroupIdValidate] = useState(false);

  const [groups, setGroups] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");

  const [err, setError] = useState([]);
  const [valueFile, setValueFile] = useState("");
  const [indices, setIndices] = useState([]);
  const [page, setPage] = useState(100);

  let getEndValue = () => {
    return indices[page] ? indices[page] + 1 : indices[indices.length - 1];
  };

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setgroupID(localStorage.getItem("groupId") || "");
  }, []);

  const getValue = () => {
    let indicesVar = [];
    if (indices.length === 0) {
      let idx = valueFile.indexOf("}");
      while (idx !== -1) {
        indicesVar.push(idx);
        idx = valueFile.indexOf("}", idx + 1);
      }
      if (indicesVar.length < 100) {
        setPage(indicesVar.length);
      }
      setIndices([...indicesVar]);
    }

    if (indices.length === page) {
      return valueFile;
    }

    return valueFile.slice(0, getEndValue());
  };

  const getGroupsUser = () => {
    if (!!token) {
      let myToken = extractToken(token);
      props.setLoad(true);
      getGroups(myToken).then((res) => {
        try {
          if (res.error) {
            setError((prev) => {
              return [...prev, res.error.error_msg];
            });
            return;
          }

          setGroups(res.response.items);
          props.setLoad(false);
          setSelectGroup(res.response.items[0].id + "");
        } catch (e) {
          props.setLoad(false);
          setError((prev) => [...prev, "Ошибка сервера, повторите попытку"]);
        }
      });
      return;
    }
    setTokenValidate(true);
  };

  const getUsersGroup = () => {
    if (!!token) {
      let myToken = extractToken(token);
      if (groupID.startsWith("https://") || groupID.startsWith("http://")) {
        localStorageDeleteUsers(token, groupID);
        let groupName = groupID.split("/").pop();
        setPage(100)
        setValueFile("")
        setIndices([])
        props.setLoad(true);
        getInfoGroup(myToken, groupName).then((res) => {
          try {
            if (res.error) {
              setError((prev) => {
                return [...prev, res.error.error_msg];
              });
              return;
            }
            let idGroup = res.response.object_id;
            setSelectGroup(idGroup);
            getUsersScript(
              myToken,
              idGroup,
              setValueFile,
              setError,
              props.setLoad
            );
          } catch (e) {
            props.setLoad(false);
            setError((prev) => [...prev, "Ошибка сервера, повторите попытку"]);
          }
        });
        return;
      }

      if (!!selectGroup) {
        props.setLoad(true);
        getUsersScript(
          myToken,
          selectGroup,
          setValueFile,
          setError,
          props.setLoad
        );
        return;
      }
      setError((prev) => {
        return [...prev, "Выберите группу или вставьте ссылку!"];
      });
    }
  };

  const hendlerValueFile = (e) => {
    if (e.nativeEvent.inputType === "insertText") {
      if (indices.length === page) {
        setValueFile((prev) => {
          return e.target.value;
        });
      } else {
        setValueFile((prev) => {
          return prev.replace(prev.slice(0, getEndValue()), e.target.value);
        });

        setIndices((prev) => {
          let newValue = prev;
          newValue[page] = newValue[page] + 1;
          return newValue;
        });
      }
    } else {
      if (indices.length === page) {
        setValueFile((prev) => {
          return e.target.value;
        });
      } else {
        setValueFile((prev) => {
          return prev.replace(prev.slice(0, getEndValue()), e.target.value);
        });
        setIndices((prev) => {
          let newValue = prev;
          newValue[page] = newValue[page] - 1;
          return newValue;
        });
      }
    }

    // setValueFile((prev) => {
    //   if (e.nativeEvent.inputType === "insertText") {
    //     if (indices.length === page) {
    //       return e.target.value;
    //     }

    //     setIndices((prev) => {
    //       let newValue = prev;
    //
    //       newValue[page] = newValue[page] + 1;
    //
    //       return newValue;
    //     });
    //
    //     return prev.replace(prev.slice(0, getEndValue()), e.target.value);
    //   } else {
    //     if (indices.length === page) {
    //       return e.target.value;
    //     }

    //     setIndices((prev) => {
    //       let newValue = prev;
    //
    //       newValue[page] = newValue[page] - 1;
    //       return newValue;
    //     });

    //     return prev.replace(prev.slice(0, getEndValue()), e.target.value);
    //   }
    // });
  };

  const listGroup = () =>
    groups.map((i) => {
      return (
        <MenuItem key={i.id} value={i.id}>
          {i.name}
        </MenuItem>
      );
    });

  return (
    <section className="delete-user">
      <img className="delete-user__logo" src={logo} alt="Logo" width="200px" />
      <Popup>
        <div className="delete-user__wrapper">
          <label htmlFor="tokenID" className="delete-user__label">
            Ваш токен:
          </label>
          <Input
            value={token}
            id={"tokenID"}
            placeholder="Вставьте сюда ссылку от VK или токен"
            inputtype={tokenValidate ? "outlined-error" : "outlined-basic"}
            onChange={(e) => {
              setToken(e.target.value);
              setTokenValidate(false);
            }}
          />
          <div className="delete-user__link">
            <a
              href="https://oauth.vk.com/authorize?client_id=6121396&scope=1073737727&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1"
              target="_blank"
              rel="noreferrer"
            >
              Получить токен
            </a>
          </div>

          <label htmlFor="groupID" className="delete-user__label">
            Группа:
          </label>
          <Input
            value={groupID}
            id={"groupID"}
            placeholder="Ссылка на группу или ID"
            inputtype={groupIdValidate ? "outlined-error" : "outlined-basic"}
            onChange={(e) => {
              setgroupID(e.target.value);
              setGroupIdValidate(false);
            }}
          />
          <div>
            <MyButton onClick={() => getGroupsUser()}>Получить группы</MyButton>
          </div>
          <div>
            <Box className="delete-user__dropdown">
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Список групп
                </InputLabel>
                <CustomSelect
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  disabled={!!groups.length ? false : true}
                  value={!!groups.length ? selectGroup : ""}
                  label="Список групп"
                  onChange={(e) => {
                    setSelectGroup(e.target.value);
                  }}
                >
                  {!!groups.length ? listGroup() : ""}
                </CustomSelect>
              </FormControl>
            </Box>
          </div>
          <div>
            <MyButton onClick={() => getUsersGroup()}>
              Получить пользователей
            </MyButton>
          </div>
        </div>
        <Box>
          <TextField
            placeholder="Содержимое файла"
            value={valueFile ? getValue() : ""}
            onChange={hendlerValueFile}
            disabled={!valueFile}
            multiline
            sx={{ width: "100%", margin: "30px 0" }}
            maxRows={30}
          />
        </Box>
        <div className="delete-user__wrapper">
          <Box>
            <MyButton
              onClick={() => {
                if (indices.length < page + 100) {
                  setPage(indices.length);
                } else {
                  setPage((prev) => prev + 100);
                }
              }}
              disabled={
                indices.length === page
                  ? true
                  : indices.length === 0
                  ? true
                  : false
              }
            >
              Показать еще
            </MyButton>
          </Box>
          <Box sx={{ margin: "20px 0" }}>
            {!!indices.length
              ? `Найдено: ${indices.length} / отображено: ${page}`
              : ""}
          </Box>
          <Box>
            <MyButton
              onClick={() => downloadFile(JSON.stringify(valueFile), setError)}
              disabled={indices.length === 0}
            >
              Скачать файл
            </MyButton>
          </Box>
        </div>
        <Stack sx={{ width: "100%" }} spacing={2}>
          {!err.length
            ? ""
            : err.map((i, key) => {
                return <Error info={i} key={key} />;
              })}
        </Stack>
        <br />
        Этот скрипт поможет вам скачать всех пользователей из вашей группы
        ВКонтакте в виде txt файла. Для использования вам понадобится ваш токен
        и ID группы.
        {!props.load ? "" : <Preloader />}
      </Popup>
    </section>
  );
};
