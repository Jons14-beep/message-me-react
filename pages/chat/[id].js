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
import { limit } from "firebase/firestore"; // ✅ Ensure limit is imported from firestore

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
          <div>No chat available</div>
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
    console.log("🟢 Running getServerSideProps...");
    const { id } = context.query;
    
    if (!id) {
      console.log("⚠️ No chat ID found.");
      return { props: { chat: null, messages: [] } };
    }

    console.log(`📥 Fetching messages for chat ID: ${id}`);
    const ref = collection(db, "chats", id, "messages");
    
    // 🔹 Fetch only the latest 20 messages to improve performance
    const messagesRef = await getDocs(
      query(ref, orderBy("timestamp", "asc"), limit(20))
    );

    console.log(`✅ Fetched ${messagesRef.docs.length} messages.`);
    const messages = messagesRef.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate() || null,
    }));

    console.log("📥 Fetching chat details...");
    const chatRes = await getDoc(doc(db, "chats", id));
    
    if (!chatRes.exists()) {
      console.log("❌ Chat not found.");
      return { props: { chat: null, messages: [] } };
    }

    const chat = { id: chatRes.id, ...chatRes.data() };

    console.log("✅ Returning data...");
    return {
      props: { messages: JSON.stringify(messages), chat },
    };
  } catch (error) {
    console.error("❌ Error in getServerSideProps:", error);
    return { props: { chat: null, messages: [] } };
  }
}
