import api  from '../../api/system_api'


export default {
    props:['context'],
    data() {
        return {
            name: "multiplayer",
            whole_data: [],
            game_start: false
        }
    },
    methods: {
        start_game_net(){

            while (!this.game_start) {
                setTimeout(this.get_info,1000)
                    if (this.whole_data.status === "waiting") {
                        this.game_start = true
                        this.game_run()
                    }
            }
        },
        game_run(){
            this.$log.debug("game_run" ,this.whole_data.status)
        },
        get_info () {
            api.load_game_info(data => {
                this.whole_data = data
                this.$log.debug("INITIAL DATA", this.whole_data)
            }, "START")
        }

    }
}