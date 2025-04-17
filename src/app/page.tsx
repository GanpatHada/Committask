import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route"; // adjust path as needed


export default async function Home() {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return <p>You must be signed in</p>;
  }

  return <div>
    Welcome, {session.user?.email}!
    <button className="bg-black text-white px-3 py-1">Logout</button>
    {session?.user?.image?<img style={{height:'200px',width:'200px'}} src={session?.user?.image} alt="..." />:<span>{'G'}</span>}
  </div>;
}
