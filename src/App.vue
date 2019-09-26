<template>
  <div id="app">
<Battlefield/>
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
  #app {
    min-height: 620px;
    min-width:  1450px;
    display: inline-block;
    background-image: url('images/Background.jpg');
    background-size:cover;
    padding: 20px;
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    color: #000000;
  }
</style>
