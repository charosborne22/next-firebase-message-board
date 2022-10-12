import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { AiFillMessage } from "react-icons/ai";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  // Submit a message
  const submitMessage = async () => {
    // Check if user is logged in
    if (!auth.currentUser) return routeData.push("/auth/login");

    if (!message) {
      toast.error("Don't leave an empty comment!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };

  //Get Comments
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data()?.comments);
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);
  return (
    <>
      <h1>Post Details</h1>
      <Message {...routeData}></Message>
      <div className="my-4">
        <div>
          <label htmlFor="comment">Write a Comment</label>
          <div className="flex">
            <input
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              name="comment"
              id="comment"
              value={message}
              placeholder="Reply"
              className="bg-gray-800 w-full text-white text-small p-2"
            />
            <button
              onClick={submitMessage}
              className="bg-cyan-500 text-white py-2 px-4 text-sm"
            >
              Submit
            </button>
          </div>
        </div>
        <div className="py-6">
          <h2 className="font-bold">
            {allMessages?.length > 0 ? allMessages?.length : "0"} Comments
          </h2>
          {allMessages?.map((message) => (
            <div className="bg-white p-4 my-4 border-2" key={message.time}>
              <div className="flex items-center gap-2 mb-4">
                <img
                  className="w-12 rounded-full"
                  src={message.avatar}
                  alt={message.userName}
                />
                <h3>{message.userName}</h3>
              </div>
              <p>{message.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
