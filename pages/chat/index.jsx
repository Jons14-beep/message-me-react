import React from "react";
import styled from "styled-components";
import Sidebar from "../../components/Sidebar";

const Chat = () => {
  return (
    <Container>
      <Sidebar className="chat-sidebar" />
      <div className="banner">
        <span>Select a chat</span>
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
`;

export default Chat;
