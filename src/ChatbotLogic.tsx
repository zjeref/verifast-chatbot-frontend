import { v4 as uuidv4 } from 'uuid';
import {  getIntro } from './constants';
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


  const createAIMessage = (messageContent: string | string[], messageType: string) => {

    const newMessage: MessageType = { type: messageType, position: Postion.AI, content: messageContent, sender: Names.AI };
    return newMessage
  }

  const resolved_intro = () => {
    let configuredIntro = getIntro(selectedIndex)
    if (!configuredIntro) {
      configuredIntro = `How can we help you with Verifast`
    }
    return [createAIMessage(configuredIntro, "text")];
  }

  const [messages, setMessages] = useState<MessageType[]>(resolved_intro());


  const addAiMessage = (messageText: string, messageType: string) => {
    const newMessage: MessageType = createAIMessage(messageText, messageType)
    setMessages(oldMessages => [...oldMessages, newMessage])
  }


  async function invokeChatEndpoint(query: string): Promise<any> {
    const url = 'http://localhost:5000/verifast'; // Replace with your server URL
    const headers = {
        'Content-Type': 'application/json'
    };

    const payload = {
        query: query
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    return await response.json();
}

  const handleSendMessage = async (query: string) => {
    setRequiredClickableMessages(0)
    console.debug(`sending msg with sessionId ${sessionId}`)
    const {text, images} = await invokeChatEndpoint(query);
    setInProgress(false)
    addAiMessage(text, "text")
    console.log(images)
    if(images.length > 0) {
      addAiMessage(images, "array")
    }
  }



  const addUserMessage = (userMessage: string) => {
    setInProgress(true)
    const customerMsg = { type: 'text', position: 'right', content: userMessage, sender: 'Customer' };
    setMessages(oldMessages => [...oldMessages, customerMsg])
  }

  console.log(messages)

  return <MUIChatBot
    intro={[]}
    messeges={messages}
    queryInProgress={inProgress}
    processQuery={handleSendMessage}
    addUserMessageToChat={addUserMessage}
    helperBubbleMessages={[]}
    aiName='Mark'
    botName='VeriBot'
    indexName={selectedIndex}
    integrateGA={false}
  />

};

export default ChatbotOnly;

