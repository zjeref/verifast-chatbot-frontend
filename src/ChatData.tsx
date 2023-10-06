import React from 'react'

export interface ChatBotProps {
    messeges: MessageType[],
    helperBubbleMessages: string[],
    queryInProgress: boolean,
    processQuery: (query: string) => Promise<void>,
    addUserMessageToChat: (query: string) => void,
    aiName: string,
    botName: string,
    indexName: string,
    integrateGA: boolean
}

export type MessageType = {
    type: string;
    position: string;
    text: string;
    sender: string;
  }


function dateToMsgTime(time: Date) {
    let hours = `${time.getHours()}`;
    let minutes = `${time.getMinutes()}`;
    if (hours.length === 1) hours = '0' + hours;
    if (minutes.length === 1) minutes = '0' + minutes;
    const msgTime = `${hours}:${minutes}`;
    return msgTime;
}

