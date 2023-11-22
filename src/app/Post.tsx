"use client";

import { useParsers } from "~/util/parseMessage";

export type PostProps = {
  message: string;
};

export const Post = (props: PostProps) => {
  const { message } = props;
  const parsedMessage = useParsers(message);
  return <p className="truncate">{parsedMessage}</p>;
};
