const socket=io();
const messageBox=document.querySelector('.chats');
let username=null;
//Get Username and Room From Url
window.addEventListener('DOMContentLoaded',()=>{
const {user,room}=Qs.parse(location.search,{
    ignoreQueryPrefix:true
})
username=user;
document.querySelector('#user').innerText=user;
socket.emit('join',user,room);
});


socket.on('joined-user',user=>{
    console.log(user +' user joined');
})


function sendMessage()
{
    const msg=document.querySelector('#message-input').value;
    let send=document.createElement('div');
    send.classList.add('send');
    let message=document.createElement('message');
    message.classList.add('message');
    let span=document.createElement('span');
    span.innerText='You';
    let p=document.createElement('p');
    p.innerText=msg;
    message.appendChild(span);
    message.appendChild(p);
    send.appendChild(message);
    messageBox.appendChild(send); 

    socket.emit('send',msg)                                                 
    document.querySelector('#message-input').value='';
}

socket.on('received',({sender,message})=>{
    let received=document.createElement('div');
    received.classList.add('received');
    let messag=document.createElement('message');
    messag.classList.add('message');
    let span=document.createElement('span');
    span.innerText=sender;
    let p=document.createElement('p');
    p.innerText=message;
    messag.appendChild(span);
    messag.appendChild(p);
    received.appendChild(messag);
    messageBox.appendChild(received);
})

socket.on('joined-users',users=>{
    
    document.querySelector('#users').innerHTML='';
users.forEach(user=>{
let li=document.createElement('li');
li.innerText=user.name;
document.querySelector('#users').appendChild(li);
})
})

function leaveRoom()
{
    window.location='http://localhost:4000';
}

socket.on('user-left',(name)=>{
    let info=document.createElement('div');
    info.classList.add('info');
    let p=document.createElement('p');
    p.innerText= `${name} has left`;
    info.appendChild(p);
    messageBox.appendChild(info);
})