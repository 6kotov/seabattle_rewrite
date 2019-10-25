import api  from '../../api/system_api'


export default {
    props:['context'],
    data: function () {
        return {
            name: "multiplayer",
            receive_data: [],
            send_data:  {
                         status: "game",
                         name:" " ,
                         move_turn: " ",
                         reply: " ",
                         x:[],
                         y:[]
                         }
        }
    },
    methods: {
       start_game_net(){
           let send = this.send_data;

           send.status = "waiting"
           send.name = this.game_status.player_name

            const data =  this.send_data,
                  request = setInterval(()=>{this.get_info("START", data) },1000),
                  check  = setInterval(()=>{this.check(request, check)},900);

        },
        game_run(){
           let status = this.game_status,
           recieved = this.receive_data;

            if (recieved.status === "waiting"){
                return recieved.move_turn ? status.player_move = true : status.enemy_move = true
            } else if (recieved.status === "game") {
                return recieved.move_turn ? this.player_move : this.enemy_move
            }

        },
        get_info (path, obj) {
            api.request_info(data => {
                this.receive_data = data
            },path, obj )
        },
        check (int_1, int_2) {
           let recieve = this.receive_data;
            if (recieve.status === "waiting") {
               clearInterval(int_1)
               clearInterval(int_2)
                this.game_status.enemy_name = recieve.name
                this.game_run()
            } else if (recieve.status === "game" && recieve.reply === "miss" && recieve.move_turn) {
                  clearInterval(int_1)
                  clearInterval(int_2)
                this.enemy_reply_res = -1
                this.enemy_move()

            } else if (recieve.status === "game" && recieve.reply === "hit") {

            }
        },
        player_move () {
           let result = this.enemy_reply_res,
               x =  this.net_player_shot_coord.x,
               y =  this.net_player_shot_coord.y,
               send = this.send_data;
            send.status = "game"
            send.move_turn = false
            send.reply = result
            send.x = x
            send.y = y

            const data =  this.send_data,
                request = setInterval(()=>{this.get_info("GAME", data) },1000),
                check  = setInterval(()=>{this.check(request, check)},900);

        },
        enemy_move () {
           let send = this.send_data;
            send.move_turn = true
            const data =  this.send_data,
                request = setInterval(()=>{this.get_info("GAME", data) },1000),
                check  = setInterval(()=>{this.check(request, check)},900);

            this.comp_shot_coord = {x: this.receive_data.x, y: this.receive_data.y}


        }

    }

}