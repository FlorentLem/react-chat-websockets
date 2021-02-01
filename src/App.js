import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

function App() {
  const [messageList, setMessageList] = useState([]);
  const [nickName, setNickName] = useState("");
  const [newMessageText, setNewMessageText] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = socketIOClient("http://localhost:8000");
    setSocket(socket);

    socket.on("initialMessageList", (messages) => {
      setMessageList(messages);
    });
    socket.on("messageFromServer", (messages) => {
      setMessageList(messages);
    });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nickName && newMessageText) {
      socket.emit("messageFromClient", {
        text: newMessageText,
        author: nickName,
      });
    }
  };

  return (
    <div className="App">
      <h2>Messages</h2>
      {messageList.map((message) => {
        return (
          <div key={message.id}>
            {message.author} : {message.text}
          </div>
        );
      })}

      <form onSubmit={handleSubmit}>
        <h2>New Message</h2>
        <input
          type="text"
          name="author"
          placeholder="nickname"
          value={nickName}
          required
          onChange={(e) => setNickName(e.target.value)}
        />
        <input
          type="text"
          name="messageContent"
          placeholder="message"
          value={newMessageText}
          required
          onChange={(e) => setNewMessageText(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
}

export default App;
