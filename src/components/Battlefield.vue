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
                shot_map: []
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
                            explored_cell: false

                        }
                    }
                }
                return battlearray
            },
            shipmark: function (x, y, shipsize, orient, invisible) {
                let coordinates = [];
                if (this.cell_validate(x, y, shipsize, orient)) {
                    if (orient === 0) {
                        let startX = x > 0 ? x - 1 : x;
                        let startY = y > 0 ? y - 1 : y;
                        let stopX = x < 9 ? x + shipsize : x;
                        let stopY = y < 9 ? y + 1 : y;
                        for (let i = startX; i <= stopX; i++) {
                            for (let j = startY; j <= stopY; j++) {
                                this.cellmark(i, j, "disabled", true)
                            }
                        }
                        let start = x;
                        let stop = x + shipsize;

                        for (let i = start; i < stop; i++) {
                            if (!invisible) {
                                this.cellmark(i, y, "ship", true)
                            } else {
                                this.cellmark(i, y, "ship", true)
                                this.cellmark(i, y, "invisible", true)
                                coordinates.push([i, y])
                            }
                        }
                    } else {
                        let startX = x > 0 ? x - 1 : x;
                        let startY = y > 0 ? y - 1 : y;
                        let stopX = x < 9 ? x + 1 : x;
                        let stopY = y < 9 ? y + shipsize : y;
                        for (let i = startX; i <= stopX; i++) {
                            for (let j = startY; j <= stopY; j++) {
                                this.cellmark(i, j, "disabled", true);
                            }
                        }
                        let start = y;
                        let stop = y + shipsize;

                        for (let i = start; i < stop; i++) {
                            if (!invisible) {
                                this.cellmark(x, i, "ship", true)
                            } else {
                                this.cellmark(x, i, "ship", true)
                                this.cellmark(x, i, "invisible", true)
                                coordinates.push([x, i])
                            }

                        }
                    }
                } else {
                    alert("inaccessible coordinates")
                }
                return coordinates
            },
            mouse_mark (x, y, z) {
                if (z === 1) {
                    if (this.context.game_status.ship_placing) {
                        let counter = 1
                        if (this.cell_validate(x, y, counter, 0)
                            && this.context.ship_field.length < 10) {
                            this.shipmark(x, y, counter, 0)
                        } else {
                            this.$emit('message', "inaccessible coordinates")
                        }
                    } else {
                        this.$emit ('mouse_shot_coordinates', {x: x, y: y} )
                    }
                } else if (z === 0) {
                   console.log("it wirks, Azirov!")
                }
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
                    if (this.cell_validate(x, y, shipsize, orient)) {
                        let positions = this.shipmark(x, y, shipsize, orient, invisible);
                        done = true;
                        return positions
                    }
                }
            },
            X_cell_validate: function (x, y, shipsize, orient) {

                let startX = x,
                    stopX = x + shipsize;

                for (let i = startX; i < stopX; i++) {
                    let cell = orient === 0 ? this.battlefield[i][y] : this.battlefield[y][i];
                    if (cell.ship || cell.disabled) {
                        return false
                    }
                }
                return true
            },
            cell_validate: function (x, y, shipsize, orient) {
                return orient === 0
                    ? this.X_cell_validate(x, y, shipsize, 0)
                    : this.X_cell_validate(y, x, shipsize, 1)
            },
            ship_draw: function (invisible) {
                let ships_count = 5
                let ships_size = 5

                this.battlefield = this.battlefieldmatrix();
                this.ship_map = [];
                for (let i = 1; i < ships_count; i++) {
                    ships_size -= 1
                    for (let j = 0; j < i; j++) {
                        let result = this.randomshipdraw(ships_size, invisible)
                        this.ship_map.push(Ship.ShipsX(ships_size, this, result))
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
                        y === this.shot_map[i][1]){
                        return false
                    }
                }
                return true
            },
            move_switch() {
               this.context.game_status.player_move = !this.context.game_status.player_move
               this.context.game_status.computer_move = !this.context.game_status.computer_move
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
                        }
                    }
                    cell.hit = true
                    cell.ship = false
                    cell.invisible = false
                    this.$emit('message', "Hit!!!")
                } else {
                    cell.disabled = false
                    cell.miss = true
                    this.$emit('message', "Miss...")
                  setTimeout( ()=>{ this.$emit('shot_cpu')},1000)
                  setTimeout( ()=>{ this.move_switch()},1000)
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
                        }
                    }
                    cell.hit = true
                    cell.ship = false
                    cell.invisible = false
                    setTimeout( ()=>{  this.$emit('message', "Hit!!!")},1000)
                    setTimeout( ()=>{  this.$emit('shot_cpu')},1000)
                }
            else
                {
                    cell.disabled = false
                    cell.miss = true
                    setTimeout( ()=>{ this.$emit('message', "Miss...")},1000)
                    setTimeout( ()=>{  this.move_switch()},1000)
                }
            }

        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
