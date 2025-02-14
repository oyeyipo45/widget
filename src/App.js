import "./App.css";
import { WidgetContainer } from "./WidgetContainer";
import { useState, useEffect } from "react";
import { useChat } from "./ChatProvider.jsx";
import { nanoid } from "nanoid";

function App() {
  const [license, setLicense] = useState("");

  const { sendMessage } = useChat();

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString); // doesn't work in IE, but who cares ;)
    const license = urlParams.get("license");
    setLicense(license);
  }, []);

  useEffect(() => {
    const handleMessage = (evt) => {
      console.log(evt, "evt");

      if ("sendMessage" in evt.data) {
        sendMessage({
          _id: nanoid(),
          message: evt.data.sendMessage,
          sender: "remote",
          direction: "outgoing",
        });
      }
    };

    window.addEventListener("message", handleMessage);

    return () => window.removeEventListener("message", handleMessage);
  }, [sendMessage]);

  const greeting = "hello damilola";

  return (
    <div className="App">
      <WidgetContainer license={license} greeting={greeting} />
    </div>
  );
}

export default App;
