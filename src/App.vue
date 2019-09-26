<template>
  <div  class="background app">
    <div class="app">
      <Battlefield v-bind:player="player(1)"/>
    </div>
    <div class="app">
    <Battlefield/>
  </div>

  </div>
</template>

<script>
import Battlefield from './components/Battlefield.vue'
export default {
  components: {
    Battlefield
  }
}
</script>

<style>
  div {
    background-size:cover;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: #000000;
  }
  .app {
    display: inline-block;
    padding: 20px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: #000000;
  }
  .background {
    min-width: 1470px;
    min-height: 650px;
    background-image: url('images/Background.jpg');
    background-size:cover;
  }

</style>
