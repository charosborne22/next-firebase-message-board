import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import Seo from "../components/Seo";

export default function Post() {
  const route = useRouter();
  const routeData = route.query;
  // Form state
  const [post, setPost] = useState({ description: "" });

  const [user, loading] = useAuthState(auth);

  // Submit Post
  const submitPost = async (e) => {
    e.preventDefault();
    // Check post length
    if (!post.description) {
      toast.error("Description empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (post.description.length > 300) {
      toast.error("Description too long", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      toast.success("Post has been updated!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
    } else {
      // Make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        timestamp: serverTimestamp(),
        user: user.uid,
        avatar: user.photoURL,
        username: user.displayName,
      });
      setPost({ description: "" });
      toast.success("Post has been made!", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return route.push("/");
    }
  };

  // Check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (routeData.id) {
      setPost({ description: routeData.description, id: routeData.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <>
      <Seo
        pageTitle={post.hasOwnProperty("id") ? "Edit Post" : "Create Post"}
      />
      <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
        <h1 className="text-2xl">
          {post.hasOwnProperty("id") ? "Edit Post" : "Create Post"}
        </h1>
        <form onSubmit={submitPost}>
          <div>
            <label htmlFor="post" className="block text-lg font-medium py-2">
              Description
            </label>
            <textarea
              value={post.description}
              onChange={(e) =>
                setPost({ ...post, description: e.target.value })
              }
              name="post"
              id="post"
              className="bg-gray-800 h-48 w-full text-white rounded-lg p-2 text-sm"
            ></textarea>
            <p
              className={`font-medium text-small ${
                post.description.length > 300 ? "text-red-600" : ""
              }`}
            >
              {post.description.length}/300
            </p>
          </div>
          <button
            type="submit"
            className="w-full bg-cyan-500 text-white font-medium p2 my-2 rounded-lg text-small"
          >
            Post
          </button>
        </form>
      </div>
    </>
  );
}
