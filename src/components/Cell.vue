<template>

  <div v-on:click.left="coordinates_emit(1)" v-on:click.right.prevent="coordinates_emit(0)"
       class="invisible_ship" v-if="isship_invisible" ></div>

  <div v-on:click.left="coordinates_emit(1)"  v-on:click.right.prevent="coordinates_emit(0)"
       class="ship" v-else-if="isship" ></div>

  <div class="hit" v-else-if="ishit" ></div>

  <div   v-on:click.right="coordinates_emit(0)" class="explored"
         v-else-if="isexplored" ></div>

  <div class="miss" v-else-if="ismiss" ></div>

  <div v-on:click.left="coordinates_emit(1)"  v-on:click.right.prevent="coordinates_emit(0)"
       class="disabled" v-else-if="isdisabled" ></div>

  <div v-on:click.left="coordinates_emit(1)"  v-on:click.right.prevent="coordinates_emit(0)"
       v-else></div>

</template>

<script>
export default {
  name: 'Cell',
props:["rowindex","colindex","battlefield"],
  data: function () {
    return {
      x: this.colindex,
      y: this.rowindex,
    }
  },
  computed:{
    isship: function () {
      return this.battlefield[this.colindex][this.rowindex].ship
    },
    isship_invisible: function () {
      return this.battlefield[this.colindex][this.rowindex].invisible
    },
    ishit: function () {
      return this.battlefield[this.colindex][this.rowindex].hit
    },
    isdisabled: function () {
      return this.battlefield[this.colindex][this.rowindex].disabled > 0
    },
    ismiss: function () {
      return this.battlefield[this.colindex][this.rowindex].miss
    },
    isexplored: function () {
      return this.battlefield[this.colindex][this.rowindex].explored
    }
  },
  methods:{
    coordinates_emit: function (z) {

     let x = this.x ,
         y = this.y;

      this.$emit('xy_position', x , y, z);
     }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    background-color: rgba(93, 255, 253, 0.21);
    border: 1px solid #24284d;
    width:40px;
    height:40px;
  }
  .ship  {
    background-color: rgba(49, 83, 88, 0.67);
  }
  .invisible_ship {
    background-color: rgba(93, 255, 253, 0.2);
  }
  .disabled  {
    background-color: rgba(93, 255, 253, 0.2);

  }
  .hit  {
    background-color: #ff0000;
  }
  .miss  {
    background-color: rgb(157, 117, 0);
  }
  .explored  {
    background-color: rgb(10, 13, 103);
  }
</style>
