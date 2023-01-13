import axios from "axios";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  
  const [selectedchat, setSelectedchat] = useState();
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState([]);
  const[render,setRender]=useState(false)

  
  

  return (
    <ChatContext.Provider
      value={{
        selectedchat,
        setSelectedchat,
        notification,
        setNotification,
        render,
        setRender
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;