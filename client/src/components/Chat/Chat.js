import React from 'react'
import {useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'

import Infobar from '../Infobar/Infobar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'
import TextContainer from '../TextContainer/TextContainer'
import './Chat.css'

let socket;

function Chat({location}) {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState([]);
    const [roomData, setRoomData] = useState({});

    const URL = 'localhost:5000';

    useEffect(()=>{

        const {name, room} = queryString.parse(location.search);

        socket = io(URL);
        setName(name);
        setRoom(room);

        // console.log(name, room);
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

        socket.on('roomData', (roomData)=>{
            setRoomData(roomData);
            // console.log(roomData);
        })
    }, [messages, roomData]);

    function sendMessage(event){
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, ()=> setMessage(''));
        }
        setMessage('');
        // console.log(message, messages);
    }

    return (
        <div className="outerContainer">
            <div className="container">
                <Infobar room={room} />
                <Messages messages={messages} name={name} />
                <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
            </div>
            <TextContainer users={roomData.users} />
        </div>
    )
}

export default Chat
