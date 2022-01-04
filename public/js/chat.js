const socket = io()
const $messageForm = document.querySelector("#message-form")
const $messageFormInput = $messageForm.querySelector("input")
const $messageFormButton = $messageForm.querySelector("button")
const $locationButton = document.querySelector("#send-location")
const $messages = document.querySelector('#meassages')

//templates

const messageTemplate =document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML
//options
const{username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})

const autoscroll = ()=>{
    // new message element
    const $newMessage = $messages.lastElementChild


    //height of the new message
    const newMessageStyle = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyle.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight+newMessageMargin

    //visible height 
    const visibleHeight = $messages.offsetHeight
     // height of message
    const containerHeight = $messages.scrollHeight
    // how far have i scroll
    const scrollOffset = $messages.scrollTop+visibleHeight
    if(containerHeight - newMessageHeight <= scrollOffset){
        $messages.scrollTop = $messages.scrollHeight
    }
    
    console.log(newMessageStyle)
}
socket.on("message",(message)=>{
    console.log(message)
    const html =Mustache.render(messageTemplate,{
        message:message.text,
        createdAt:moment(message.createdAt).format('h:mm a'),
        username:message.username
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('locationMessage',(message)=>{
    console.log(message)
    const html = Mustache.render(locationMessageTemplate,{
        url:message.url,
        createdAt:moment(message.createdAt).format('h:mm a'),
        username:message.username
    
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})

socket.on('roomData',({room,users})=>{
   const html = Mustache.render(sidebarTemplate,{
       room,
       users
   })
   document.querySelector('#sidebar').innerHTML=html
})
$messageForm.addEventListener('submit',(e)=>
{
    e.preventDefault()
    $messageFormButton.setAttribute('disabled','disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage',message,(error)=>{
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value=''
        $messageFormInput.focus()
        if(error){
            return console.log(error)
        }
        console.log('msg is delivered!!')
    })

})

$locationButton.addEventListener('click',()=>{
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $locationButton.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation',{
            longitude:position.coords.longitude,
            latitude:position.coords.latitude
        },()=>{
           
            $locationButton.removeAttribute('disabled')
         
            console.log('location shared!')
        })
        
    })
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.href='/'
    }

})