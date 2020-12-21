const express = require('express')
const socketio = require('socket.io')
const  http = require('http')
const cors = require('cors')

const Router = require('./router')

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server, {cors:{origin:'*'}});



io.on('connection', (socket)=>{
    console.log("new Client connected");

    socket.on('join', ({name, room})=>{

    })

    io.on('disconnect', ()=>{
        console.log("client disconnected");
    })
})

app.use('/', Router);



server.listen(PORT, ()=> console.log(`Server started @ ${PORT}`));