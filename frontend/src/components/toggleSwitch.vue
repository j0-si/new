<script setup lang="ts">
const props = defineProps({
  id: String,
})
</script>
<template>
  <div class="toggle-switch">

    <input 
      class="toggle-switch-checkbox"
      :id="props.id"
      type="checkbox"
      checked="true"
    >

    <label
      class="toggle-switch-display"
      :for="props.id"
    ></label>

  </div>
</template>
<style scoped>
.toggle-switch {
  --outside-width: 3rem;
  --outside-height: 1.5rem;

  --inside-ball-size: 1.1rem;
}

.toggle-switch-checkbox {
  display: none;
}

.toggle-switch-display {

  display: inline-block;
  position: relative;

  width: var(--outside-width);
  height: var(--outside-height);

  border-radius: calc(var(--outside-height) / 2);

  background: rgb(206, 206, 206);

  transition: .36s var(--ease-out-expo);
  
  /* inside circle */
  &::after {
    content: '';
    
    position: absolute;
    z-index: 2;
    top: calc(var(--outside-height) / 2);
    left: calc(var(--outside-height) / 2);
    
    transform: translate(-50%, -50%);
    
    width : var(--inside-ball-size);
    height: var(--inside-ball-size);
    
    border-radius: .65rem;
    
    background: white;

    box-shadow: 0 0 8px rgba(128, 128, 128, 0.5);

    transition: .36s var(--ease-out-expo);
  }
}

/* checked (ON) style */
.toggle-switch-checkbox:checked + .toggle-switch-display {
  background: rgb(116, 243, 116);
  
  /* inside circle */
  &::after {
    left: calc(var(--outside-height) / 2 + (var(--outside-width) - var(--outside-height)));
  }
}
</style>