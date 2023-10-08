import React, { useState, ChangeEvent, KeyboardEvent } from 'react';
import Typewriter from 'typewriter-effect';
import Linkify from 'react-linkify';
import { Typography, IconButton, Grid, Paper, Box, CircularProgress, OutlinedInput, InputAdornment, styled, Tabs, Tab, TextField, Link } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { getIndexToBotHeaderImage } from './constants';
import ClickableBubble from './ClickableChip';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css'; // Import the carousel styles
import CarouselImage from './component/CarouselImage';
import {FaThumbsDown, FaThumbsUp} from "react-icons/fa"


interface IMessage {
    type: string;
    content: string[] | string; 
    sender: string;
}

export const classes = {
    chatContainer: {
        height: '100vh',
        width: '100%',
        padding: '0px',
    },
    header: {
        // background: 'linear-gradient(45deg, #1972F5 30%, #42b3f5 90%)',  // Gradient effect
        background: 'linear-gradient(45deg, rgb(47,148,245) 30%, rgb(120,221,255) 90%)',  // Gradient effect
        color: '#151515',
        height: '12%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 10px',
        borderRadius: '10px',
        boxShadow: '0 3px 5px 2px rgba(0, 0, 0, .3)', // subtle box-shadow
    },
    closeButton: {
        marginLeft: 'auto',
        color: '#151515',
    },
    messageContainer: {
        flexGrow: 2,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        padding: '3px',
        height: '70vh',
        backgroundColor: "#ffffff"
    },
    messageHints: {
        flexGrow: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'row',
        padding: '3px',
        height: '10vh',
        backgroundColor: '#6acffd',
        color: '#151515',
        border: "1px solid lightgray",
    },
    aiMessage: {
        backgroundColor: '#ffffff',
        // color: '#151515',
        margin: '10px',
        padding: '10px',
        maxWidth: '80%',
        alignSelf: 'flex-start',
        borderRadius: '1rem',
        border: '2px solid #01c9ff',
        position:'relative',
    },
    customerMessage: {
        backgroundImage: 'linear-gradient(to right bottom, #1f52e3 20%, #0ba2f6)',
        color: '#ffffff',
        margin: '10px',
        padding: '10px',
        maxWidth: '80%',
        alignSelf: 'flex-end',
        variant: 'outlined',
        borderRadius: '1rem',
    },
    messageInputAndButtonWrapper: {
        height: '5%',
        paddingBottom: '2px',
        paddingTop: '2px',
    },
    messageInput: {
        width: '100%', // allow space for send button
        innerHeight: '1rem',
        outerHeight: '1.2rem',
        // borderTop: '1px solid rgba(0, 0, 0, 0.1)', // subtle top border
        // borderLeft: 'none',  // no left border
        // borderRight: 'none', // no right border
        // borderBottom: 'none', // no bottom border
        border: `1px solid lightgray`,
        borderTop: `0`,
    },
    sendMessageButton: {
        color: '#151515',
    },
    promotional: {
        padding: '10px 0',
        color: 'steelblue',
        maxHeight: '6%'
    },
    carouselFeedback: {
        display:"flex",
        maxWidth:"300px",
        textColor: "blue",
        justifyContent: "end",
    }
};

interface MUIChatBotProps {
    intro: IMessage[],
    messeges: IMessage[],
    helperBubbleMessages: string[],
    queryInProgress: boolean,
    processQuery: (query: string) => Promise<void>,
    addUserMessageToChat: (query: string) => void,
    aiName: string,
    botName: string,
    indexName: string,
    integrateGA: boolean
}

export const MUIChatBot: React.FC<MUIChatBotProps> = ({ botName = "VeriChat", ...props }) => {
    const messagesEndRef = React.useRef<null | HTMLDivElement>(null)
    const [tabIndex, setTabIndex] = useState("1");


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



    const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        console.debug(`tabIndex is ${newValue}`)
        if (newValue !== undefined && newValue !== "undefined") {
            setTabIndex(newValue);
        }
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

    async function handleFeedbackEndpoint(user_query: string | string[], backend_res: string | string[], feedback: string): Promise<any>{
        const url = 'http://localhost:5000/verifast/feedback'; // Replace with your server URL
        const headers = {
            'Content-Type': 'application/json'
        };
    
        const payload = {
            user_message:user_query,
            backend_response: backend_res,
            feedback: feedback
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

    const handleNegativeFeedBack = async(index: number) => {
        let userResponseIndex = index
        while(props.messeges[userResponseIndex].sender!=="Customer") {
            if(userResponseIndex===0) break;
            userResponseIndex = userResponseIndex-1
        }
        const response = await handleFeedbackEndpoint(props.messeges[userResponseIndex].content, props.messeges[index].content, "negative");
        console.log(response);
    }

    const handlePositiveFeedback = async(index: number) => {
        let userResponseIndex = index
        while(props.messeges[userResponseIndex].sender!=="Customer") {
            if(userResponseIndex===0) break;
            userResponseIndex = userResponseIndex-1
        }
        const response = await handleFeedbackEndpoint(props.messeges[userResponseIndex].content, props.messeges[index].content, "positive");
        console.log(response);
    }



    const StyledTab = styled(Tab)(({ theme }) => ({
        color: '#fff', // white color
        textTransform: 'none', // disables uppercase transformation
        flexGrow: 1, // allow the tabs to take up the available space
        minHeight: '30px', // reduce the vertical height of the tabs
        '&.Mui-selected': { // change color of the selected tab
            color: '#fff',
        },
    }));

    console.log(props.messeges)
    return (
        <Grid container direction="column" sx={classes.chatContainer}>

            <Grid container direction="row" sx={classes.header}>
                <Grid container direction="row" item xs={11} sx={{ display: 'flex', alignItems: 'center', padding: '0 20' }}>
                    <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', paddingBottom: '2px' }}>
                        <Tabs
                            textColor="inherit"
                            indicatorColor="primary"
                            onChange={handleTabChange}
                            aria-label=""
                            value={tabIndex}
                            sx={{ width: '100%', '& .MuiTabs-indicator': { display: 'none' } }}
                        >
                            <StyledTab

                                sx={{
                                    justifyContent: 'left',
                                    padding: "0, 2",
                                    fontFamily: "Roboto",
                                    letterSpacing: "2px",
                                    fontSize: "larger"
                                }}
                                icon={<img src={process.env.PUBLIC_URL + getIndexToBotHeaderImage(props.indexName)} style={{
                                    width: '12vw',
                                    height: '6vh'
                                }} />}
                                iconPosition='start'
                                label={botName} value="1" />
                        </Tabs>
                    </Grid>
                </Grid>
            </Grid>

            {
                tabIndex === "1" &&
                (
                    <Box sx={classes.messageContainer}>

                        <Box sx={classes.messageContainer}>
                            {props.intro.map((message, index) => (
                                <Paper key={index} sx={classes.aiMessage}>
                                    {message.content}
                                </Paper>
                            ))}
                            {props.messeges.map((message, index) => (
                                <Paper
                                    ref={props.messeges.length - 1 === index ? messagesEndRef : null} // <- Add this line
                                    key={index + props.intro.length + 1}
                                    sx={
                                        message.sender === props.aiName ? classes.aiMessage : classes.customerMessage
                                    }
                                >
                                       {message.type !=="text" ? (
                                            <Box>
                                                <Carousel showThumbs={false}>
                                                {(message.content as string[]).map((image, imageIndex) => (
                                                    <CarouselImage
                                                    key={imageIndex}
                                                    src={image}
                                                    alt={`Image ${imageIndex}`}
                                                    caption={`Caption for Image ${imageIndex}`}
                                                    />
                                                ))}
                                                </Carousel>
                                            </Box>

                                        ) : 
                                        (
                                            <Linkify
                                                componentDecorator={(decoratedHref, decoratedText, key) => (
                                                    <Link
                                                        href={decoratedHref}
                                                        key={key}
                                                        underline="always"
                                                        target="_blank"
                                                        rel="noopener"
                                                        color="#4169e1 !important"
                                                        variant='body2'
                                                    >
                                                        {decoratedText}
                                                    </Link>
                                                )}
                                            >
                                                {message.content}
                                            </Linkify>

                                        )}
                                        <Box sx={message.sender === props.aiName ?{display:"flex",position:"absolute", right:"0", color:"blue"}:{display:'none'}}>
                                            <div style={{marginRight:"10px", cursor:'pointer'}} onClick={()=>handlePositiveFeedback(index)}>
                                                <FaThumbsUp/>
                                            </div>
                                            <div style={{cursor:'pointer'}} onClick={()=>handleNegativeFeedBack(index)}>
                                                <FaThumbsDown/>
                                            </div>
                                        </Box>
                                </Paper>
                            ))}
                        </Box>
                        {

                            props.helperBubbleMessages.length > 0 && (

                                <Box
                                    sx={classes.messageHints && {
                                    }}>
                                    {
                                        props.helperBubbleMessages.map(createBubble)
                                    }
                                </Box>
                            )
                        }
                        {props.queryInProgress &&
                            <Grid
                                sx={{
                                    fontFamily: 'Roboto, sans-serif',
                                    backgroundColor: '#f0f0f0',
                                    borderRadius: '20px',
                                    padding: '0px',
                                    maxWidth: '100%',
                                    margin: '10px 0',
                                    display: 'inline-flex',
                                    fontSize: '13px'
                                }}
                            >
                                <Grid item>
                                    <div>
                                        Agent Typing
                                    </div>
                                </Grid>
                                <Grid item>
                                    <Typewriter
                                        options={{
                                            strings: ['. . .'],
                                            autoStart: true,
                                            loop: true,
                                            delay: 300,
                                            deleteSpeed: 0
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        }
                        <Grid container justifyContent="flex-end" alignItems="center"
                            sx={classes.messageInputAndButtonWrapper && {}}>
                            <OutlinedInput
                                sx={{
                                    ...classes.messageInput,
                                    borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}`, // subtle top border
                                    borderLeft: 'none',  // no left border
                                    borderRight: 'none', // no right border
                                    borderBottom: 'none', // no bottom border,

                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                    '&:hover': {
                                        borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`, // slightly darker border on hover
                                        // borderLeft: 'none',  // no left border
                                        // borderRight: 'none', // no right border
                                        // borderBottom: 'none', // no bottom border,
                                    },
                                    '&.Mui-focused': {
                                        borderTop: (theme) => `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`, // slightly darker border when focused
                                        // borderLeft: 'none',  // no left border
                                        // borderRight: 'none', // no right border
                                        // borderBottom: 'none', // no bottom border,
                                    },
                                }}
                                value={inputValue}
                                onChange={handleInputChange}
                                onKeyDown={handleInputKeyPress}
                                // disabled={props.queryInProgress}
                                endAdornment={
                                    props.queryInProgress && false ? (
                                        <InputAdornment position="end">
                                            <CircularProgress size={20} />
                                        </InputAdornment>
                                    ) : null
                                }
                                placeholder='Hit enter to send query'
                            />
                            <IconButton onClick={handleMessageSend} disabled={props.queryInProgress && false}>
                                <SendIcon />
                            </IconButton>
                        </Grid>
                    </Box>
                )

            }
            {/* {
                tabIndex === "2" && (
                    <FAQList faqs={faqs} />
                )
            } */}
            <Grid container sx={{ height: '4.4%', borderTop: '1px solid #ccc', backgroundColor: '#f5f5f5' }}>
                <Grid item xs={8}>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="caption" align="center" color="textSecondary" sx={{ padding: '10px 0', color: 'steelblue' }}>
                        Powered by <span style={{ fontWeight: 'bold', color: 'steelblue' }}>Verifast</span>
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    );

};

