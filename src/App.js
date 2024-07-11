import React, { useEffect, useRef, useState } from "react";
import { BsSendFill } from "react-icons/bs";

import Footer from "./components/IMG/Footer";
// Import the functions you need from the SDKs you need
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";
import "firebase/analytics";
import userlogo from "./components/IMG/userlogo.png";
import "../src/App.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
firebase.initializeApp({
  apiKey: "AIzaSyBSyc6UwHpcEBa_yveLmF_2lakFSYYLwIM",
  authDomain: "chatapp-35724.firebaseapp.com",
  projectId: "chatapp-35724",
  storageBucket: "chatapp-35724.appspot.com",
  messagingSenderId: "427226829554",
  appId: "1:427226829554:web:55a8feb901cc77df75366b",
  measurementId: "G-ELDS1DHTMM",
});

// Initialize Firebase

const auth = firebase.auth();
const firestore = firebase.firestore();
const App = () => {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <div className="container">
        <section>{user ? <ChatRoom /> : <SignIn auth={auth} />}</section>
      </div>
      <Footer />
    </div>
  );
};

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    console.log(provider);
  };

  return (
    <div className="signindiv">
      <h4> Well Come 🤍 ! SignIn to Go !</h4>
      <button className="sign-in" onClick={signInWithGoogle}>
        SignIn with Google
      </button>
    </div>
  );
}

function SignOut() {
  return (
    auth.currentUser && (
      <button className="sign-out" onClick={() => auth.signOut()}>
        Sign Out
      </button>
    )
  );
}

function ChatRoom() {
  const dummy = useRef();
  // if (!user) {
  //   return <div>You must be signed in to view the chat room.</div>;
  // }
  const messagref = firestore.collection("messages");
  console.log(messagref);
  const query = messagref.orderBy("createdAt").limit(30);
  console.log(query);
  const [messages, isLoading, error] = useCollectionData(query, {
    idField: "id",
  });

  const [formValue, setFormValue] = useState("");

  useEffect(() => {
    if (dummy.current) {
      dummy.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const sendMessage = async (e) => {
    if (!auth.currentUser) {
      console.error("User is not signed in.");
      return;
    }
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagref.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL,
    });

    setFormValue("");
    dummy.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <main className="main">
        <h4> Share With 💜 </h4>
        {messages &&
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

        <span ref={dummy}></span>
      </main>

      <form onSubmit={sendMessage}>
        <div className="signoutdiv">
          <SignOut />

          <div className="inputs">
            <input
              value={formValue}
              onChange={(e) => setFormValue(e.target.value)}
              placeholder="say something nice"
            />

            <button type="submit" disabled={!formValue}>
              <BsSendFill className="icon" />
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? "sent" : "received";
  return (
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoURL ? photoURL : userlogo} />
        <p>{text}</p>
      </div>
    </>
  );
}

export default App;
