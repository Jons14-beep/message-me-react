import { Avatar } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { auth, collection, db, query, where } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const Chat = ({ chat }) => {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const otherGuy = chat.users.find(email => email !== user.email)

  const [recipientSnapshot] = useCollection(
    query(
      collection(db, "users"),
      where("email", "==", otherGuy)
    )
  );
  const recipient = recipientSnapshot.docs[0].data()

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  return (
    <Container onClick={enterChat}>
      {recipient ? (
        <UserAvatar src={recipient?.photoURL} />
      ) : (
        <UserAvatar>{recipient.name}</UserAvatar>
      )}
      <p>{recipient.name}</p>
    </Container>
  );
};

export default Chat;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  word-break: break-word;
  cursor: pointer;

  :hover {
    background-color: #e9eaeb;
  }
`;
const UserAvatar = styled(Avatar)`
  margin: 5px;
  margin-right: 15px;
`;
