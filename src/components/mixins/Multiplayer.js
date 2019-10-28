import api  from '../../api/system_api'


export default {
    props:['context'],
    data: function () {
        return {
            name: "multiplayer",
            receive_data: [],
            send_data:  {
                         status: "",
                         name:"" ,
                         move_turn: "",
                         reply: "",
                         x:"",
                         y:""
                         }
        }
    },
    methods: {
       start_game_net(){
           let send = this.send_data;

           send.status = "waiting"
           send.name = this.game_status.player_name

            const data =  this.send_data,
                  request = setInterval(()=>{this.get_data("START", data) },1000),
                  check  = setInterval(()=>{this.check(request, check)},900);

        },
        get_data (path, obj) {
            api.request_info(data => {
                this.receive_data = data
            },path, obj )
        },
        check (int_1, int_2) {
           let received = this.receive_data;

            if (received.status === "waiting") {
                this.game_status.enemy_name = received.name
                this.send_data.status = "game"
                received.move_turn ? this.player_move() : this.enemy_move()

            } else if (received.status === "game" && received.reply === "miss") {
                this.context.reply_from_enemy = "miss"
                this.context.enemy_reply_res = ""
                this.enemy_move()

            } else if (received.status === "game" && received.reply === "hit") {
                this.context.reply_from_enemy = "hit"
            }else if (received.status === "game" && received.reply.loss) {
                this.context.reply_from_enemy = received.reply
            }else if (received.status === "game" && received === "win") {
                this.context.game_status.win = true
                this.context.game_status.winner =  this.context.game_status.enemy_name + " wins!!!"
            }
        },
        player_move () {
           const result = this.reply_to_enemy,
               x =  this.net_player_shot_coord.x,
               y =  this.net_player_shot_coord.y,
               send = this.send_data;

            this.game_status.enemy_move = false
            this.game_status.player_move = true
            send.move_turn = false
            send.reply = result
            send.x = x
            send.y = y

        },
        enemy_move () {
            this.game_status.enemy_move = true
            this.game_status.player_move = false
            this.send_data.move_turn = true
            this.context.comp_shot_coord = {x: this.receive_data.x, y: this.receive_data.y}
        }

    }

}