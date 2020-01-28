import api  from '../../api/system_api'
import CryptoJS from 'crypto-js'
const salt = process.env.SECRET



export default {
    data () {
        return {
            name: "multiPlayer",
            receive_data: {enemy:{x:-1, y:-1}},
            send_data:  {
                 status:"start",
                 name:"" ,
                 enemy_id: '-1',
                 enemy_name:"",
                 move_turn: "",
                 reply:'',
                 x:-1,
                 y:-1
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
                       setInterval(()=>{this.get_data(send.status, send)
                       }, 100)
                   }
                   this.get_data(send.status, send)}, 2000)
        },
        get_data (path, obj) {
            api.request_info(data => {
                this.receive_data = data
            },path, obj)
    },
        crypto(obj, func){
           if(func === 'encrypt') {
               return CryptoJS.AES.encrypt(JSON.stringify(obj), salt)
           } else if (func === 'decrypt') {
               let bytes =  CryptoJS.AES.decrypt(obj.toString(), salt)
               return  JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
           }
        },
        player_move_turn () {
            this.comp_shot_coord = {x:-1, y:-1}
           const send = this.send_data;
            this.game_status.enemy_move = false
            this.game_status.player_move = true
            send.move_turn = false
            this.reply_to_enemy = {
                reply:'',
                loss: false,
                size: -1,
                orient:-1,
                x:-1,
                y:-1,
                x_1:-1,
                y_1:-1
            }
        },
        enemy_move_turn () {

           this.reply_to_enemy = {
               reply:'',
               loss: false,
               size: -1,
               orient:-1,
               x:-1,
               y:-1,
               x_1:-1,
               y_1:-1
           }

            this.game_status.enemy_move = true
            this.game_status.player_move = false
            this.send_data.move_turn = true
        }
    },
    watch: {
        receive_data(){
            let received = this.receive_data;

            this.reply_from_enemy =  this.receive_data.enemy.reply
            this.comp_shot_coord = {x: received.enemy.x , y:received.enemy.y}
            this.send_data.reply = this.reply_to_enemy

            if (received.player.status === "wait") {

                this.send_data.status = "wait"
                this.send_data._id = received.player._id
                this.send_data.enemy_id = received.player.enemy_id
                this.send_data.enemy_name = received.player.enemy_name
                this.game_status.enemy_name = received.player.enemy_name

            } else if(received.player.status === "run" &&  this.send_data.status === "wait" ) {
                this.send_data.enemy_id = received.player.enemy_id
                this.send_data.enemy_name = received.player.enemy_name
                this.game_status.enemy_name = received.player.enemy_name
                this.send_data.status = "run"
                received.player.move_turn ? this.player_move_turn() : this.enemy_move_turn()

            } else if (received.player.status === "run" && received.enemy.reply.reply === "miss") {
                this.enemy_move_turn()
            } else if (received.player.status === "run" && this.send_data.reply.reply === "miss") {
                setTimeout(this.player_move_turn(),200)
            } else if (this.send_data.reply.reply === "win") {
                    this.game_status.winner = this.game_status.enemy_name + " wins!!!"
                    this.game_status.computer_move = false
                    this.game_status.player_move = false
                    this.game_status.win = true
            }
        },
        net_player_shot_coord (){
            this.send_data.x = this.net_player_shot_coord.x
            this.send_data.y = this.net_player_shot_coord.y
        }
    }

}