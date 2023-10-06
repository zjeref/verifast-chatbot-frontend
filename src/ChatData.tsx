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

export interface MessageType {
    text: string;
    sender: string;
    messageTime: string;
}

export class AIMessage implements MessageType {
    text: string;
    sender: string = 'AI'; // fixed value for sender
    messageTime: string;

    constructor(text: string, time: Date) {
        this.text = text;
        const msgTime = dateToMsgTime(time);
        this.messageTime = msgTime
    }
}

export class CustomerMessage implements MessageType {
    text: string;
    messageTime: string;
    sender: string = 'Customer'; // fixed value for sender

    constructor(text: string, time: Date) {
        this.text = text;
        this.messageTime = dateToMsgTime(time);
    }
}

function dateToMsgTime(time: Date) {
    let hours = `${time.getHours()}`;
    let minutes = `${time.getMinutes()}`;
    if (hours.length == 1) hours = '0' + hours;
    if (minutes.length == 1) minutes = '0' + minutes;
    const msgTime = `${hours}:${minutes}`;
    return msgTime;
}

