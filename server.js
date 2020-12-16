require('dotenv').config();
const express=require('express');
const { deleteUser } = require('./Users');
const app=express();
const http=require('http').createServer(app);
const io=require('socket.io')(http);
const user=require('./Users');


io.on('connection',socket=>{
    console.log('Socket is connected');
     
   socket.on('join',(username,room)=>{
     let joinUser=user.joinUser({id:socket.id,name:username,room:room});
     socket.join(joinUser.room);
     io.to(joinUser.room).emit('joined-users',user.getUsersByRoom(joinUser.room));
     
     socket.on('send',message=>{
     let sender=user.getUser(socket.id); 
     socket.broadcast.to(joinUser.room).emit('received',{sender:sender.name,message:message});   
     })
     socket.broadcast.to(joinUser.room).emit('joined-user',joinUser.name);
   
   }); 
    socket.on('disconnect',()=>{
       
        let leftUser=user.getUser(socket.id);
        if(leftUser)
        {
        user.deleteUser(leftUser.id);
        io.to(leftUser.room).emit('joined-users',user.getUsersByRoom(leftUser.room));
        io.emit('user-left',leftUser.name);
        }
    })
})

          


app.set('views','./templates');
app.set('view engine','ejs');

app.use(express.static('./public'));

app.get('/',(request,response)=>{
    response.render('welcome.ejs');
})
app.get('/chatRoom',(request,response)=>{
    response.render('chatRoom.ejs');
})

http.listen(process.env.PORT,()=>{
console.log(`Your app is running at http://localhost:${process.env.PORT}`);
});