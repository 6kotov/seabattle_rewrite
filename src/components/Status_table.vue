<template>
  <div class="status">
    <div v-if="context.game_status.win">{{context.game_status.winner}}</div>
    <div v-if="context.game_status.ship_placing">Ship placing</div>
    <div v-else-if="context.game_status.player_move">{{context.game_status.player_name}} move</div>
    <div
      v-else-if="context.game_status.enemy_move && !context.game_status.win"
    >{{context.game_status.enemy_name}} move</div>
    <div v-else-if="context.game_status.computer_move">Computer move</div>
    <img class="volume" src="../assets/volume_on.png" v-if="mute" @click="sound_switch" />
    <img class="volume" src="../assets/volume_off.png" v-if="!mute" @click="sound_switch" />
    <button v-if="this.context.field_mode" class="button_red" @click="field_mode_switch">field mode</button>
    <button
      v-if="!this.context.field_mode"
      class="button_green"
      @click="field_mode_switch"
    >field mode</button>
  </div>
</template>

<script>
export default {
  props: ["context", "message", "ship_field_player", "mute"],
  methods: {
    start_game: function(mode) {
      let length = this.ship_field_player.length,
        random = Math.floor(Math.random() * 2),
        status = this.context.game_status;

      if (length < 10) {
        this.$emit("message", "Not enough ships to play!");
      } else if (length === 10 && mode === "single") {
        this.$emit("comp_shot_AI", { loss: true, hit: false });

        if (random === 1) {
          status.ship_placing = false;
          status.player_move = true;
          this.$emit("move_turn_comp", "move_denied");
          this.$emit("move_turn_pl", "move_allow");
        } else {
          status.ship_placing = false;
          status.computer_move = true;
          this.$emit("move_turn_comp", "move_allow");
          this.$emit("move_turn_pl", "move_denied");
          this.$emit("shot_cpu");
        }
      } else if (mode === "multi") {
        status.ship_placing = false;
        status.single_player_mode = false;
        status.multi_player_mode = true;
        this.context.start_game_net();
      }
    },
    sound_switch() {
      this.context.sound = !this.context.sound;
    },
    field_mode_switch() {
      this.context.field_mode = !this.context.field_mode;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  margin: 5px;
}

.volume {
  border: 2px solid #060606;
  border-radius: 10px;
  height: 1.3em;
  float: left;
}
.button_red {
  background-color: tomato;
}
.button_green {
  background-color: yellowgreen;
}
</style>
