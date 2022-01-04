const path = require('path') //it is a node core module so there is no need to install it
const http = require('http') //anothere way to use express 
const express= require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage,generateLocationMessage} = require('./utils/message')
const {addUser,removeUser,getUser,getUsersInRoom} = require('./utils/users')

const { use } = require('express/lib/application')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname,'../public')
//__dirname ==> name of current directory 

app.use(express.static(publicDirectoryPath))
// to use static files like html,css,...

io.on('connection',(socket)=>{
    console.log("new web socket connection")
   
    socket.on('join',(options,callback)=>{
        const {error,user} = addUser({id:socket.id,...options}) 
        if(error){
            return callback(error)
        }
       
       
        socket.join(user.room)
         socket.emit('message',generateMessage('Admin','Welcome!'))
         socket.broadcast.to(user.room).emit('message',generateMessage('Admin',`${user.username} has joined!`))
         io.to(user.room).emit('roomData',{
             room:user.room,
             users:getUsersInRoom(user.room)
         })
         callback()

    })
    socket.on('sendMessage',(message,callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)) {
            return callback('profen is not allowed')
        }
       

        io.to(user.room).emit('message',generateMessage(user.username,message))
        callback()

    })
    socket.on('sendLocation',(obj,callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://www.google.com/maps/place/q=${obj.latitude},${obj.longitude} `))
        callback()
    })

    socket.on('disconnect',()=>{
        const user =removeUser(socket.id)
        
        if(user){
              io.to(user.room).emit('message',generateMessage('Admin',`${user.username} has left !`))
              io.to(user.room).emit('roomData',{
             room:user.room,
             users:getUsersInRoom(user.room)
         })
        }
       
      

    })

})
server.listen(port,()=>{
    console.log("listen on port",port)

})