import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "../utils/firebase";
import Message from "../components/Message";
import { BsTrash2Fill } from "react-icons/bs";
import { AiFillEdit } from "react-icons/ai";
import Link from "next/link";

export default function Dashbaord() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");

    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };
  // Delete Post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <>
      <h1 className="text-2xl">My Posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message {...post} key={post.id}>
              <div className="flex gap-4 ">
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-pink-600 flex items-center gap-2 py-3 text-small"
                >
                  <BsTrash2Fill /> Delete
                </button>
                <Link href={{ pathname: "/post", query: post }}>
                  <a className="text-teal-600 flex items-center gap-2 py-3 text-small">
                    <AiFillEdit /> Edit
                  </a>
                </Link>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        onClick={() => auth.signOut()}
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6 rounded-lg"
      >
        Logout
      </button>
    </>
  );
}
