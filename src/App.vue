<template>
  <div  class="background">

    <div class="Battlefield">
     <b>--{{game_status.enemy_name}} --</b>  <Battlefield ref="enemy"  :class = "move_turn_pl"
                                         @comp_shot_coordinates="comp_shot_coordinates"
                                         @mouse_shot_coordinates="player_shot_coordinates($event)"
                                         @message="message_emit($event)"
                                         @shot_cpu="$refs.enemy.comp_shot()"
                                         @move_turn_pl="move_turn_pl_emit($event)"
                                         @move_turn_comp="move_turn_comp_emit($event)"
                                         :context="game_condition()"
                                         :player_shot_XY="player_shot_coord"
                                         :explored_cells_prop="explored_cells"
                                         :net_player_shot_XY="reply_from_enemy"
                                         :comp_shot_AI="comp_shot_AI"/>
    </div>

    <div class="Status_table" > <Status_table ref="status" :context="game_condition()"
                                              :message="message"
                                              @message="message_emit($event)"
                                              @shot_cpu="$refs.enemy.comp_random_shot(-1, -1)"
                                              @comp_shot_AI="comp_shot_AI_emit($event)"
                                              @move_turn_pl="move_turn_pl_emit($event)"
                                              @move_turn_comp="move_turn_comp_emit($event)"
                                              :ship_field_player="ship_field_player"/>

      <button v-if="game_status.ship_placing" @click="$refs.player.ship_draw(false)">
        Random placing</button>

      <button v-if="game_status.ship_placing" @click="$refs.status.start_game('single')
                                                      &$refs.enemy.ship_draw(true)">
                                                      Start singleplayer </button>

      <button v-if="game_status.ship_placing" @click="$refs.status.start_game('multi')">
                                                      Start multiplayer </button>

    </div>

      <div class="name" v-if="game_status.name_enter">
         <label for="textarea">Enter your name</label>
              <textarea id="textarea" cols="20" rows="1"
                        v-model="game_status.player_name">
              </textarea>
         <button  @click="name_enter" >Ok</button>

      </div>

    <div class="Battlefield_cpu" >
      <b>-- {{game_status.player_name}} --</b> <Battlefield ref="player" :class = "move_turn_comp"
                                          @player_shot_coordinates="player_shot_coordinates($event)"
                                          @ship_field="ship_field($event)"
                                          @message="message_emit($event)"
                                          @comp_shot_AI="comp_shot_AI_emit($event)"
                                          @shot_cpu="$refs.enemy.comp_shot()"
                                          @explored_cells="explored_cells_emit($event)"
                                          @move_turn_pl="move_turn_pl_emit($event)"
                                          @move_turn_comp="move_turn_comp_emit($event)"
                                          @reply="enemy_reply($event)"
                                          :context="game_condition()"
                                          :comp_shot_XY="comp_shot_coord"/>

      <button @click="$refs.player.player_shot(-1,-1)" >-Random shot-</button>

  </div>

  </div>
</template>

<script>
import Vue from 'vue'
import Battlefield from './components/Battlefield.vue'
import Game_status from './components/mixins/Game_status.js'
import Status_table from './components/Status_table.vue'
import Multiplayer from './components/mixins/Multiplayer.js'
import VueLogger from 'vuejs-logger';


const options = {
  isEnabled: true,
  logLevel : 'debug',
  stringifyArguments : false,
  showLogLevel : false,
  showMethodName : false,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueLogger, options);

export default {
  components: {
    Battlefield,
    Status_table,

  },
  mixins:[Game_status, Multiplayer],
  data: function(){
    return {
      player_shot_coord:"",
      net_player_shot_coord:"",
      comp_shot_coord:"",
      message:"",
      ship_field_player:"",
      comp_shot_AI:"",
      reply_to_enemy:"",
      reply_from_enemy:"",
      explored_cells:"",
      move_turn_comp: "move_denied",
      move_turn_pl: "move_denied"
    }
  },
  methods: {
    player_shot_coordinates: function (event) {
       return this.game_status.single_player_mode ? this.player_shot_coord = event
           : this.net_player_shot_coord = event
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
    },
    move_turn_comp_emit(event){
      this.move_turn_comp = event
    },
    move_turn_pl_emit(event){
      this.move_turn_pl = event
    },
    name_enter() {
        this.game_status.name_enter = false;
        this.game_status.ship_placing = true
    },
    enemy_reply(event){
        this.reply_to_enemy = event
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
    display: inline-table;
  }
  .move_allow {
    border: solid 10px rgba(28, 222, 114, 0.7);
  }
  .move_denied {
    border: solid 10px rgb(133, 134, 133);
  }
  .name {
      position: fixed;
      z-index: 10000;
      margin-top: 10px;
      margin-left: 10px;
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
</style>
