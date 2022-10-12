import Message from "../components/Message";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import Seo from "../components/Seo";
export default function Home() {
  // Create a state with all the posts
  const [allPosts, setAllPosts] = useState([]);

  const getPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setAllPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });

    return unsubscribe;
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <>
      <Seo pageTitle="All Posts" />
      <div className="my-12 font-medium">
        <h1 className="text-2xl">All Posts</h1>
        {allPosts.map((post) => (
          <Message {...post} key={post.id}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <a>
                {post.comments?.length > 0 ? post.comments?.length : "0"}{" "}
                Comments
              </a>
            </Link>
          </Message>
        ))}
      </div>
    </>
  );
}
