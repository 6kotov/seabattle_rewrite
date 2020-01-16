import api  from '../../api/system_api'
import App from "../../App";


export default {
    data () {
        return {
            name: "multiplayer",
            receive_data: {},
            send_data:  {
                         status:"start",
                         name:"" ,
                         enemy_id: '-1',
                         enemy_name:"",
                         move_turn: "",
                         reply: "",
                         x:"",
                         y:""
                         }
        }
    },
    methods: {
       start_game_net(){
           let send =  this.send_data;
           send.status = "start"
           send.name =this.game_status.player_name
           this.get_data(send.status, send)

               const waitInterval = setInterval(()=>{
                   if(this.receive_data.player.status === "run") {
                       clearInterval(waitInterval)
                       // setInterval(()=>{this.get_data(send.status, send) }, 1000)
                   }
                   this.get_data(send.status, send)}, 2000)
        },
        get_data (path, obj) {
            api.request_info(data => {
                this.receive_data = data
                this.$log.debug("receive_data >>>",  this.receive_data)
            },path, obj)
        },
        player_move () {
            App.data().comp_shot_coord = " "
           const result = this.reply_to_enemy,
               x =    App.data().net_player_shot_coord.x,
               y =   App.data().net_player_shot_coord.y,
               send = this.send_data ;
            this.game_status.enemy_move = false
            this.game_status.player_move = true
            send.move_turn = false
            send.reply = result
            send.x = x
            send.y = y
        },
        enemy_move () {
            App.data().net_player_shot_coord = " "
            App.data().comp_shot_coord = {x: this.receive_data.x, y: this.receive_data.y}
            this.game_status.enemy_move = true
            this.game_status.player_move = false
            this.send_data.move_turn = true
        }

    },
    watch: {
        receive_data(){
            let received = this.receive_data;
            this.$log.debug("send_data >>>",this.send_data)
            this.$log.debug("receive_data >>>", received)


            if (received.status === "start") {
                this.send_data._id = received._id
                this.send_data.status = "wait"
            } else if(received.status === "wait" && received.enemy_id !=='-1') {
                this.game_status.enemy_name = received.enemy_name
                this.send_data.status = "run"
                received.move_turn ? this.player_move() : this.enemy_move()

            } else if (received.status === "run" && received.reply === "miss") {
                this.reply_from_enemy = "miss"
                this.enemy_reply_res = " "
                this.enemy_move()

            }else if (received.status === "run" && received.reply === "hit") {
                this.reply_from_enemy = "hit"
            }else if (received.status === "run" && received.reply.loss) {
                this.reply_from_enemy = received.reply
            }else if (received.status === "run" && received.reply === "win") {
                this.game_status.win = true
                this.game_status.winner =  this.context.game_status.enemy_name + " wins!!!"
            }
        }
    }

}