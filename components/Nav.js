import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <header>
        <nav className="flex justify-between items-center py-10">
          <Link href="/">
            <a className="text-3xl font-medium">Message Board</a>
          </Link>
        </nav>
      </header>
    );

  return (
    <header>
      <nav className="flex justify-between items-center py-10">
        <Link href="/">
          <a className="text-3xl font-medium">Message Board</a>
        </Link>
        {!user && (
          <ul className="flex items-center gap-10">
            <li>
              <Link href="/auth/login">
                <a className="py-2 px-4 text-small bg-cyan-500 text-white font-medium ml-8 rounded-lg">
                  Join Now
                </a>
              </Link>
            </li>
          </ul>
        )}

        {user && (
          <ul className="flex items-center gap-10">
            <li>
              <Link href="/post">
                <a className="py-2 px-4 text-small bg-cyan-500 text-white font-medium ml-8 rounded-lg">
                  Post
                </a>
              </Link>
            </li>
            <li>
              <Link href="/dashboard">
                <img
                  src={user.photoURL}
                  alt={user.displayName}
                  className="w-12 rounded-full cursor-pointer"
                />
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
