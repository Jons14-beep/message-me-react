import React from "react";
import styled from "styled-components";
import ChatScreen from "../../components/ChatScreen";
import Sidebar from "../../components/Sidebar";
import {
  doc,
  db,
  collection,
  query,
  getDocs,
  orderBy,
  getDoc,
} from "../../firebase";

const Chat = ({ chat, messages }) => {
  return (
    <Container>
      <div className="chat-sidebar-id">
        <Sidebar />
      </div>
      <ChatContainer className="chat-screen">
        {chat && messages ? (
          <ChatScreen chat={chat} messages={messages} />
        ) : (
          <div></div>
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
  height: 100vh;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

export default Chat;

export async function getServerSideProps(context) {
  try {
    const { id } = context.query;

    // If there's no `id` in the query, just return empty props and render only Sidebar
    if (!id) {
      return {
        props: {
          chat: null, // No chat data
          messages: [], // No messages
        },
      };
    }

    // Fetching chat and messages if `id` is available
    const ref = collection(db, "chats", id, "messages");
    const messagesRef = await getDocs(query(ref, orderBy("timestamp", "asc")));

    const messages = messagesRef.docs
      .map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .map((messages) => ({
        ...messages,
        timestamp: messages.timestamp.toDate(),
      }));

    const chatRes = await getDoc(doc(db, "chats", id));
    const chat = {
      id: chatRes.id,
      ...chatRes.data(),
    };

    return {
      props: {
        messages: JSON.stringify(messages),
        chat: chat,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        chat: null, // No chat data
        messages: [], // No messages
      },
    };
  }
}
