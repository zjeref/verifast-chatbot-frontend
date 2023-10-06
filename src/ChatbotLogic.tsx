import { v4 as uuidv4 } from 'uuid';
import { getIndexSuggestions, getIndexToName, getIndexToBotName, isGAEnabled, getIntro } from './constants';
import {MUIChatBot} from './WhatsappLayout';
import { MessageType } from './ChatData';
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';

export enum Postion {
    AI = "left",
    Rigth = "right"
  }
  export enum Names {
    AI = "Mark"
  }
const ChatbotOnly = () => {
  const [inProgress, setInProgress] = useState(false);
  const [requiredClickableMessages, setRequiredClickableMessages] = useState(3);
  const [sessionId, setSessionId] = useState<string>();
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSessionId(uuidv4());
    }
  }, []);

  const useQueryParams = () => {
    return new URLSearchParams(useLocation().search);
  };

  const queryParams = useQueryParams();

  

  let defaultIndex = queryParams.get('index');
  if (!defaultIndex) defaultIndex = 'Call Center Recording';

  let selectedIndex = defaultIndex;
  if (defaultIndex === 'guruji2') {
    selectedIndex = 'guruji'
  }


  const createAIMessage = (messageText: string) => {
    const newMessage: MessageType = { type: 'text', position: Postion.AI, text: messageText, sender: Names.AI };
    return newMessage
  }

  const resolved_intro = () => {
    let configuredIntro = getIntro(selectedIndex)
    if (!configuredIntro) {
      configuredIntro = `How can we help you with ${getIndexToName(selectedIndex)}`
    }
    return [createAIMessage(configuredIntro)];
  }

  const [messages, setMessages] = useState<MessageType[]>(resolved_intro());


  const addAiMessage = (messageText: string) => {
    const newMessage: MessageType = createAIMessage(messageText)
    setMessages(oldMessages => [...oldMessages, newMessage])
  }




  const handleSendMessage = async (query: string) => {
    setRequiredClickableMessages(0)
    console.debug(`sending msg with sessionId ${sessionId}`)
    // if (socket !== null) socket.emit('query', { query, selectedIndex, sessionId, botPage })
    // else console.error("Socket was null")
  }



  const addUserMessage = (userMessage: string) => {
    setInProgress(true)
    const customerMsg = { type: 'text', position: 'right', text: userMessage, sender: 'Customer' };
    setMessages(oldMessages => [...oldMessages, customerMsg])
  }



  return <MUIChatBot
    intro={[]}
    messeges={messages}
    queryInProgress={inProgress}
    processQuery={handleSendMessage}
    addUserMessageToChat={addUserMessage}
    helperBubbleMessages={getIndexSuggestions(selectedIndex, requiredClickableMessages)}
    aiName='Mark'
    botName={getIndexToBotName(selectedIndex)}
    indexName={selectedIndex}
    integrateGA={isGAEnabled(defaultIndex)}
  />

};

export default ChatbotOnly;

