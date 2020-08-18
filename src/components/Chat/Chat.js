import React, { useState, useEffect } from "react";
import queryString from 'query-string';
import io from "socket.io-client";

import './Chat.css';

import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

let socket;

function Chat({location}) {

    //STATES
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const ENDPOINT = 'https://react-chat-app-emi.herokuapp.com/'

    useEffect(()=>{
        const {name,room} = queryString.parse(location.search)

        socket = io(ENDPOINT)

        setName(name);
        setRoom(room);

        socket.emit('join', {name, room}, ()=>{
            
        })

        return () => {
            socket.emit('disconnect');
            socket.off();
        }
    }, [ENDPOINT, location.search]) //only runs if endpoint or location changes

    useEffect(()=>{
        socket.on('message', (message) => {
            setMessages([...messages,message])
        });
    }, [messages])


    const sendMessage = (event) => {
        event.preventDefault();
    
        if(message) {
          socket.emit('sendMessage', message, () => setMessage(''));
        }
    }

    //function for sending messages

    return (
        <div className="outerContainer">
            <div className="container">
                <InfoBar room={room}/>
                <Messages messages={messages} name={name}/>
                <Input  message={message} 
                        setMessage={setMessage} 
                        sendMessage={sendMessage}/>
                {/*<TextContainer users={users}/>*/}
            </div>
        </div>
    );
}

export default Chat;