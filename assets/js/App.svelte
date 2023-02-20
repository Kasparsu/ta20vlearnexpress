<script>
  import Message from "./components/Message.svelte";
  import { onMount } from 'svelte';
  import axios from 'axios';
  let messages = [];
  let message = '';
  let socket = null;
  let user = null;
  onMount(() => {
    axios.get('http://localhost:3000/user/').then(res => {
      user=res.data;
    });

    axios.get('http://localhost:3000/messages/').then(res => {
      messages=res.data;
      scrollToBottom();
    });
    
        // Create WebSocket connection.
    socket = new WebSocket('ws://localhost:8080');

    // Connection opened
    socket.addEventListener('open', onOpen);

    // Listen for messages
    socket.addEventListener('message', onMessage);
  });

  function onOpen(event){
    //socket.send('Hello Server!');
  }

  function onMessage(event){
    console.log('Message from server ', event.data);
    messages = [...messages, JSON.parse(event.data)];
    scrollToBottom();
  }

  function scrollToBottom(){
    setTimeout(()=> {
        let chatBox = document.querySelector('#chat-box');
        chatBox.scrollTop = chatBox.scrollHeight;
      },0);     
  }
  function send(){
    
    axios.post('http://localhost:3000/messages/', {
      message: message
    }).then(res => {
      socket.send(JSON.stringify(res.data));
      messages = [...messages, res.data];
      scrollToBottom();
    });
  }
</script>

<div class="min-h-[80vh] max-h-[80vh] overflow-y-scroll" id="chat-box">
  {#each messages as message}
    <Message 
      isOwner={message.userId == user.id}
      message={message.message}
      name={message.user.name}
      time={message.timestamp}
      status="seen"></Message>
  {/each}
</div>
<div class="form-control">
  <div class="input-group">
    <input bind:value={message} type="text" placeholder="Write message here..." class="input input-bordered w-full" />
    <button class="btn" on:click={send}>Send</button>
  </div>
</div>

