export default {
        ShipsX: function (size, bridge, result) {
                return {
                    bridge: bridge,
                    size: size,
                    positions: result,
                    damage: [],
                    loss: false
                    }

                },
        // computed: {
        //     isloss: function () {
        //         return damage.length === positions.length
        //     }
        //
        //
        // }


    }