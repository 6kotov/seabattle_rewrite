<template>
  <div>
  <div  v-if="context.game_status.ship_placing" >Ship placing <br>{{message}} <br>
  </div>

  <div v-else-if="context.game_status.player_move" >Player move <br>{{message}} </div>
  <div  v-else-if="context.game_status.computer_move" >Computer move</div>
  <div  v-else-if="context.game_status.win" >{{context.game_status.winner}} wins!!!</div>
  </div>
</template>

<script>
export default {
  props:['context','message'],
  data: function () {
    return {
    }
  },
  methods: {
    start_game: function () {
      if (this.context.ship_field.length === 10){
      this.context.game_status.ship_placing = false
      this.context.game_status.player_move = true
      } else {
        this.$emit('message', "No ships - no battle!")
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
