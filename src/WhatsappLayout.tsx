import React, { ChangeEvent, useState, KeyboardEvent } from 'react'
import { AIMessage, MessageType, ChatBotProps } from './ChatData';
import { getIndexToBotHeaderImage, toDateString } from './constants';




function WhatsappLayout({ ...props }: ChatBotProps) {
    const messagesEndRef = React.useRef<null | HTMLDivElement>(null)

    const [inputValue, setInputValue] = useState('');
    const [messageParts, setMessageParts] = useState<string[]>([]);
    const timeoutIdRef = React.useRef<number | null>(null);

    const sendQuery = () => {
        if (messageParts.length > 0) {
            const message = messageParts.join(' ');
            props.processQuery(message);
            setMessageParts([]);  // Clear the array
        }
    };



    React.useEffect(() => {
        // if the inputValue is changing before my 3 sec window passes, keep delaying the sendQuery
        if ((inputValue.trim() !== '' || messageParts.length !== 0) && timeoutIdRef.current === null) {
            if (timeoutIdRef.current) {
                clearTimeout(timeoutIdRef.current);
            }
            timeoutIdRef.current = window.setTimeout(sendQuery, 4000);  // 3 second delay
        }

        return () => {
            if (timeoutIdRef.current) {
                window.clearTimeout(timeoutIdRef.current);
                timeoutIdRef.current = null; // We need to set this to null after clearing
            }
        };
    }, [inputValue, messageParts]);

    const handleMessageSend = () => {
        if (inputValue.trim() === '') return;
        setMessageParts(prev => [...prev, inputValue]);  // Add the input message to the array
        setInputValue('');
        props.addUserMessageToChat(inputValue);
    };





    React.useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [props.messeges]);


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleInputKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') handleMessageSend();
    };
    const createBubble = (content: string, index: number) => {
        return <ClickableBubble key={index} content={content}
            clickHandler={() => {
                setInputValue(content)
                handleMessageSend()
            }
            }
        />
    }

    return (
        <div>
            <div className="w-full h-32" style={{ backgroundColor: "#449388" }}></div>

            <div className="box mx-0 w-full -mt-32">
                <div className="h-screen">
                    <div className="flex border border-grey rounded shadow-lg h-full">
                        <div className="w-full border flex flex-col">
                            <div className="py-2 px-3 bg-grey-lighter flex flex-row justify-between items-center">
                                <div className="flex items-center">
                                    <div>
                                        <img className="w-10 h-10 rounded-full" src={`/images/clients/${getIndexToBotHeaderImage(props.indexName)}`} />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-grey-darkest">
                                            {props.botName}
                                        </p>
                                        <p className="text-grey-darker text-xs mt-1">
                                            {props.queryInProgress ? "typing..." : "Online"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex">
                                </div>
                            </div>

                            <ChatMessageGroup messages={props.messeges} />

                            {

                                props.helperBubbleMessages.length > 0 && (
                                    <div
                                        className='
            overflow-y-auto flex flex-row flex-wrap p-1 bg-[#dad3cc] text-[#151515] 
        '>
                                        {
                                            props.helperBubbleMessages.map(createBubble)
                                        }
                                    </div>
                                )

                            }
                            <div className="bg-[#f0f2f5] px-4 py-4 flex items-center">
                                <div className="flex-1 mx-4">
                                    <input
                                        className="w-full border rounded px-2 py-2 bg-[#ffffff] text-black"
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        placeholder='Message'
                                        onKeyDown={handleInputKeyPress}
                                    />
                                </div>
                                <div>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" height="24" width="24" preserveAspectRatio="xMidYMid meet" version="1.1" x="0px" y="0px" enable-background="new 0 0 24 24" xmlSpace="preserve" onClick={handleMessageSend}><path fill="#63737c" d="M1.101,21.757L23.8,12.028L1.101,2.3l0.011,7.912l13.623,1.816L1.112,13.845 L1.101,21.757z"></path></svg>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default WhatsappLayout


function ChatMessageGroup({ messages }: MessageGroupProps) {
    return (<div className="flex-1 overflow-auto" style={{ backgroundColor: "#DAD3CC" }}>
        <div className="py-2 px-3">

            <ConversationDate />

            <ChatbotSecureNotification />

            {messages.map((message, index) => {
                if (message instanceof AIMessage) {
                    return (
                        <AIMessageComp
                            key={index}
                            message={message}
                        />
                    );
                } else {
                    return (
                        <UserMessageComp key={index} message={message} />
                    )
                }
            })}
        </div>
    </div>);
}

interface MessageProps {
    message: MessageType;
}
interface MessageGroupProps {
    messages: MessageType[];
}
function UserMessageComp({ message }: MessageProps) {
    return <div className="flex justify-end mb-2">
        <div className="rounded py-2 px-3" style={{ backgroundColor: "#E2F7CB" }}>
            <p className="text-sm mt-1 text-black">
                {message.text}
            </p>
            <p className="text-right text-xs text-grey-dark mt-1 text-[#7A8A91]">
                {message.messageTime}
            </p>
        </div>
    </div>;
}
function AIMessageComp({ message }: MessageProps) {
    return (<div className="flex mb-2">
        <div className="rounded py-2 px-3" style={{ backgroundColor: "#FFFFFF" }}>
            <p className="text-left text-sm text-black mt-1">
                {message.text}
            </p>
        </div>
    </div>);
}

function ChatbotSecureNotification() {
    return (<div className="flex justify-center mb-4">
        <div className="rounded py-2 px-4" style={{ backgroundColor: "#D9FDD3" }}>
            <p className="text-xs text-[#CD9D78]">
                Messages to this chat and calls are now secured with end-to-end encryption. Tap for more info.
            </p>
        </div>
    </div>);
}

function ConversationDate() {
    return (<div className="flex justify-center mb-2">
        <div className="rounded py-2 px-4" style={{ backgroundColor: "#FEFEFE" }}>
            <p className="text-sm uppercase text-[#CD9D78]">
                {toDateString(new Date())}
            </p>
        </div>
    </div>);
}

interface ClickableBubbleProps {
    content: string,
    clickHandler: (() => void);
    backgroundColor?: string,
}
const ClickableBubble = (props: ClickableBubbleProps) => {
    return (
        <div
            data-te-chip-init
            data-te-ripple-init
            className="my-[0.3vh] mr-2 flex whitespace-nowrap cursor-pointer items-center justify-between rounded-[16px] bg-[#eceff1] px-[12px] py-0 text-[13px] font-normal normal-case leading-loose text-[#4f4f4f] shadow-none transition-[opacity] duration-300 ease-linear hover:!shadow-none active:bg-[#cacfd1] dark:bg-neutral-600 dark:text-neutral-200"
            data-te-close="true"
            onClick={props.clickHandler}>
            {props.content}
        </div>
    );
}
