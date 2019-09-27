<template>
  <div  class="background">

    <div class="app">
     <b>-- Player 1 --</b>  <Battlefield ref="battle" @battlefield_cpu="battlefield_cpu" @enemy_shipfield_cpu="fieldemit_cpu"
                                         :ship_field="ship_field" :battlearea="battlearea" />
      <button @click="$refs.battle.random_shot()" >-Shot-</button>

    </div>
    <div class="app">
      <b>-- Compukter --</b> <Battlefield ref="battle_cpu" @battlefield="battlefield" @enemy_shipfield="fieldemit"
                                        :ship_field_cpu="ship_field_cpu" :battlearea_cpu="battlearea_cpu"/>
      <button @click="$refs.battle_cpu.random_shot_cpu()" >-Shot-</button>
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
      ship_field_cpu:"",
      battlearea:"",
      battlearea_cpu:""
    }
  },
  methods: {
    fieldemit: function (event) {
      this.ship_field = event
    },
    fieldemit_cpu: function (event) {
      this.ship_field_cpu = event
    },
    battlefield: function (event) {
      this.battlearea = event
    },
    battlefield_cpu: function (event) {
      this.battlearea_cpu = event
    }
  }
}
</script>

<style>
  button {
    margin: 3px;
    font-family: CricketLight,monospace;
    font-size:20px;
  }
  b {
    font-family: CricketLight,monospace;
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
