<template>
  <div>
<Row class="row" @mouse_act="mouse_mark"  :battlefield="battlefield"
     :colindex="column" v-for="column in columns"
     :key="column.id "/>
    <TextInput @position="input_coordinates_route($event)" :context="context" />

  </div>
</template>

<script>
    import Row from './Row.vue'
    import TextInput from './TextInput.vue'
    import Vue from 'vue'
    import Ship from './Ship.js'

    export default {
        components: {
            Row,
            TextInput
        },
        props:[ 'player_shot_XY','comp_shot_XY', 'context',"comp_shot_AI","explored_cells_prop", "net_player_shot_XY"],
        data: function () {
            return {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                battlefield: this.battlefield_matrix(),
                ship_map: [],
                shot_map: [],
                shot_map_player: [],
                counter: 0,
                ships_data: [4,3,3,2,2,2,1,1,1,1],
                loss: true,
                hit: false,
                comp_loss: "",
                previous_hit:[],
                first_hit:[],
                second_hit:[],
                orient: "0",
                explored_cells:[],
                loss_ship_info:{}
            }
        },
        methods: {
            get_random: function (n) {
                return Math.floor(Math.random() * (n + 1))
            },
            battlefield_matrix: function () {
                let battle_array = [];
                for (let i = 0; i < 10; i++) {
                    battle_array[i] = [];
                    for (let j = 0; j < 10; j++) {
                        battle_array[i][j] = {
                            ship: false,
                            hit: false,
                            disabled: 0,
                            miss: false,
                            invisible: false,
                            explored: false
                        }
                    }
                }
                return battle_array
            },
            input_coordinates_route (event) {
                return this.context.game_status.ship_placing ?
                this.ship_mark(event.x, event.y, event.ship_size,
                    event.orient, false,"disabled", "ship", true, true) :
                    this.$emit('player_shot_coordinates', {x:event.x, y:event.y})

            },
            ship_mark: function (x, y, ship_size, orient, invisible, value1, value2, ship_add, condition, validate, val_1_condition) {
                let coordinates = [];
                if (this.cell_validate(x, y, ship_size, orient, validate)) {

                    let startX = x > 0 ? x - 1 : x;
                    let startY = y > 0 ? y - 1 : y;
                    let stopX = orient === 0 ? Math.min(9, x + ship_size): x < 9 ? x + 1 : x;
                    let stopY =  orient === 0 ? y < 9 ? y + 1 : y : Math.min(9, y + ship_size);
                    for (let i = startX; i <= stopX; i++) {
                        for (let j = startY; j <= stopY; j++) {
                            this.cell_mark(i, j, value1, val_1_condition)
                            if (value1 === "explored"){
                                this.explored_cells.push([i,j])
                            }
                        }
                    }

                    let z = orient === 0 ? x : y
                    let start = z;
                    let stop = z + ship_size;

                    for (let i = start; i < stop; i++) {
                        let a = this.orient_changer(x, y, i, orient).x,
                        b = this.orient_changer(x, y, i, orient).y;

                        if (!invisible) {
                            this.cell_mark(a, b, value2, condition)
                            coordinates.push([a, b])
                        } else {
                            this.cell_mark(a, b, value2, true)
                            this.cell_mark(a, b, "invisible", true)
                            coordinates.push([a, b])
                        }
                    }

                    if (ship_add) {
                        this.ship_map.push(Ship.ShipsX(ship_size, this, coordinates, orient))
                        this.counter ++
                    }
                    if (value1 === "explored") {
                        this.$emit("explored_cells", this.explored_cells)
                        this.explored_cells = []
                    }

                } else {
                    this.$emit('message', "inaccessible coordinates")
                }
            },

            orient_changer (x, y, i, orient) {
                return orient === 0 ? {x:i, y:y} : {x:x, y:i}
            },

            mouse_mark (x, y, z) {
             let index = this.counter,
             ships_left = this.ships_data;

                    if (this.context.game_status.ship_placing) {
                        if (this.cell_validate(x, y,ships_left[index], z, true)
                            && this.ship_map.length < 10) {
                            this.ship_mark(x, y, ships_left[index], z, false, "disabled", "ship", true, true, true, +1)
                        }  else if (this.battlefield[x][y].ship){
                            for (let i = 0; i < this.ship_map.length; i++) {
                                let pos = this.ship_map[i]
                                for (let j = 0; j < pos.positions.length; j++) {
                                    if (x === pos.positions[j][0] &&
                                        y === pos.positions[j][1]) {
                                        let x = pos.positions[0][0],
                                            y = pos.positions[0][1];
                                        this.ship_mark(x, y, pos.size, pos.orient, false, "disabled", "ship", false, false, false,-1)
                                        this.ship_map.splice(i,1)
                                        this.counter -= 1
                                        for (let i = 0; i < ships_left.length; i++) {
                                            if ( ships_left[i] === pos.size ) {
                                                ships_left.splice(i,1)
                                                ships_left.push(pos.size)
                                                break
                                            }
                                        }
                                    }
                                }
                            }
                        } else if (this.battlefield[x][y].disabled){
                            this.$emit('message', "inaccessible coordinates")
                            setTimeout( ()=>{ this.$emit('message', " ")},1000)
                        }
                    } else if ( this.context.game_status.player_move && z === 1) {
                            this.shot_map_player.push([x, y])
                            this.$emit ('mouse_shot_coordinates', {x: x, y: y} )
                    }
                    this.$emit('ship_field',this.ship_map)
            },
            cell_mark: function (x, y, name, condition) {
                if (condition === +1) {
                    this.battlefield[x][y].disabled +=1
                } else if (condition === -1 ) {
                    this.battlefield[x][y].disabled -=1
                } else {
                    Vue.set(this.battlefield[x][y], name, condition);
                }
            },
            random_ship_draw: function (ship_size, invisible) {
                let done = false;
                while (!done) {
                    let orient = this.get_random(1),
                        x,
                        y;

                    if (orient === 0) {
                        x = this.get_random(9 - ship_size);
                        y = this.get_random(9);
                    } else {
                        x = this.get_random(9);
                        y = this.get_random(9 - ship_size);
                    }
                    if (this.cell_validate(x, y, ship_size, orient, true)) {
                         this.ship_mark(x, y, ship_size, orient, invisible,"disabled","ship", true, true, true, +1);
                        done = true;
                    }
                }
                this.$emit('ship_field',this.ship_map)
            },
            x_cell_validate: function (x, y, ship_size, orient) {

                let stopX = x + ship_size;
                for (let i = x; i < stopX; i++) {
                    let cell = orient === 0 ? this.battlefield[i][y] : this.battlefield[y][i];
                    if (stopX > 10 ) {
                        return false
                    } else if (cell.ship || cell.disabled) {
                        return false
                    }
                }
                return true
            },
            cell_validate: function (x, y, ship_size, orient, validate) {
                if(validate === false){
                    return true
                } else
                    {
                    return orient === 0
                        ? this.x_cell_validate(x, y, ship_size, 0)
                        : this.x_cell_validate(y, x, ship_size, 1)
                }
            },
            ship_draw: function (invisible) {
                let ships_count = 5
                let ships_size = 5

                this.battlefield = this.battlefield_matrix();
                this.ship_map = [];
                for (let i = 1; i < ships_count; i++) {
                    ships_size -= 1
                    for (let j = 0; j < i; j++) {
                        this.random_ship_draw(ships_size, invisible)
                    }
                }
                this.$emit('ship_field',this.ship_map)
            },
            player_shot (posX,posY) {
                    let done = false;
                    while (!done) {
                    let x = posX === -1 ? this.get_random(9): posX;
                    let y = posY === -1 ? this.get_random(9): posY;


                        if (this.shot_validate(x, y)) {
                                this.$emit('player_shot_coordinates', {x: x, y: y})
                            this.shot_map_player.push([x, y])
                            this.$log.debug("player_ shot_map!", this.shot_map_player)
                                done = true;
                        }
                    }

            },
            comp_shot () {
                this.hit = this.comp_shot_AI.hit
                this.comp_loss = this.comp_shot_AI.loss

                let x = this.previous_hit[0],
                    y = this.previous_hit[1],
                    hit =  this.hit,
                    hit_1 = this.first_hit,
                    hit_2 = this.second_hit;

                if (! this.comp_loss) {
                    if (this.orient === "0" && hit && hit_2.length === 0) {
                        hit_1.push(x,y)
                        this.second_hit = this.shelling()
                    } else if (this.orient === "0" && !hit) {
                        this.second_hit = this.shelling()
                    } else if (this.orient === "0") {
                        this.orient = this.orient_detector( hit_1[0], hit_1[1], hit_2[0], hit_2[1])
                    }

                    if (this.orient !== "0") { this.aimed_shot(x, y) }

                } else {
                    this.orient = "0"
                    this.first_hit = []
                    this.second_hit = []
                    this.comp_random_shot(-1, -1)
                }
            },

            shelling () {
                let x = this.first_hit[0],
                    y = this.first_hit[1],
                    valid = this.shot_validate,
                    shot = this.comp_random_shot;

                if (valid(x + 1, y)) { shot(x + 1, y); return [x + 1, y] }
                if (valid(x - 1, y)) { shot(x - 1, y); return [x - 1, y] }
                if (valid(x, y + 1)) { shot(x, y + 1); return [x, y + 1] }
                if (valid(x, y - 1)) { shot(x, y - 1); return [x, y - 1] }
            },

            orient_detector (x_1 , y_1 , x_2, y_2) {
                if (x_1 === x_2) { return y_1 < y_2 ? "right" : "left"}
                if (y_1 === y_2) { return x_1 < x_2 ? "down" : "up"}
                return "0"
            },
             aimed_shot(x, y) {
                let valid = this.shot_validate,
                hit = this.hit,
                shot =  this.comp_random_shot,
                orient = this.orient;

                if (hit && orient === "left" && valid(x, y - 1)) {return  shot(x, y - 1) }
                if (hit && orient === "right" && valid(x, y + 1)) {return shot(x, y + 1) }
                if (hit && orient === "down" && valid(x + 1, y)) {return shot(x + 1, y) }
                if (hit && orient === "up" && valid(x - 1, y)) {return shot(x - 1, y) }

                this.orient = "0"
                this.second_hit = this.shelling()
            },

            comp_random_shot (posX, posY,) {
                let done = false;

                while (!done) {
                    let x = posX === -1 ? this.get_random(9) : posX;
                    let y = posY === -1 ? this.get_random(9) : posY;

                    if (this.shot_validate(x, y)) {
                        this.$emit('comp_shot_coordinates', {x: x, y: y})
                        this.shot_map.push([x, y])
                        this.previous_hit = []
                        this.previous_hit.push(x,y)
                        done = true;
                    }
                }
            },

            // comp_shoot_map(){
            //     let map = [2,0,5,7,4,2,2,4,1,7,2,8,3,1,
            //          0,2,8,2,7,1,0,6,3,9,1,3,6,8,6,0,9,
            //          3,3,5,9,7,8,6,6,4,4,6,5,3,7,5,7,9],
            //     coordinate = map.pop();
            //
            //     if (map.length > 0) {return {coordinate:coordinate}}
            //
            // },

            shot_validate: function (x,y) {
                let length = this.shot_map.length;

                for (let i=0; i < length; i++ ) {

                    if (x > 9 || x < 0 || y > 9 || y < 0) {  //rule for computer aiming function
                        return false
                    } else if (x === this.shot_map[i][0] &&
                         y === this.shot_map[i][1]) {
                        return false
                     }
                }
                return true
            },
            move_switch() {
               this.context.game_status.player_move = !this.context.game_status.player_move
               this.context.game_status.computer_move = !this.context.game_status.computer_move
            },
            end_game() {
                for (let i = 0; i < this.ship_map.length; i++) {
                    if (! this.ship_map[i].loss) { return false }
                }
                return true
            },
            is_number : function (value) {
                return (typeof value === 'number')
            }
        },
        watch: {
            explored_cells_prop: function () {
                let exp_cell = this.explored_cells_prop;
                for (let i = 0; i < exp_cell.length; i++){
                    this.shot_map.push(exp_cell[i])
                }
            },
            player_shot_XY: function () {
                    let length = this.ship_map.length,
                        x = this.player_shot_XY.x,
                        y = this.player_shot_XY.y,
                        cell = this.battlefield[x][y];

                    if (cell.ship) {
                        for (let i = 0; i < length; i++) {
                            let pos = this.ship_map[i]

                            for (let j = 0; j < pos.positions.length; j++) {
                                if (x === pos.positions[j][0] &&
                                    y === pos.positions[j][1]) {
                                    pos.damage.push([x, y])
                                }
                            }
                            if (pos.positions.length === pos.damage.length) {
                                pos.loss = true
                                let x = pos.positions[0][0],
                                    y = pos.positions[0][1];
                                this.ship_mark(x, y, pos.size, pos.orient, false, "explored", "hit", false, true, false, true)
                            }
                        }
                        cell.hit = true
                        cell.ship = false
                        cell.invisible = false
                        if (this.end_game()) {
                            this.context.game_status.winner = "Player wins!!!"
                            this.context.game_status.computer_move = false
                            this.context.game_status.player_move = false
                            this.context.game_status.win = true
                            return
                        }
                        this.$emit('message', "Hit!!!")
                    } else {
                        cell.disabled = false
                        cell.miss = true
                        this.$emit('message', "Miss...")
                        setTimeout(() => {
                            this.move_switch()
                        }, 1200)
                        setTimeout(() => {
                            this.$emit('shot_cpu')
                            this.$emit('move_turn_comp', "move_allow")
                            this.$emit('move_turn_pl', "move_denied ")
                        }, 1300)
                    }
            },

            comp_shot_XY: function () {
                if (this.is_number(this.comp_shot_XY.x)) {
                    let length = this.ship_map.length,
                        x = this.comp_shot_XY.x,
                        y = this.comp_shot_XY.y,
                        cell = this.battlefield[x][y],
                        single_mode = this.context.game_status.single_player_mode;


                    if (cell.ship) {
                        this.loss = false
                        cell.hit = true
                        cell.ship = false
                        cell.invisible = false
                        if (single_mode) {
                            this.explored_cells.push([x - 1, y - 1], [x + 1, y + 1], [x - 1, y + 1], [x + 1, y - 1])
                            this.$emit("explored_cells", this.explored_cells)
                        }

                        for (let i = 0; i < length; i++) {
                            let pos = this.ship_map[i]

                            for (let j = 0; j < pos.positions.length; j++) {
                                if (x === pos.positions[j][0] &&
                                    y === pos.positions[j][1]) {
                                    pos.damage.push([x, y])

                                    if (pos.positions.length === pos.damage.length) {
                                        let x = pos.positions[0][0],
                                            y = pos.positions[0][1];
                                        pos.loss = true
                                        this.loss = true
                                        this.ship_mark(x, y, pos.positions.length, pos.orient, false, "explored", "hit", false, true, false, true)
                                        this.loss_ship_info = {
                                            loss: true,
                                            size: pos.positions.length,
                                            orient: pos.orient
                                        }
                                    }
                                }
                            }
                        }
                        if (this.end_game()) {
                            this.context.game_status.winner = this.context.game_status.enemy_name + " wins!!!"
                            this.context.game_status.computer_move = false
                            this.context.game_status.player_move = false
                            this.context.game_status.win = true
                            if (!single_mode) {
                                return this.$emit('reply', "win")
                            }
                        } else {
                            if (single_mode) {
                                this.$emit('comp_shot_AI', {loss: this.loss, hit: true})
                                setTimeout(() => {
                                    this.$emit('shot_cpu')
                                }, 1000)
                            } else {
                                this.loss ? this.$emit('reply', this.loss_ship_info) : this.$emit('reply', "hit")
                            }

                        }
                    } else {
                        cell.disabled = false
                        cell.miss = true

                        if (single_mode) {
                            this.$emit('message', "Miss...")
                            this.$emit('comp_shot_AI', {loss: this.loss, hit: false})
                            setTimeout(() => {
                                this.move_switch()
                                this.$emit('move_turn_comp', "move_denied")
                                this.$emit('move_turn_pl', "move_allow")
                            }, 1000)
                        } else {
                            this.$emit('reply', "miss")
                        }
                    }
                }
            },
            net_player_shot_XY () {
                if (this.is_number(this.net_player_shot_XY.x)) {
                    let reply = this.context.reply_from_enemy,
                        x = this.net_player_shot_XY.x,
                        y = this.net_player_shot_XY.y,
                        cell = this.battlefield[x][y];
                     this.$log.debug("net_player_shot_XY", this.context.reply_from_enemy, this.net_player_shot_XY.x, this.net_player_shot_XY.y)
                    if (reply === "hit") {

                        cell.hit = true
                        cell.ship = false
                        cell.invisible = false
                        this.$emit('message', "Hit!")

                    } else if (reply === "miss") {
                        cell.disabled = false
                        cell.miss = true
                        this.$emit('message', "Miss...")

                    } else if (reply.loss) {
                        cell.hit = true
                        cell.ship = false
                        cell.invisible = false
                        this.ship_mark(x, y, reply.size, reply.orient, false, "explored", "hit", false, true, false, true)
                        this.$emit('message', "Loss!!!")
                    }
                }
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.row {
    display: inline-grid;
}
</style>
