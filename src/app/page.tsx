import Link from "next/link";

import { CreatePost } from "~/app/_components/create-post";
import { api } from "~/trpc/server";
import { Post } from "./Post";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "from tRPC" });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">Mentions</span> App
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="max-w-sm text-center">
            This app uses react-mentions and react-emoji-picker in tandem and
            showcases that you do not need to store mentions in the backend
            explicitly
          </p>
        </div>

        <CrudShowcase />
      </div>
    </main>
  );
}

async function CrudShowcase() {
  const latestPost = await api.post.getAll.query();

  return (
    <div className="w-full max-w-xl">
      <div className="flex w-full flex-col-reverse gap-2">
        {latestPost.length > 0 ? (
          latestPost.map((p) => <Post message={p.name ?? ""} />)
        ) : (
          <p>You have no posts yet.</p>
        )}
      </div>
      <CreatePost />
    </div>
  );
}
