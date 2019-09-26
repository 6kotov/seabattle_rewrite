export default {
        ShipsX: function (size, bridge, result) {
                return {
                    bridge: bridge,
                    size: size,
                    positions: result,
                    damage: [],
                    add_posionion: function (x, y) {
                        if (this.positions.length < this.size) {
                            this.positions.push(x, y)
                            this.bridge.cellmark(x, y)
                        } else {
                            console.log("ERROR")
                        }
                    },
                    add_posionions: function (x, y,size , direction) {
                        for (let i = 0; i<size; i++ ) {
                            this.add_posionion(x, y)
                        }
                    }

                }

            }

    }
