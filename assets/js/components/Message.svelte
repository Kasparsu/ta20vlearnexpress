<script>
    export let time,isOwner,message,status,name;
</script>

<div class="chat" class:chat-end={isOwner} class:chat-start={!isOwner}>
    <div class="chat-header">
      {name}
      <time class="text-xs opacity-50">{time}</time>
    </div>
    <div class="chat-bubble">{message}</div>
    <div class="chat-footer opacity-50">
      {status}
    </div>
</div>