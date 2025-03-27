import { Avatar } from "@material-ui/core";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { auth, collection, db, query, where } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";

const Chat = ({ chat }) => {
  const [user] = useAuthState(auth);

  const otherGuy = chat.users.find((email) => email !== user.email);

  const [snapshot, loading] = useCollection(
    query(collection(db, "users"), where("email", "==", otherGuy))
  );

  // Early return if loading or snapshot is empty
  if (loading) {
    return <div>Loading...</div>;
  }

  const recipient = snapshot?.docs[0]?.data();

  return (
    <Link href={"/chat/" + chat.id}>
      <a style={{ textDecoration: "none", color: "black" }}>
        <Container>
          {recipient ? (
            <UserAvatar src={recipient?.photoURL} />
          ) : (
            <UserAvatar>{recipient?.name?.charAt(0)}</UserAvatar> // Show first letter if no photo
          )}
          <p>{recipient?.name || "Unknown User"}</p> {/* Default name */}
        </Container>
      </a>
    </Link>
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
