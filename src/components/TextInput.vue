<template>
  <div>
    <input type="text" @input="TextValidation"  v-model="coordinates" placeholder="Type your shoot">
  </div>
</template>

<script>
export default {
  data: function () {
    return {
      coordinates: ""
    }
  },
  methods: {
    TextValidation: function () {
       let re = /((\d?),(\d{1}),([1-4]),([0-1]))/;
       let string = this.coordinates;
       let rez = string.match(re);
       let x = parseInt(rez[2]),
        y = parseInt(rez[3]),
        shipsize = parseInt(rez[4]),
        orient = parseInt(rez[5]);

      this.$emit('position', x , y, shipsize, orient);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    div {
        margin: 5px;
    }
</style>
