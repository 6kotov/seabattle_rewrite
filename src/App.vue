<template>
  <div  class="background">

    <div class="Battlefield">
     <b>--Compukter --</b>  <Battlefield ref="battle" @battlefield_cpu="battlefield_cpu"
                                         @enemy_shipfield_cpu="fieldemit_cpu"
                                         @message="message_emit($event)"
                                         :context="game_condition()"
                                         :ship_field="ship_field"
                                         :battlearea="battlearea"/>
    </div>
    <div class="Status_table" > <Status_table ref="status" :context="game_condition()"
                                              :message="message"
                                              @message="message_emit($event)"/>
      <button v-if="game_status.ship_placing" @click="$refs.status.start_game() &
                                                      $refs.battle.ship_draw(true) ">
                                                      Start game </button>
      <button v-if="game_status.ship_placing" @click="$refs.battle_cpu.ship_draw(false)">Random</button>
    </div>
    <div class="Battlefield_cpu">
      <b>--  Player 1 --</b> <Battlefield ref="battle_cpu" @battlefield="battlefield"
                                          @enemy_shipfield="fieldemit"
                                          @message="message_emit($event)"
                                          @shot_cpu="$refs.battle.random_shot_cpu()"
                                          @mouse_shot="$refs.battle_cpu.random_shot()"
                                          :context="game_condition()"
                                          :ship_field_cpu="ship_field_cpu"
                                          :battlearea_cpu="battlearea_cpu"/>
      <button @click="$refs.battle_cpu.random_shot(-1,-1)" >-Random shot-</button>


  </div>

  </div>
</template>

<script>
import Battlefield from './components/Battlefield.vue'
import Game_status from './components/mixins/Game_status.js'
import Status_table from './components/Status_table.vue'

export default {
  components: {
    Battlefield,
    Status_table
  },
  mixins:[Game_status],
  data: function(){
    return {
      ship_field:"",
      ship_field_cpu:"",
      battlearea:"",
      battlearea_cpu:"",
      message:""
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
    },
    game_condition() {
      return this
    },
    message_emit(event) {
      this.message = event
      setTimeout(this.timeout, 1000)
    },
    timeout(){
      this.message = ""
    }
  }
}
</script>

<style>
  .Status_table {
    font-family: CricketLight, monospace;
    font-size: 20px;
    color: #fff602;
    border: solid #060606;
    background-color: darkcyan;
    padding: 5px;
    height: 100px;
    width: 200px;
    text-align: center;
    display: inline-table;
  }

  button {
    margin: 3px;
    font-family: CricketLight,monospace;
    font-size:20px;
    border: #060606 solid;
  }
  b {
    font-family: CricketLight,monospace;
   font-size:20px;
    color: #fff602;
    border: solid #060606;
    display: inline-table;
    margin-bottom: 10px;
    background-color: darkcyan;
    padding: 2px;
  }
  .Battlefield_cpu {
    margin-left: 10px;
    display: inline-table;
    padding: 20px;
    text-align: center;
  }
  .Battlefield {
    margin-left: 50px;
    display: inline-table;
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
