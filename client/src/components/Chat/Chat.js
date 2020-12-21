import React from 'react'
import {useState, useEffect} from 'react'
import queryString from 'query-string'
import io from 'socket.io-client'


import './Chat.css'

function Chat({location}) {

    const [name, setName] = useState('')
    const [room, setRoom] = useState('')
    const URL = 'localhost:5000';

    useEffect(()=>{

        const {name, room} = queryString.parse(location.search);

        const socket = io(URL);
        setName(name);
        setRoom(room);

        console.log(name, room);
        socket.emit('join', {name, room});

        return ()=>{
            socket.emit('disconnect');
            socket.off();
        }
    },[URL, location.search]);

    return (
        <div>
            Chat
        </div>
    )
}

export default Chat
