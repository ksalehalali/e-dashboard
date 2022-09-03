import { useState, useEffect, useCallback } from "react";
// modules
import { useCookies } from "react-cookie";
import { notification } from "antd";
import useSound from "use-sound";
// import sound from "assets/pristine-609.mp3";
import * as signalR from "@microsoft/signalr";

function RealTime({ cookies }) {
  const [connection, setConnection] = useState(null);
  const [connectionId, setConnectionId] = useState("");
  const [play] = useSound("/sounds/pristine-609.mp3", { volume: 0.25 });
  const audio = new Audio("/sounds/pristine-609.mp3");
  //   const [cookies, setCookies, clearCookies] = useCookies(["user"]);

  const openNotification = useCallback((message) => {
    audio?.play();
    notification.open({
      message: "Notification Title",
      description: message,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  }, []);
  useEffect(() => {
    if (cookies) {
      const protocol = new signalR.JsonHubProtocol();
      const transport = signalR.HttpTransportType.WebSockets;

      const options = {
        transport,
        logMessageContent: true,
        logger: signalR.LogLevel.Trace,
        accessTokenFactory: () => cookies?.token,
      };

      const newConnection = new signalR.HubConnectionBuilder()
        .withUrl(
          process.env.NEXT_PUBLIC_HOST_API + "chathub",
          options /*{ jwtBearer: token }*/
        )
        .withHubProtocol(protocol)
        .build();
      setConnection(newConnection);
    }
    // 7ef0bcd3-90a4-404a-828b-2d22eb015b8a
    return () => {};
  }, []);

  useEffect(() => {
    // window.addEventListener("click", overlayClick);
    if (connection) {
      if (!connection.connectionStarted) {
        connection
          .start()
          .then((result) => {
            connection.on("RecieveConnectionId", (id) => {
              setConnectionId(id);
            });

            connection.on("DeleteNotification", (string) => {
              console.log("string");
              console.log(string);
              openNotification(string?.message);
            });
            connection.on("EditNotification", (string) => {
              console.log("string");
              console.log(string);
              openNotification(string?.orderStatus);
            });
            connection.on("AddNotification", (string) => {
              console.log("string");
              console.log(string);
              openNotification(string?.orderStatus);
            });
          })
          .catch((err) => alert("Failed To Connect"));
      }
    }
    // else {
    //   console.log("remove event listener");
    //   window.removeEventListener("click", overlayClick);
    // }
  }, [connection]);

  return <></>;
}

export default RealTime;
