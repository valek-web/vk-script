import React, { useEffect, useState } from "react";
import "./DeleteUser.css";

import Stack from "@mui/material/Stack";
import { Popup } from "../../components/Popup/Popup";
import { MyButton } from "../../components/MyButton/MyButton";
import { Input } from "../../components/Input/Input";
import { getGroups, getInfoGroup } from "../../api/globalAPI";
import { processGroupMembers } from "../../scripts/deleteUser";
import { Error } from "../../components/Error/Error";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { CustomSelect } from "../../components/Select/CustomSelect";
import {
  InfoWorkScr,
  InfoWorkScrItem,
} from "../../components/InfoWorkScr/InfoWorkScr";
import { extractToken, localStorageDeleteUsers } from "../../helpers/helpers";
import { Box } from "@mui/material";
import { Preloader } from "../../components/Preloader/Preloader";

import logo from "../../img/vk-panel-logo.svg";

export const DeleteUser = (props) => {
  const [token, setToken] = useState("");
  const [tokenValidate, setTokenValidate] = useState(false);

  const [groupID, setgroupID] = useState("");
  const [groupIdValidate, setGroupIdValidate] = useState(false);

  const [groups, setGroups] = useState([]);
  const [selectGroup, setSelectGroup] = useState("");

  const [err, setError] = useState([]);
  const [idRemoveUser, setIdRemoveUser] = useState([]);
  const [countUsersRemove, setCountUsersRemove] = useState(0);
  const [boolRemove, setBoolRemove] = useState(false);

  useEffect(() => {
    setToken(localStorage.getItem("token") || "");
    setgroupID(localStorage.getItem("groupId") || "");
  }, []);

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

  const removeUserGroup = () => {
    if (!!token) {
      let myToken = extractToken(token);
      if (groupID.startsWith("https://") || groupID.startsWith("http://")) {
        localStorageDeleteUsers(token, groupID);
        let groupName = groupID.split("/").pop();
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
            setBoolRemove(true);
            processGroupMembers(
              myToken,
              idGroup,
              setError,
              setIdRemoveUser,
              props.setLoad,
              setCountUsersRemove
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
        processGroupMembers(
          token,
          selectGroup,
          setError,
          setIdRemoveUser,
          props.setLoad,
          setCountUsersRemove
        );

        return;
      }
      setError((prev) => {
        return [...prev, "Выберите группу или вставьте ссылку!"];
      });
    }
  };

  const listGroup = () =>
    groups.map((i) => {
      return (
        <MenuItem key={i.id} value={i.id}>
          {i.name}
        </MenuItem>
      );
    });

  let messageLoad = () => {
    return boolRemove
      ? !countUsersRemove
        ? "Удаление пользователей это может занять некоторое время!"
        : `Осталось: ${countUsersRemove} пользователей...`
      : "";
  };
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
            <MyButton onClick={() => removeUserGroup()}>
              Удалить "собак"
            </MyButton>
          </div>
        </div>
        {!!idRemoveUser.length ? (
          <InfoWorkScr title={"Участники группы:"}>
            {idRemoveUser.map((i, key) => {
              return <InfoWorkScrItem info={i} key={key} />;
            })}
          </InfoWorkScr>
        ) : (
          ""
        )}
        <Stack sx={{ width: "100%" }} spacing={2}>
          {!err.length
            ? ""
            : err.map((i, key) => {
                return <Error info={i} key={key} />;
              })}
        </Stack>
        <br />
        Этот скрипт поможет вам удалить деактивированных пользователей из вашей
        группы ВКонтакте. Для использования вам понадобится ваш токен и ID
        группы.
        {!props.load ? "" : <Preloader>{messageLoad()}</Preloader>}
      </Popup>
    </section>
  );
};
