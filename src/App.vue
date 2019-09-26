<template>
  <div  class="background">
    <div class="app">
     <b>-- Player 1 --</b>  <Battlefield @enemy_shipfield2="fieldemit2" :ship_field="ship_field" />
    </div>
    <div class="app">
      <b>-- Player2 --</b> <Battlefield @enemy_shipfield="fieldemit" :ship_field2="ship_field2" />
  </div>

  </div>
</template>

<script>
import Battlefield from './components/Battlefield.vue'
export default {
  components: {
    Battlefield
  },
  data: function(){
    return {
      ship_field:"",
      ship_field2:""
    }
  },
  methods: {
    fieldemit: function (event) {
      this.ship_field = event
    },
    fieldemit2: function (event) {
      this.ship_field2 = event
    }
  }
}
</script>

<style>
  button {
    margin: 3px;
    font-family: Bankir-Retro,sans-serif;
    font-size:20px;
  }
  b {
    font-family: Bankir-Retro,sans-serif;
   font-size:20px;
    color: #fff602;
    border: solid #060606;
    display: inline-block;
    margin-bottom: 10px;
    background-color: darkcyan;
    padding: 2px;
  }
  .app {
    margin-left: 100px;
    display: inline-block;
    padding: 20px;
    text-align: center;
  }
  .background {
    min-width: 1470px;
    min-height: 700px;
    background-image: url('images/Background.jpg');
    background-size:cover;
  }

</style>
