import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useRouter } from "next/router";
import {
  doc,
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../firebase"; // ✅ Ensure correct Firestore import
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";

const Chat = () => {
  const router = useRouter();
  const { id } = router.query;

  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!id) return;

    console.log(`📥 Subscribing to chat ID: ${id}`);

    // ✅ Fetch chat details
    const chatRef = doc(db, "chats", id);
    const unsubscribeChat = onSnapshot(chatRef, (docSnap) => {
      if (docSnap.exists()) {
        setChat({ id: docSnap.id, ...docSnap.data() });
      } else {
        setChat(null);
      }
    });

    // ✅ Fetch messages in real-time
    const messagesRef = collection(db, "chats", id, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc"));
    const unsubscribeMessages = onSnapshot(messagesQuery, (snapshot) => {
      setMessages(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    // 🛑 Cleanup subscription on unmount
    return () => {
      unsubscribeChat();
      unsubscribeMessages();
    };
  }, [id]);

  if (!id) {
    return (
      <Container>
        <Sidebar className="chat-sidebar" />
        <span className="banner">Select a chat</span>
      </Container>
    );
  }

  return (
    <Container>
      <Sidebar className="chat-sidebar-id" />
      <ChatContainer>
        {chat ? (
          <ChatScreen chat={chat} messages={messages} />
        ) : (
          <div>Loading chat...</div>
        )}
      </ChatContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default Chat;
