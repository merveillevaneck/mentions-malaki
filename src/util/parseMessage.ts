import data from '@emoji-mart/data';
import { useMemo } from 'react';

const parseEmojis = (message: string) => {
  const regex = /:[a-z-_]+:/g
  const matches = message.match(regex)
  console.log('matches', matches)
  if (!matches) return message
  let parsedMessage = message
  matches.forEach((match) => {
    const emoji = emojiData.find((emoji) => (':' + emoji.id + ':') === match)
    if (emoji) {
      console.log('found match for: ', emoji.id)
      parsedMessage = parsedMessage.replace(match, emoji.display)
    }
  })
  console.log('parsedMessage', parsedMessage)
  return parsedMessage
}

//the markdown/markup for mentions is @[__id__](__display__)
export const parseMentions = (message: string) => {
  //todo: check this regex and tweak it if needed while testing
  const regex = /@\[([a-zA-Z0-9_]+)\]\(([^)]+)\)/g
  const matches = message.match(regex)
  if (!matches) return message
  let parsedMessage = message
  matches.forEach((match) => {
    const mention = match.replace('@', '')
    parsedMessage = parsedMessage.replace(match, `@${mention}`)
  })
  return parsedMessage
}
console.log('emojis', (data as any).emojis)
const emojiData = Object.values((data as any).emojis).map((emoji: any) => ({ id: emoji.id, display: emoji.skins[0].native }))

export const useEmojiParser = (message: string) => {
  return useMemo(() => parseEmojis(message), [message])
}

export const useMentionsParser = (message: string) => {
  return useMemo(() => parseMentions(message), [message])
}

export const useParsers = (message: string) => {
  const parsedWithMentions = useMentionsParser(message)
  const parsedWithEmojis = useEmojiParser(parsedWithMentions)
  return parsedWithEmojis
}
