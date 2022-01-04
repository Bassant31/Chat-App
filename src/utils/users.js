const users = []

const addUser = ({id,username,room})=>{
    //clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if(!username || !room){
        return{
            error:"user and room are required"
        }
    }
    // check existing user

    const existingUser = users.find((user)=>{
        return user.room === room && user.username ==username

    })

    //validate username
    if(existingUser){
        return{
            error:'User is in use!'
        }
    }

    //store user
    const user = {id,username,room}
    users.push(user)
    return{user}

}

const removeUser = (id)=>{

     const index = users.findIndex((user)=>user.id === id)

    //validate username
    if(index !== -1){
        return users.splice(index,1)[0]
    }

}

const getUser= (id)=>{
    return users.find((user)=>user.id === id)


}

const getUsersInRoom= (room)=>{
    room = room.trim().toLowerCase()
    return users.filter((user)=>user.room === room)


}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
    
}























/*
addUser({
    id:123,
    username:'boboi',
    room:'venesa'
})
addUser({
    id:13,
    username:'boboi',
    room:'bali'
})
addUser({
    id:12,
    username:'koo',
    room:'venesa'
})

console.log(users)

/*const removeUserr = removeUser(123)
console.log(removeUserr)
console.log(users)*/
/*
console.log(getUser(123))

console.log(getUsersInRoom('venesa'))*/


