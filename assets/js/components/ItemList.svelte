<script>
    export let title, items;
</script>

<h1 class="text-2xl font-bold">{title}</h1>
<ul class="list-disc">
  {#each items as item}
    <li>
      {item.title}
      <input type="checkbox" class="checkbox" bind:checked={item.isDone}>
    </li>
  {/each}
</ul>