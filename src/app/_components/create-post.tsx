"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";

import { api } from "~/trpc/react";
import { Mention, MentionsInput } from "react-mentions";
// import Picker from "emoji-picker-react";
import { FaSmile } from "react-icons/fa";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

//mockData
const mentionData = [
  {
    id: "0",
    display: "Matthew Russell",
  },
  {
    id: "1",
    display: "Julian Krispel-Samsel",
  },
  {
    id: "2",
    display: "Jyoti Puri",
  },
  {
    id: "3",
    display: "Max Stoiber",
  },
  {
    id: "4",
    display: "Nik Graf",
  },
  {
    id: "5",
    display: "Pascal Brandt",
  },
  {
    id: "6",
    display: "Žiga Miklič",
  },
];

export function CreatePost() {
  const router = useRouter();
  const [text, setText] = useState("");

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      router.refresh();
      setText("");
    },
  });

  const renderSuggestion = (
    suggestion: { id: string | number; display?: string },
    search: string,
    highlightDisplay: React.ReactNode,
    index: number,
  ) => {
    return (
      <div className="flex w-full max-w-[150px] items-center gap-2 overflow-hidden overflow-y-scroll p-2 hover:bg-slate-200">
        <span>{suggestion.display}</span>
        <span>{suggestion.id}</span>
      </div>
    );
  };

  const queryMentions = (query: string) => {
    if (query.length === 0) return mentionData.slice(0, 10);

    const matches = mentionData
      .filter((mention) => {
        return mention.display.indexOf(query.toLowerCase()) > -1;
      })
      .slice(0, 10);
    return matches;
  };
  const [showPicker, setShowPicker] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const emojiData2 = useMemo(
    () =>
      Object.values((data as any).emojis).map((e: any) => ({
        id: e.id,
        display: e.skins[0].native,
      })),
    [data],
  );

  const emojis = api.post.getEmojiData.useQuery();

  const queryEmojis = (query: string) => {
    if (query.length === 0) return emojiData2.slice(0, 10);

    const matches = emojiData2
      .filter((emoji) => {
        return emoji.id.indexOf(query.toLowerCase()) > -1;
      })
      .slice(0, 10);
    return matches;
  };

  const onEmojiSelect = (e: any) => {
    console.log("shortcodes", e.shortcodes);
    const markUp = `:${e.id}:`;
    if (!inputRef.current) return setText((t) => t + markUp);
    const atEnd = (inputRef.current.selectionStart = text.length);
    const newText = text.slice(0, atEnd) + markUp + text.slice(atEnd);
    setText(newText);
    setShowPicker(false);
    inputRef.current?.focus();
  };

  console.log("text", text);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost.mutate({ name: text });
      }}
      className="flex max-w-[600px] flex-1 flex-col gap-2"
    >
      <div className="relative flex w-full flex-1 flex-row gap-2">
        <MentionsInput
          singleLine
          allowSuggestionsAboveCursor
          forceSuggestionsAboveCursor
          a11ySuggestionsListLabel="Suggested mentions"
          placeholder="Add emojis using ':', mention people using '@'"
          className="boder-none flex-1 bg-white text-black outline-none"
          inputMode="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          inputRef={inputRef}
        >
          <Mention trigger="@" data={queryMentions} />
          <Mention
            trigger=":"
            // data={emojiData2 ?? []}
            displayTransform={
              (id, display) => {
                return emojiData2.find((e) => e.id === id)?.display;
              }
              // emojiData2.find((e) => e.id === id)?.display
            }
            markup=":__id__:"
            renderSuggestion={renderSuggestion}
            data={queryEmojis}
            // onAdd={}
          />
        </MentionsInput>
        <div className="flex items-center justify-center">
          <FaSmile
            onClick={() => setShowPicker((o) => !o)}
            cursor="pointer"
            className="text-gray-400"
            size={16}
          />
        </div>
        <div className="absolute right-0 top-0 -translate-y-[110%]">
          {showPicker && (
            <Picker
              data={data}
              onEmojiSelect={onEmojiSelect}
              onClickOutside={() => setShowPicker(false)}
            />
          )}
        </div>
      </div>
      {/* <input
        type="text"
        placeholder="Title"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full rounded-full px-4 py-2 text-black"
      /> */}
      <button
        type="submit"
        className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
        disabled={createPost.isLoading}
      >
        {createPost.isLoading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
}
