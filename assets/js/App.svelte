<script>
  import ItemList from "./components/ItemList.svelte";

  let message = '';
  let items = [
    {title:'vodka', isDone: false},
    {title:'bread', isDone: true},
    {title:'beer', isDone: false},
  ];
  $: doneItems = items.filter(item => item.isDone);
  $: toDoItems = items.filter(item => !item.isDone);
  function addItem(){
    //items.push(message);
    // items = items;
    if(message.trim() !== ''){
      items = [...items, {title: message, isDone: false}];
    }
    message = '';
  }
</script>

<div class="form-control">
  <div class="input-group">
    <input type="text" class="input input-bordered" bind:value={message} />
    <button class="btn" on:click={addItem}>Add</button>
  </div>
</div>

<ItemList title="All Items" bind:items={items}></ItemList>
<ItemList title="Done Items" bind:items={doneItems}></ItemList>
<ItemList title="Todo Items" bind:items={toDoItems}></ItemList>