import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { posts } from "~/server/db/schema";

type Emoji = {
  emoji: string;
  name: string;
  shortname: string;
  unicode: string;
  html: string;
  category: string;
  order: string;
}

type EmojiTag = {
  id: string;
  display: string;
}

type EmojiData = {
  emojis: Emoji[]
}

export const postRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await ctx.db.insert(posts).values({
        name: input.name,
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });
  }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.query.posts.findMany({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    })
  }),

  getEmojiData: publicProcedure.query(async ({ ctx }) => {
    const response = await fetch("https://gist.githubusercontent.com/oliveratgithub/0bf11a9aff0d6da7b46f1490f86a71eb/raw/d8e4b78cfe66862cf3809443c1dba017f37b61db/emojis.json");
    const json: EmojiData = await response.json();
    console.log('json', json)
    return json.emojis.map((emoji) => ({
      id: emoji.shortname,
      display: emoji.emoji
    }))
  }),
});
