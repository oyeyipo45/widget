import {createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({children}) => {
    
    const [messages, setMessages] = useState([]);
    
    const sendMessage = (message) => {
        setMessages(messages.concat(message));
    }

    // const hide = () => {
    //    window.parent.postMessage("hide", "*");
    //   // const gg =  window.widget.style.display = "none";
    //  }

    const hide = () => {
  // Allow all origins to send messages to this window
  window.addEventListener('message', (event) => {
    if (event.data === "hide") {
      // Handle the "hide" message here (e.g., hide the widget)
        console.log('Received "hide" message'); 
        
        const widgetElement = document.querySelector('.damilola'); 
        const appear = document.querySelector('.appear'); 
        widgetElement.style.display = 'none';
         appear.style.display = 'block';

      //window.widget.style.display = "none";
    }
  });
        

  // Send the "hide" message to the parent window
  window.parent.postMessage("hide", "*"); 
    };



    const appear = () => {
  // Allow all origins to send messages to this window
  window.addEventListener('message', (event) => {
    if (event.data === "appear") {
      // Handle the "hide" message here (e.g., hide the widget)
        console.log('Received "hide" message'); 
        
        const widgetElement = document.querySelector('.damilola'); 
        const appear = document.querySelector('.appear'); 
        widgetElement.style.display = 'block';
         appear.style.display = 'none';

      //window.widget.style.display = "none";
    }
  });
        

  // Send the "hide" message to the parent window
  window.parent.postMessage("appear", "*"); 
    };
    

    
    return <ChatContext.Provider value={{
        messages,
        sendMessage,
        hide,
        appear
    }}>{children}</ChatContext.Provider>
    
}

export const useChat = () => {
    const context = useContext(ChatContext);

    if (!context) {
        throw new Error("useChatContext must be within ChatProvider");
    }

    return context;

}