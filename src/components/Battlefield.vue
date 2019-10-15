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
        props:[ 'player_shot_XY','comp_shot_XY', 'context',"comp_shot_AI","explored_cells_prop"],
        data: function () {
            return {
                columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
                battlefield: this.battlefieldmatrix(),
                ship_map: [],
                shot_map: [],
                counter: 0,
                ships_data: [4,3,3,2,2,2,1,1,1,1],
                loss: true,
                hit: false,
                comp_loss: "",
                previous_hit:[3,5],
                first_hit:[],
                second_hit:[],
                orient: 0,
                explored_cells:[]
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
                            disabled: 0,
                            miss: false,
                            invisible: false,
                            explored: false
                        }
                    }
                }
                return battlearray
            },
            shipmark: function (x, y, shipsize, orient, invisible, value1, value2, ship_add, condition, validate, val_1_condition) {
                let coordinates = [];
                if (this.cell_validate(x, y, shipsize, orient, validate)) {
                    if (orient === 0) {
                        let startX = x > 0 ? x - 1 : x;
                        let startY = y > 0 ? y - 1 : y;
                        let stopX = Math.min(9, x + shipsize);
                        let stopY = y < 9 ? y + 1 : y;
                        for (let i = startX; i <= stopX; i++) {
                            for (let j = startY; j <= stopY; j++) {
                                this.cellmark(i, j, value1, val_1_condition)
                                if (value1 === "explored"){
                                    this.explored_cells.push([i,j])
                                }
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
                    } else {
                        let startX = x > 0 ? x - 1 : x;
                        let startY = y > 0 ? y - 1 : y;
                        let stopX = x < 9 ? x + 1 : x;
                        let stopY = Math.min(9, y + shipsize)
                        for (let i = startX; i <= stopX; i++) {
                            for (let j = startY; j <= stopY; j++) {
                                this.cellmark(i, j, value1, val_1_condition)
                                if (value1 === "explored") {
                                    this.explored_cells.push([i,j])
                                }
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
                    }
                    if (ship_add) {
                        this.ship_map.push(Ship.ShipsX(shipsize, this, coordinates, orient))
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
            mouse_mark (x, y, z) {
             let index = this.counter,
             ships_left = this.ships_data;

                if (z === 1) {
                    if (this.context.game_status.ship_placing) {
                        if (this.cell_validate(x, y,ships_left[index], 1, true)
                            && this.ship_map.length < 10) {
                            this.shipmark(x, y, ships_left[index], 1, false, "disabled", "ship", true, true, true, +1)
                        }  else if (this.battlefield[x][y].ship){
                            for (let i = 0; i < this.ship_map.length; i++) {
                                let pos = this.ship_map[i]
                                for (let j = 0; j < pos.positions.length; j++) {
                                    if (x === pos.positions[j][0] &&
                                        y === pos.positions[j][1]) {
                                        let x = pos.positions[0][0],
                                            y = pos.positions[0][1];
                                        this.shipmark(x, y, pos.size, pos.orient, false, "disabled", "ship", false, false, false,-1)
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
                    }else if (this.context.game_status.player_move) {
                        this.$emit ('mouse_shot_coordinates', {x: x, y: y} )
                    }
                } else if (z === 0) {
                    if (this.context.game_status.ship_placing) {
                        if (this.cell_validate(x, y, ships_left[index], 0, true)
                            && this.ship_map.length < 10) {
                            this.shipmark(x, y, ships_left[index], 0, false, "disabled", "ship", true, true, true, +1)
                        } else if (this.battlefield[x][y].ship){
                            for (let i = 0; i < this.ship_map.length; i++) {
                                let pos = this.ship_map[i]
                                for (let j = 0; j < pos.positions.length; j++) {
                                    if (x === pos.positions[j][0] &&
                                        y === pos.positions[j][1]) {
                                        let x = pos.positions[0][0],
                                            y = pos.positions[0][1];
                                        this.shipmark(x, y, pos.size, pos.orient, false, "disabled", "ship", false, false, false, -1)
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
                    }
                }
                    this.$emit('ship_field',this.ship_map)
            },
            cellmark: function (x, y, name, condition) {
                if (condition === +1) {
                    this.battlefield[x][y].disabled +=1
                } else if (condition === -1 ) {
                    this.battlefield[x][y].disabled -=1
                } else {
                    Vue.set(this.battlefield[x][y], name, condition);
                }
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
                         this.shipmark(x, y, shipsize, orient, invisible,"disabled","ship", true, true, true, +1);
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
            cell_validate: function (x, y, shipsize, orient, validate) {
                if(validate === false){
                    return true
                } else
                    {
                    return orient === 0
                        ? this.X_cell_validate(x, y, shipsize, 0)
                        : this.X_cell_validate(y, x, shipsize, 1)
                }
            },
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
                this.hit = this.comp_shot_AI.hit
                this.comp_loss = this.comp_shot_AI.loss

                let orient = this.orient,
                    x = this.previous_hit[0],
                    y = this.previous_hit[1],
                    hit =  this.hit,
                    hit_1 = this.first_hit,
                    hit_2 = this.second_hit,
                    valid = this.shot_validate;


                console.log("X= ", x , "Y= ", y)
                console.log("Props", "HIT: ", this.comp_shot_AI.hit,"LOSS:",this.comp_shot_AI.loss )

                if (! this.comp_loss) {

                    if (orient === 0 && hit && hit_2.length === 0) {
                        hit_1.push(x,y)
                        console.log("AIMING..." ,"hit_1",hit_1)
                        if (valid(hit_1[0] + 1, hit_1[1])) {
                            this.comp_random_shot(hit_1[0] + 1, hit_1[1])
                            hit_2.push(hit_1[0] + 1, hit_1[1])
                            console.log("1>>down")
                        } else if (valid(hit_1[0] - 1, hit_1[1])) {
                            this.comp_random_shot(hit_1[0] - 1, hit_1[1])
                            hit_2.push(hit_1[0] - 1, hit_1[1])
                            console.log("1>>up")
                        } else if (valid(hit_1[0], hit_1[1] + 1)) {
                            this.comp_random_shot(hit_1[0], hit_1[1] + 1)
                            hit_2.push(hit_1[0], hit_1[1] + 1)
                            console.log("1>>right")
                        } else if (valid(hit_1[0] , hit_1[1] - 1)) {
                            this.comp_random_shot(hit_1[0], hit_1[1] - 1)
                            hit_2.push(hit_1[0], hit_1[1] - 1)
                            console.log("1>>left")
                        }

                    } else if(orient === 0 && !hit) {
                            hit_2 = this.orient_detection(hit_1)
                    } else if (orient === 0) {
                        console.log("orient detection", "x",x,"y",y)
                        console.log("hit_1:", hit_1,"hit_2:",hit_2)

                        if (hit_1[0] === hit_2[0] && hit_1[1] > hit_2[1])
                        {
                            orient = -1
                            console.log("orient right ")
                        } else if (hit_1[0] === hit_2[0] && hit_1[1] < hit_2[1]) {
                            orient = +1
                            console.log("orient left ")
                        } else if (hit_1[0] < hit_2[0] &&hit_1[1] === hit_2[1]) {
                            orient = -2
                            console.log("orient down")
                        } else if (hit_1[0] > hit_2[0] && hit_1[1] === hit_2[1]) {
                            orient = +2
                            console.log("orient up")
                        }

                    }

                    if (orient === +1 && hit && valid(hit_2[0], hit_2[1] - 1)) {
                            this.comp_random_shot(hit_2[0], hit_2[1] - 1)
                        } else if (orient === -1 && hit && valid(hit_2[0], hit_2[1] + 1)) {
                            this.comp_random_shot(hit_2[0], hit_2[1] + 1)
                        }else if (orient === -2 && hit && hit && valid(hit_2[0] + 1,hit_2[1])) {
                            this.comp_random_shot(hit_2[0] + 1,hit_2[1])
                        }else if (orient === +2 && hit && valid(hit_2[0] - 1, hit_2[1])) {
                            this.comp_random_shot(hit_2[0] - 1, hit_2[1])
                        } else {
                            orient = 0
                        hit_2 = this.orient_detection(hit_1)
                        }

                } else {
                    orient = 0
                    this.first_hit = []
                    this.second_hit = []
                    this.comp_random_shot(-1, -1)
                }
            },
            orient_detection (hit_1) {
                let hit_2 = []
                console.log("MISS... AIMING...hit_1:", hit_1)
                if (this.shot_validate(hit_1[0] - 1, hit_1[1])) {
                    this.comp_random_shot(hit_1[0] - 1, hit_1[1])
                    hit_2.push(hit_1[0] - 1, hit_1[1])
                    console.log("2 ^up^")
                    return hit_2
                } else if (this.shot_validate(hit_1[0], hit_1[1] + 1)) {
                    this.comp_random_shot(hit_1[0], hit_1[1] + 1)
                    hit_2.push(hit_1[0], hit_1[1] + 1)
                    console.log("2>>right")
                    return hit_2
                } else if (this.shot_validate(hit_1[0] , hit_1[1] - 1)) {
                    this.comp_random_shot(hit_1[0], hit_1[1] - 1)
                    hit_2.push(hit_1[0], hit_1[1] - 1)
                    console.log("left<<2")
                    return hit_2
                }
            },
            comp_random_shot (posX, posY) {
                let done = false;
                while (!done) {
                    let x = posX === -1 ? this.get_random(9): posX;
                    let y = posY === -1 ? this.get_random(9): posY;

                    if (this.shot_validate(x, y)) {
                        this.$emit('comp_shot_coordinates', {x: x, y: y})
                        this.shot_map.push([x, y])
                        this.previous_hit = []
                        this.previous_hit.push(x,y)
                        done = true;
                    }
                }
            },
            shot_validate: function (x,y) {
                let length = this.shot_map.length;

                console.log("Validating>>", x , y)
                console.log("SHoT MAp>>",this.shot_map )

                for (let i=0; i < length; i++ ) {

                    if (x > 9 || x < 0 || y > 9 || y < 0) {  //rule for computer aiming function
                        console.log("SHOT DENIED! x||y >||< 0!!!")
                        return false
                    } else if (x === this.shot_map[i][0] &&
                         y === this.shot_map[i][1]) {
                        console.log("SHOT DENIED!")
                        return false
                     }
                }
                console.log("SHoT allow!")
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
            explored_cells_prop: function () {
                let exsp_cell = this.explored_cells_prop;
                for (let i = 0; i < exsp_cell.length; i++){
                    this.shot_map.push(exsp_cell[i])
                }
                console.log("WOW WOW", this.shot_map ,"WOW!!!!")
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
                            this.shipmark(x, y, pos.size, pos.orient, false, "explored", "hit", false, true, false, true)
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
                        setTimeout( ()=>{ this.move_switch()},1200)
                        setTimeout( ()=>{ this.$emit('shot_cpu')},1300)
                        }
                },

            comp_shot_XY: function () {
                let length = this.ship_map.length,
                    x = this.comp_shot_XY.x,
                    y = this.comp_shot_XY.y,
                    cell = this.battlefield[x][y];

                    if (cell.ship) {
                        this.loss = false
                        console.log("LOSS FALSE!!!", this.loss)
                        cell.hit = true
                        cell.ship = false
                        cell.invisible = false
                        this.$emit('message', "Hit!!!")


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
                                    console.log("LOSSTRUE!!!", this.loss)
                                    console.log("posit", pos.positions.length, "damage",pos.damage.length)
                                    this.shipmark(x, y, pos.positions.length, pos.orient, false, "explored", "hit", false, true, false, true)
                                }
                            }
                        }

                    }
                        if (this.end_game()) {
                            this.context.game_status.winner = "Compukter wins!!!"
                            this.context.game_status.computer_move = false
                            this.context.game_status.player_move = false
                            this.context.game_status.win = true
                        } else {

                            this.$emit('comp_shot_AI',  {loss: this.loss, hit: true})
                            setTimeout(() => {this.$emit('shot_cpu')}, 2000)

                        }
                } else {
                    cell.disabled = false
                    cell.miss = true
                    this.$emit('message', "Miss...")
                    this.$emit('comp_shot_AI',  {loss: this.loss, hit: false})
                    setTimeout( ()=>{  this.move_switch()},1000)
                }
            }
        }
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
