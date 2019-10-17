<template>
  <div>
  <div  v-if="context.game_status.ship_placing" >Ship placing <br>{{message}} <br> </div>
  <div v-else-if="context.game_status.player_move" >Player move <br>{{message}} </div>
  <div  v-else-if="context.game_status.computer_move" >Computer move  <br>{{message}}</div>
  <div  v-else-if="context.game_status.win" >{{context.game_status.winner}} </div>
  </div>
</template>

<script>
export default {
  props:['context','message','ship_field_player'],
  data: function () {
    return {
    }
  },
  methods: {
    start_game: function () {
      let random = Math.floor(Math.random() * 2)
      if (this.ship_field_player.length === 10 &&  random === 1 ){
      this.context.game_status.ship_placing = false
      this.context.game_status.player_move = true
        this.$emit('comp_shot_AI', {loss: true, hit: false} )
        this.$emit('move_turn_comp', "move_denied" )
        this.$emit('move_turn_pl', "move_allow" )

      } else if (this.ship_field_player.length === 10){
        this.context.game_status.ship_placing = false
        this.context.game_status.computer_move = true
        this.$emit('comp_shot_AI', true)
        this.$emit('move_turn_comp', "move_allow" )
        this.$emit('move_turn_pl', "move_denied" )
        this.$emit('shot_cpu')
      } else if (this.ship_field_player.length < 10 &&
              this.ship_field_player.length > 0) {
        this.$emit('message', "Not enough ships to play!")
      } else {
        this.$emit('message', "Cant play without ships!")
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    div {
        margin: 5px;
    }
</style>
