import React from 'react'
import {useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import Infobar from '../Infobar/Infobar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import './Chat.css'

let socket;

function Chat({location}) {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState([]);

    const URL = 'localhost:5000';

    useEffect(()=>{

        const {name, room} = queryString.parse(location.search);

        socket = io(URL);
        setName(name);
        setRoom(room);

        console.log(name, room);
        socket.emit('join', {name, room},()=>{});

        return ()=>{
            socket.emit('disconnect');
            socket.off();
        }
    },[URL, location.search]);


    useEffect(()=>{
        socket.on('message', (message)=>{
            setMessages([...messages, message]);
        });
    }, [messages]);

    function sendMessage(event){
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage(''));
        }
        console.log(message, messages);
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <Infobar room={room} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
        </div>
    )
}

export default Chat
