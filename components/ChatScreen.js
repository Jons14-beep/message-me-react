import React, { useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import styled from "styled-components";
import {
  auth,
  db,
  collection,
  query,
  orderBy,
  setDoc,
  serverTimestamp,
  addDoc,
  doc,
  where,
} from "../firebase";
import { Avatar, IconButton, Menu, MenuItem } from "@material-ui/core";
import {
  ArrowBack,
  AttachFile,
  InsertEmoticon,
  MoreVert,
  Send,
} from "@material-ui/icons";
import { useCollection } from "react-firebase-hooks/firestore";
import Message from "./Message";
import TimeAgo from "timeago-react";
import Link from "next/link";
import useViewportHeight from "../hooks/useViewportHeight";

const ChatScreen = ({ chat, messages }) => {
  useViewportHeight(); 
  const [user] = useAuthState(auth);
  const EndofMessagesRef = useRef(null);
  const router = useRouter();
  const [input, setInput] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const [messagesSnapshot] = useCollection(
    query(
      collection(db, "chats", router.query.id, "messages"),
      orderBy("timestamp", "asc")
    )
  );

  const otherGuy = chat.users.find((email) => email !== user.email);

  const [snapshot, loading] = useCollection(
    query(collection(db, "users"), where("email", "==", otherGuy))
  );

  // Early return if loading or snapshot is empty
  if (loading) {
    return <div>Loading...</div>;
  }

  const recipient = snapshot?.docs[0]?.data();

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((msg) => (
        <Message
          key={msg.id}
          id={msg.id}
          user={msg.data().user}
          message={{
            ...msg.data(),
            timestamp: msg.data().timestamp?.toDate().getTime(),
          }}
        />
      ));
    } else {
      return messages.map((msg) => (
        <Message key={msg.id} id={msg.id} user={msg.user} message={msg} />
      ));
    }
  };

  const ScrollToBottom = () => {
    EndofMessagesRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    setDoc(
      doc(db, "users", user.uid),
      {
        lastSeen: serverTimestamp(),
      },
      { merge: true }
    );

    addDoc(collection(db, "chats", router.query.id, "messages"), {
      timestamp: serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    ScrollToBottom();
  };

  const open3Dot = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const close3Dot = () => {
    setAnchorEl(null);
  };
  return (
    <Container>
      <Header>
        <Link href="/chat">
          <a className="back-btn">
            <ArrowBack />
          </a>
        </Link>
        {recipient && recipient.photoURL ? (
          <Avatar src={recipient.photoURL} />
        ) : (
          <Avatar>{recipient.name}</Avatar>
        )}
        <HeaserInformation>
          <h3>{recipient.name}</h3>
          {recipient ? (
            <p>
              Last Active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p>Loading...</p>
          )}
        </HeaserInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert onClick={open3Dot} />
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={close3Dot}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
            >
              <MenuItem onClick={close3Dot}>View Profile</MenuItem>
              <MenuItem onClick={close3Dot}>Delete Chat</MenuItem>
            </Menu>
          </IconButton>
        </HeaderIcons>
      </Header>

      <MessageContainer>
        {showMessages()}
        <EndofMessage ref={EndofMessagesRef} />
      </MessageContainer>

      <InputContainer>
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <Input
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
        />

        <div onClick={sendMessage}>
          <IconButton disabled={!input} type="submit">
            <Send />
          </IconButton>
        </div>
      </InputContainer>
    </Container>
  );
};

export default ChatScreen;

const Container = styled.div`
  flex: 1;
  border-right: 1px solid whitesmoke;
  min-width: 300px;
  overflow-y: scroll;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
  height: calc(var(--vh, 1vh) * 100);
`;
const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
`;
const HeaserInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 3px;
  }

  > p {
    font-size: 14px;
    color: grey;
  }
`;
const HeaderIcons = styled.div``;
const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  height: 100%;
`;
const EndofMessage = styled.div`
  margin-bottom: 50px;
`;
const InputContainer = styled.form`
  display: flex;
  align-items: center;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  outline: 0;
  border: none;
  flex: 1;
  align-items: center;
  border-radius: 10px;
  margin-left: 15px;
  margin-right: 15px;
  padding: 10px;
  position: sticky;
  bottom: 0;
  background-color: whitesmoke;
  z-index: 100;
`;
