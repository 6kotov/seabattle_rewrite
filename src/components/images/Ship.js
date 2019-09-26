export default {
        Ships: function () {
            function Ship(size, bridge) {
                return {
                    bridge: bridge,
                    size: size,
                    positions: [],
                    damage: [],
                    add_posionion: function (x, y) {
                        if (this.positions.length < this.size) {
                            this.positions.push(x, y)
                            this.bridge.cellmark(x, y)
                        } else {
                            console.log("ERROR")
                        }
                    },
                    // add_posionions: function (x, y, direction) {
                    //     for (let i = ) {
                    //         this.add_posionion(x, y)
                    //     }
                    // }

                }

            }
        }
    }
