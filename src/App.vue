<template>
  <div  class="background">

    <div class="Battlefield">
     <b>--Compukter --</b>  <Battlefield ref="battle"
                                         @comp_shot_coordinates="comp_shot_coordinates"
                                         @mouse_shot_coordinates="player_shot_coordinates($event)"
                                         @message="message_emit($event)"
                                         @shot_cpu="$refs.battle.comp_shot()"
                                         :context="game_condition()"
                                         :player_shot_XY="player_shot_coord"
                                         :explored_cells_prop="explored_cells"
                                         :comp_shot_AI="comp_shot_AI"/>
    </div>
    <div class="Status_table" > <Status_table ref="status" :context="game_condition()"
                                              :message="message"
                                              @message="message_emit($event)"
                                              @shot_cpu="$refs.battle. comp_random_shot(-1, -1)"
                                              @comp_shot_AI="comp_shot_AI_emit($event)"
                                              :ship_field_player="ship_field_player"/>
      <button v-if="game_status.ship_placing" @click="$refs.battle.ship_draw(true) &
                                                      $refs.status.start_game()">
                                                      Start game </button>
      <button v-if="game_status.ship_placing" @click="$refs.battle_cpu.ship_draw(false)">Random</button>
    </div>
    <div class="Battlefield_cpu">
      <b>--  Player 1 --</b> <Battlefield ref="battle_cpu"
                                          @player_shot_coordinates="player_shot_coordinates($event)"
                                          @ship_field="ship_field($event)"
                                          @message="message_emit($event)"
                                          @comp_shot_AI="comp_shot_AI_emit($event)"
                                          @shot_cpu="$refs.battle.comp_shot()"
                                          @explored_cells="explored_cells_emit($event)"
                                          :context="game_condition()"
                                          :comp_shot_XY="comp_shot_coord"/>
      <button @click="$refs.battle_cpu.player_shot(-1,-1)" >-Random shot-</button>


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
      player_shot_coord:"",
      comp_shot_coord:"",
      message:"",
      ship_field_player:"",
      comp_shot_AI:"",
      explored_cells:""
    }
  },
  methods: {
    player_shot_coordinates: function (event) {
      this.player_shot_coord = event
    },
    comp_shot_coordinates: function (event) {
      this.comp_shot_coord = event
    },
    game_condition() {
      return this
    },
    message_emit(event) {
      this.message = event
      setTimeout( ()=>{ this.message = " " },1000)
    },
    ship_field(event){
      this.ship_field_player = event
    },
    comp_shot_AI_emit(event){
      this.comp_shot_AI = event
    },
    explored_cells_emit(event){
      this.explored_cells = event

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
