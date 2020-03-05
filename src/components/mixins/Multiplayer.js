import api from "../../api/system_api";

export default {
  data() {
    return {
      name: "multiPlayer",
      receive_data: { enemy: { x: -1, y: -1 } },
      send_data: {
        status: "start",
        name: "",
        enemy_id: "-1",
        enemy_name: "",
        move_turn: "",
        reply: "",
        x: -1,
        y: -1
      },
      runInterval: false,
      waitInterval: false
    };
  },
  methods: {
    start_game_net() {
      let send = this.send_data;
      send.status = "start";
      send.name = this.game_status.player_name;
      this.get_data(send.status, send);

      this.waitInterval = setInterval(() => {
        if (this.receive_data.player.status === "run") {
          clearInterval(this.waitInterval);
          this.runInterval = setInterval(() => {
            this.get_data(send.status, send);
          }, 300);
        }
        this.get_data(send.status, send);
      }, 2000);
    },
    get_data(path, obj) {
      api.request_info(
        data => {
          this.receive_data = data;
        },
        path,
        obj
      );
    },
    player_move_turn() {
      this.comp_shot_coord = { x: -1, y: -1 };
      const send = this.send_data;
      this.game_status.enemy_move = false;
      this.game_status.player_move = true;
      send.move_turn = false;
      this.reply_to_enemy = {
        reply: "",
        loss: false,
        size: -1,
        orient: -1,
        x: -1,
        y: -1,
        x_1: -1,
        y_1: -1
      };
    },
    enemy_move_turn() {
      this.reply_to_enemy = {
        reply: "",
        loss: false,
        size: -1,
        orient: -1,
        x: -1,
        y: -1,
        x_1: -1,
        y_1: -1
      };
      this.game_status.enemy_move = true;
      this.game_status.player_move = false;
      this.send_data.move_turn = true;
    }
  },
  watch: {
    receive_data() {
      let received = this.receive_data,
        status = this.game_status;

      this.reply_from_enemy = this.receive_data.enemy.reply;
      this.comp_shot_coord = { x: received.enemy.x, y: received.enemy.y };
      this.send_data.reply = this.reply_to_enemy;

      if (received.player.status === "wait") {
        this.send_data.status = "wait";
        this.send_data._id = received.player._id;
        this.send_data.enemy_id = received.player.enemy_id;
        this.send_data.enemy_name = received.player.enemy_name;
        this.game_status.enemy_name = received.player.enemy_name;
      } else if (
        received.player.status === "run" &&
        this.send_data.status === "wait"
      ) {
        this.send_data.enemy_id = received.player.enemy_id;
        this.send_data.enemy_name = received.player.enemy_name;
        this.game_status.enemy_name = received.player.enemy_name;
        this.send_data.status = "run";
        received.player.move_turn
          ? this.player_move_turn()
          : this.enemy_move_turn();
      } else if (
        received.player.status === "run" &&
        received.enemy.reply.reply === "miss"
      ) {
        this.enemy_move_turn();
      } else if (
        received.player.status === "run" &&
        this.send_data.reply.reply === "miss"
      ) {
        setTimeout(this.player_move_turn(), 400);
      } else if (
        this.send_data.reply.reply === "win" ||
        received.enemy.reply.reply === "win"
      ) {
        setTimeout(() => {
          clearInterval(this.runInterval);
          this.send_data.status = "exit";
          this.get_data(this.send_data.status, this.send_data);
        }, 1000);
        status.move_turn = false;
        status.computer_move = false;
        status.player_move = false;
        status.win = true;
        if (this.send_data.reply.reply === "win") {
          status.winner = status.enemy_name + " wins!!!";
        } else {
          if (received.enemy.name === "Enemy capitulated! You win!") {
            status.winner = "Enemy capitulated! You win!";
            return;
          }
          status.winner = status.player_name + " wins!!!";
        }
      }
    },
    net_player_shot_coord() {
      this.send_data.x = this.net_player_shot_coord.x;
      this.send_data.y = this.net_player_shot_coord.y;
    }
  }
};
