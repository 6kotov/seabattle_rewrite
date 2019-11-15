import api  from '../../api/system_api'


export default {
    data () {
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

           send.status = "START"
           send.name = this.game_status.player_name
           setInterval(()=>{this.get_data(send.status, send) },1000);
        },
        get_data (path, obj) {
            api.request_info(data => {
                this.receive_data = data
            },path, obj)
        },
        player_move () {
            this.comp_shot_coord = " "
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
            this.net_player_shot_coord = " "
            this.comp_shot_coord = {x: this.receive_data.x, y: this.receive_data.y}
            this.game_status.enemy_move = true
            this.game_status.player_move = false
            this.send_data.move_turn = true
        }

    },
    watch: {
        receive_data(){
            let received = this.receive_data;
            this.$log.debug("send_data >>>",this.send_data)
            this.$log.debug("receive_data >>>",this.send_data)


            if (received.status === "START") {
                this.game_status.enemy_name = received.name
                this.send_data.status = "RUN"
                received.move_turn ? this.player_move() : this.enemy_move()

            } else if (received.status === "RUN" && received.reply === "miss") {
                this.reply_from_enemy = "miss"
                this.enemy_reply_res = " "
                this.enemy_move()

            }else if (received.status === "RUN" && received.reply === "hit") {
                this.reply_from_enemy = "hit"
            }else if (received.status === "RUN" && received.reply.loss) {
                this.reply_from_enemy = received.reply
            }else if (received.status === "RUN" && received === "win") {
                this.game_status.win = true
                this.game_status.winner =  this.context.game_status.enemy_name + " wins!!!"
            }
        }
    }

}