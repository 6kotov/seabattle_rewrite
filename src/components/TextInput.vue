<template>
  <div>
    <input
      type="text"
      aria-rowcount="15"
      @keyup.enter="TextValidation"
      v-model="coordinates"
      placeholder="enter coordinates and press enter"
    />
  </div>
</template>

<script>
export default {
  props: ["context"],
  data: function() {
    return {
      coordinates: ""
    };
  },
  methods: {
    TextValidation: function() {
      let ship_placing = this.context.game_status.ship_placing;
      let re = ship_placing
        ? /(([abcdefghij]?),(\d{1}),([1-4]),([0-1]))/
        : /(([abcdefghij]?),(\d{1}))/;
      let rez = this.coordinates.match(re);
      let f_c = rez[2],
        x = parseInt(rez[3]) - 1,
        ship_size = parseInt(rez[4]),
        orient = parseInt(rez[5]);

      let y = {
        a: 0,
        b: 1,
        c: 2,
        d: 3,
        e: 4,
        f: 5,
        g: 6,
        h: 7,
        i: 8,
        j: 9
      }[f_c];

      //add RegExp length & explored_cell validation
      ship_placing
        ? this.$emit("position", {
            x: x,
            y: y,
            ship_size: ship_size,
            orient: orient
          })
        : this.$emit("position", { x: x, y: y });

      this.coordinates = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  margin: 5px;
}
</style>
