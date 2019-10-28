export default {
    data: function () {
        return {
            game_status : {
                name_enter: true,
                ship_placing: false,
                single_player_mode:true,
                multi_player_mode: false,
                player_move: false,
                computer_move: false,
                enemy_move:false,
                win: false,
                winner:"",
                player_name:"Kot",
                enemy_name: "Computer"
            }
        }
    }
}
