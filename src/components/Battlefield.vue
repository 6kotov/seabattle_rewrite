<template>
  <div>
<Row @mouse_ship_draw="mouse_ship_mark" :battlefield="battlefield" :colindex="column" v-for="column in columns"
     :key="column.id "/>
    <TextInput @position="shipmark" />
      <button @click="ship_draw" >-Draw-</button>
      <button @click="random_shot" >-Shot-</button>
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
        props:['ship_field', 'ship_field2'],
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
                            disabled: false
                        }
                    }
                }
                return battlearray
            },
            shipmark: function (x, y, shipsize, orient) {
                let coordinates = [];
                if (this.cell_validate(x, y, shipsize, orient)) {
                    if (orient === 0) {
                        let startX = x > 0 ? x - 1 : x;
                        let startY = y > 0 ? y - 1 : y;
                        let stopX = x < 9 ? x + shipsize : x;
                        let stopY = y < 9 ? y + 1 : y;
                        for (let i = startX; i <= stopX; i++) {
                            for (let j = startY; j <= stopY; j++) {
                                this.cellmark(i, j, "disabled", true);

                            }
                        }
                        let start = x;
                        let stop = x + shipsize;

                        for (let i = start; i < stop; i++) {
                            this.cellmark(i, y, "ship", true)
                            coordinates.push([i, y])
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
                            this.cellmark(x, i, "ship", true)
                            coordinates.push([x, i])

                        }
                    }
                } else {
                    alert("inaccessible coordinates")
                }
                return coordinates
            },
            mouse_ship_mark: function (x, y, shipsize, orient) {
                if (this.cell_validate(x, y, shipsize, orient)) {
                    this.cellmark(x, y, "ship", true)
                    console.log(this.ship_field , this.ship_field2)
                } else {
                    alert("inaccessible coordinates")
                    console.log(this.ship_field , this.ship_field2)
                }
            },
            cellmark: function (x, y, name, condition) {
                Vue.set(this.battlefield[x][y], name, condition);
            },
            randomshipdraw: function (shipsize) {
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
                        let positions = this.shipmark(x, y, shipsize, orient);
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
            ship_draw: function () {
                let ships_count = 5
                let ships_size = 5
                for (let i = 1; i < ships_count; i++) {
                    ships_size -= 1
                    for (let j = 0; j < i; j++) {
                        let result = this.randomshipdraw(ships_size)
                        this.ship_map.push(Ship.ShipsX(ships_size, this, result))
                    }
                }
                console.log(this.ship_map)
                this.$emit('enemy_shipfield', this.ship_map)
                this.$emit('enemy_shipfield2', this.ship_map)

            },
            random_shot: function () {
                let done = false;
                while (!done) {
                      let  x = this.get_random(9),
                       y = this.get_random(9),
                       cell =  this.battlefield[x][y];

                    if (this.shot_validate(x, y)) {
                        if (cell.ship) {
                            cell.hit = true
                            alert("Hit!!!")

                        } else {
                            alert("MISS")
                        }
                        this.shot_map.push([x,y])
                        done = true;
                    }
                }
            },
            shot_validate: function (x,y) {
                let length = this.shot_map.length;
                for (let i=0; i < length; i++ ) {
                    return [x, y] !== this.shot_map[i];
                }
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
