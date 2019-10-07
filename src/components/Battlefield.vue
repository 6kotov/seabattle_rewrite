<template>
  <div>
<Row @mouse_act="mouse_mark"  :battlefield="battlefield"
     :colindex="column" v-for="column in columns"
     :key="column.id "/>
    <TextInput v-if="context.game_status.ship_placing" @position="shipmark" />

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
        props:[ 'player_shot_XY','comp_shot_XY', 'context'],
        data: function () {
            return {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                battlefield: this.battlefieldmatrix(),
                ship_map: [],
                shot_map: [],
                counter: 0,
                ships_data: [4,3,3,2,2,2,1,1,1,1]
            }
        },
        methods: {
            get_random: function (n) {
                return Math.floor(Math.random() * (n + 1))
            },
            battlefieldmatrix: function () {
                let battlearray = [];
                for (let i = 0; i < 10; i++) {
                    battlearray[i] = [];
                    for (let j = 0; j < 10; j++) {
                        battlearray[i][j] = {
                            ship: false,
                            hit: false,
                            disabled: false,
                            miss: false,
                            invisible: false,
                            explored: false
                        }
                    }
                }
                return battlearray
            },
            shipmark: function (x, y, shipsize, orient, invisible, value1, value2, value3, condition) {
                let coordinates = [];
                if (this.cell_validate(x, y, shipsize, orient, value3)) {
                    if (orient === 0) {
                        let startX = x > 0 ? x - 1 : x;
                        let startY = y > 0 ? y - 1 : y;
                        let stopX = x < 9 ? x + shipsize -1 : x;
                        let stopY = y < 9 ? y + 1 : y;
                        for (let i = startX; i <= stopX; i++) {
                            for (let j = startY; j <= stopY; j++) {
                                this.cellmark(i, j, value1, condition)
                            }
                        }
                        let start = x;
                        let stop = x + shipsize;

                        for (let i = start; i < stop; i++) {
                            if (!invisible) {
                                this.cellmark(i, y, value2, condition)
                                coordinates.push([i, y])
                            } else {
                                this.cellmark(i, y, value2, true)
                                this.cellmark(i, y, "invisible", true)
                                coordinates.push([i, y])
                            }
                        }
                        this.counter ++
                    } else {
                        let startX = x > 0 ? x - 1 : x;
                        let startY = y > 0 ? y - 1 : y;
                        let stopX = x < 9 ? x + 1 : x;
                        let stopY = y < 9 ? y + shipsize -1 : y;
                        for (let i = startX; i <= stopX; i++) {
                            for (let j = startY; j <= stopY; j++) {
                                this.cellmark(i, j, value1, condition);
                            }
                        }
                        let start = y;
                        let stop = y + shipsize;

                        for (let i = start; i < stop; i++) {
                            if (!invisible) {
                                this.cellmark(x, i, value2, condition)
                                coordinates.push([x, i])
                            } else {
                                this.cellmark(x, i, value2, true)
                                this.cellmark(x, i, "invisible", true)
                                coordinates.push([x, i])
                            }

                        }
                        this.counter ++
                    }
                } else {
                    this.$emit('message', "inaccessible coordinates")
                }
                if (value3) {
                    this.ship_map.push(Ship.ShipsX(shipsize, this, coordinates, orient))
                }
            },
            mouse_mark (x, y, z) {
             let index = this.counter,
             ships_left = this.ships_data;

                if (z === 1) {
                    if (this.context.game_status.ship_placing) {
                        if (this.cell_validate(x, y,ships_left[index], 1, true)
                            && this.ship_map.length < 10) {
                            this.shipmark(x, y, ships_left[index], 1, false, "disabled", "ship", true, true)
                        }
                        // else if (this.battlefield[x][y].ship){
                        //     for (let i = 0; i < this.ship_map.length; i++) {
                        //         let pos = this.ship_map[i]
                        //         for (let j = 0; j < pos.positions.length; j++) {
                        //             if (x === pos.positions[j][0] &&
                        //                 y === pos.positions[j][1]) {
                        //                 let x = pos.positions[0][0],
                        //                     y = pos.positions[0][1];
                        //                 this.shipmark(x, y, pos.size, pos.orient, false, "disabled", "ship", false, false)
                        //                 this.ship_map.splice(pos,1)
                        //                 this.counter -= 1
                        //                 for (let i = 0; i < ships_left.length; i++) {
                        //                     if ( ships_left[i] === pos.size ) {
                        //                         ships_left.splice(i,1)
                        //                         ships_left.push(pos.size)
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                        else if (this.battlefield[x][y].disabled){
                            this.$emit('message', "inaccessible coordinates")
                            setTimeout( ()=>{ this.$emit('message', " ")},1000)
                        }
                    }else {
                        this.$emit ('mouse_shot_coordinates', {x: x, y: y} )
                    }
                } else if (z === 0) {
                    if (this.context.game_status.ship_placing) {
                        if (this.cell_validate(x, y, ships_left[index], 0, true)
                            && this.ship_map.length < 10) {
                            this.shipmark(x, y, ships_left[index], 0, false, "disabled", "ship", true, true)
                        }
                        // else if (this.battlefield[x][y].ship){
                        //     for (let i = 0; i < this.ship_map.length; i++) {
                        //         let pos = this.ship_map[i]
                        //         for (let j = 0; j < pos.positions.length; j++) {
                        //             if (x === pos.positions[j][0] &&
                        //                 y === pos.positions[j][1]) {
                        //                 let x = pos.positions[0][0],
                        //                     y = pos.positions[0][1];
                        //                 this.shipmark(x, y, pos.size, pos.orient, false, "disabled", "ship", false, false)
                        //                 this.ship_map.splice(pos,1)
                        //                 this.counter -= 1
                        //                 for (let i = 0; i < ships_left.length; i++) {
                        //                     if ( ships_left[i] === pos.size ) {
                        //                         ships_left.splice(i,1)
                        //                         ships_left.push(pos.size)
                        //                     }
                        //                 }
                        //             }
                        //         }
                        //     }
                        // }
                        else if (this.battlefield[x][y].disabled){
                            this.$emit('message', "inaccessible coordinates")
                            setTimeout( ()=>{ this.$emit('message', " ")},1000)
                        }
                    }
                }
                    this.$emit('ship_field',this.ship_map)

            },
            cellmark: function (x, y, name, condition) {
                Vue.set(this.battlefield[x][y], name, condition);
            },
            randomshipdraw: function (shipsize, invisible) {
                let done = false;
                while (!done) {
                    let orient = this.get_random(1),
                        x,
                        y;

                    if (orient === 0) {
                        x = this.get_random(9 - shipsize);
                        y = this.get_random(9);
                    } else {
                        x = this.get_random(9);
                        y = this.get_random(9 - shipsize);
                    }
                    if (this.cell_validate(x, y, shipsize, orient, true)) {
                         this.shipmark(x, y, shipsize, orient, invisible,"disabled","ship", true, true);
                        done = true;
                    }
                }
                this.$emit('ship_field',this.ship_map)
            },
            X_cell_validate: function (x, y, shipsize, orient) {

                let startX = x,
                    stopX = x + shipsize;
                for (let i = startX; i < stopX; i++) {
                    let cell = orient === 0 ? this.battlefield[i][y] : this.battlefield[y][i];
                    if (stopX > 10 ) {
                        return false
                    } else if (cell.ship || cell.disabled) {
                        return false
                    }
                }
                return true
            },
            cell_validate: function (x, y, shipsize, orient, value3) {
                if(value3 === false){
                    return true
                } else
                    {
                    return orient === 0
                        ? this.X_cell_validate(x, y, shipsize, 0)
                        : this.X_cell_validate(y, x, shipsize, 1)
                }
            },
            // cell_validate: function (x, y, shipsize, orient, value3) {
            //         if(value3 === false){
            //             return true
            //         } else if (orient === 0) {
            //             let startX = x,
            //                 ship_sizeX = shipsize-1,
            //                 stopX = x + ship_sizeX;
            //             for (let i = startX; i < stopX; i++ ) {
            //                 let cell = this.battlefield[i][y]
            //                 console.log(ship_size)
            //                 if (stopX > 9) {
            //                     return false
            //                 } else if (cell.ship || cell.disabled) {
            //                     return false
            //                 }
            //             }
            //             return true
            //         } else if (orient === 1) {
            //             let startY = y,
            //                 ship_size = shipsize-1,
            //                 stopY = y + ship_size;
            //             for (let i = startY; i < stopY; i++ ) {
            //                 let cell = this.battlefield[x][i]
            //                 console.log(ship_size)
            //                 if (stopY > 9) {
            //                     return false
            //                 } else if (cell.ship || cell.disabled) {
            //                     return false
            //                 }
            //             }
            //             return true
            //         }
            //     },
            ship_draw: function (invisible) {
                let ships_count = 5
                let ships_size = 5

                this.battlefield = this.battlefieldmatrix();
                this.ship_map = [];
                for (let i = 1; i < ships_count; i++) {
                    ships_size -= 1
                    for (let j = 0; j < i; j++) {
                        this.randomshipdraw(ships_size, invisible)
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
                                this.shot_map.push([x, y])
                                done = true;
                        }
                    }
            },
            comp_shot () {
                let done = false;
                while (!done) {
                    let x = this.get_random(9),
                        y = this.get_random(9);

                    if (this.shot_validate(x, y)) {
                        this.$emit('comp_shot_coordinates', {x: x, y: y})
                        this.shot_map.push([x, y])
                        done = true;
                    }
                }
            },
            shot_validate: function (x,y) {
                let length = this.shot_map.length;
                for (let i=0; i < length; i++ ) {
                    if (x === this.shot_map[i][0] &&
                        y === this.shot_map[i][1] &&
                      this.battlefield[x][y].explored === true){
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
            }
        },
        watch: {
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
                            this.shipmark(x, y, pos.size, pos.orient, false, "explored", "hit", false, true)
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
                  setTimeout( ()=>{ this.$emit('shot_cpu')},1300)
                  setTimeout( ()=>{ this.move_switch()},1200)
                }
            },
            comp_shot_XY: function () {
                let length = this.ship_map.length,
                    x = this.comp_shot_XY.x,
                    y = this.comp_shot_XY.y,
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
                            this.shipmark(x, y, pos.positions.length, pos.orient, false, "explored", "hit", false, true)

                        }
                    }
                    cell.hit = true
                    cell.ship = false
                    cell.invisible = false
                        if (this.end_game()) {
                            this.context.game_status.winner = "Compukter wins!!!"
                            this.context.game_status.computer_move = false
                            this.context.game_status.player_move = false
                            this.context.game_status.win = true
                            return
                        }
                    this.$emit('message', "Hit!!!")
                    setTimeout( ()=>{  this.$emit('shot_cpu')},1200)
                }
            else
                {
                    cell.disabled = false
                    cell.miss = true
                    this.$emit('message', "Miss...")
                    setTimeout( ()=>{  this.move_switch()},1000)
                }
            }


        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
