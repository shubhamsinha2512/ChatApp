const users = [];

const addUser = ({id, name, room}) => {
    name=name.tirm().toLowerCase();
    room=room.tirm().toLowerCase();

    const existingUser = users.find((user) => user.room === room && user.name === name);

    if(existingUser) return {error: "username already taken!"}

    const user = {id, name, room};
    users.push(user);

    return {user};
}

const removeUser = ()=>{
    
}