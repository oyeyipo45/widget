import { useEffect, useMemo, useState } from "react";
import { Widget } from "./Widget";
import { nanoid } from "nanoid";
import { useChat } from "./ChatProvider";

export const TOKEN = process.env["REACT_APP_BEARER_TOKEN"];
export const BASE_URL = process.env["REACT_APP_BASE_URL"];


export const WidgetContainer = ({license = "", greeting = ""}) => {

    const { messages, sendMessage } = useChat();

    console.log(messages, "messages");
    
    const [currentMessages, setcurrentMessages] = useState([{_id: nanoid(),
        message: "Hello! How can I help you today?",
        sender: "bot",
        direction: "incoming",}])
    
    useEffect( () => {
        if (messages.length === 0 ) {
           sendMessage({
        _id: nanoid(),
        message: "Hello! How can I help you today?",
        sender: "bot",
        direction: "incoming",
    });
        }
    },[messages, sendMessage]);

    const remoteName = useMemo( () => {
    if ( license === "123" ) {
        return "Chatscope";
    } else if (license === "456" ) {
        return "ChatKitty";
    } else if (license === "789" ) {
        return "EvilNull";
    }
    }, [license]);
    
      const sendMessageToAPI = async (message) => {
        try {
          const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${TOKEN}`
            },
            body: JSON.stringify({
                query: message,
                session_id : "a72a538d-ef96-4b4c-82a3-ad072ad7e65c"
            })
          });
    
          if (!response.ok) {
            throw new Error('API request failed');
          }
    
            const data = await response.json();
            console.log(data, "data");
            
          return data; // Adjust based on your API response structure
        } catch (error) {
          console.error('Error sending message:', error);
          return 'Sorry, there was an error processing your request.';
        }
      };
    
    
    const handleSend = async (message) => {
   

    // Add user message
    const userMessage = {
      _id: nanoid(),
      message: message,
      sender: "me",
      direction: "outgoing",
    };

        // send use message
    setcurrentMessages(prev => [...prev, userMessage]);

    try {
      // Get bot response from API
      const botResponse = await sendMessageToAPI(message);

       console.log(botResponse, "botResponse");
        
      const botMessage = {
        _id: nanoid(),
        message: botResponse?.data?.content,
        sender: "remote",
        direction: "imcoming",
      };
      setcurrentMessages(prev => [...prev, botMessage]);
    } catch (error) {
      // Add error message
      const errorMessage = {
        _id: nanoid(),
        message: "Sorry, there was an error sending your message.",
        sender: "remote",
        direction: "imcoming",
      };
      sendMessage(prev => [...prev, errorMessage]);
    } finally {
      sendMessage(false);
    }
    };
    
    // const handleSend1 = (message) => {
    //     const newMessages = [
    //         {
    //             _id: nanoid(),
    //             message,
    //             sender: "me",
    //             direction: "outgoing",
    //         },
    //         {
    //             _id: nanoid(),
    //             message: `ECHO: ${message}`,
    //             sender: "remote",
    //             direction: "incoming",
    //         }
    //     ];
    //     sendMessage(newMessages);
    // };

    return <Widget remoteName={remoteName}  messages={currentMessages} onSend={handleSend} />

};



// export const WidgetContainer = ({license = "", greeting = ""}) => {

//     const {messages, sendMessage} = useChat();

//     useEffect( () => {
//         if ( greeting && messages.length === 0 ) {
//            sendMessage({
//         _id: nanoid(),
//         message: greeting,
//         sender: "remote",
//         direction: "incoming",
//     });
//         }
//     },[greeting, messages, sendMessage]);

//     const remoteName = useMemo( () => {
//     if ( license === "123" ) {
//         return "Chatscope";
//     } else if (license === "456" ) {
//         return "ChatKitty";
//     } else if (license === "789" ) {
//         return "EvilNull";
//     }
//     }, [license]);

//     const handleSend = (message) => {
//         const newMessages = [
//             {
//                 _id: nanoid(),
//                 message,
//                 sender: "me",
//                 direction: "outgoing",
//             },
//             {
//                 _id: nanoid(),
//                 message: `ECHO: ${message}`,
//                 sender: "remote",
//                 direction: "incoming",
//             }
//         ];
//         sendMessage(newMessages);
//     };

//     return <Widget remoteName={remoteName}  messages={messages} onSend={handleSend} />

// };