module.exports={
    users:[],
    getUser(id){
    let user=this.users.find(user=>user.id==id);
    return user;
    },
    joinUser(obj){
        this.users.push(obj);
        return obj;
    },
    deleteUser(id)
    {
     let users=this.users.filter(user=>user.id!==id);
     this.users=users;
    },
    getUsersByRoom(room)
    {
        let users=this.users.filter(user=>user.room==room);
        return users;
    }

}