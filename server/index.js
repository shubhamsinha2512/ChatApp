const express = require('express')
const socketio = require('socket.io')
const  http = require('http')
const cors = require('cors')

const Router = require('./router')
const {addUser, removeUser, getUser, getUsersInRoom} = require('./users');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {cors:{origin:'*'}});



io.on('connection', (socket)=>{
    console.log("new Client connected");

    socket.on('join', ({name, room}, callback)=>{
        const {error, user} = addUser({id:socket.id, name, room});

        if(error){
            return callback(error);
        }

        socket.emit('message', {user:'admin', text:`Welcome ${user.name} to the ${user.room}`});
        socket.broadcast.to(user.room).emit('message', {user:'admin', text:`${user.name} has joined!`});

        socket.join(user.room);
        io.to(user.room).emit('roomData', {room : user.room, users:getUsersInRoom(user.room)});
        // callback();
    })

    socket.on('sendMessage', (message, callabck)=>{
        const user = getUser(socket.id);
        
        io.to(user.room).emit('message', {user:user.name, text:message})
        io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)});
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id);

        if(user){
            io.to(user.room).emit('message', {user:'admin', text:`${user.name} has left!}`});
            io.to(user.room).emit('roomData', {room:user.room, users:getUsersInRoom(user.room)});
        }
    })
})

app.use('/', Router);



server.listen(PORT, "0.0.0.0", ()=> console.log(`Server started @ ${PORT}`));