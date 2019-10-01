<template>

  <div v-on:click="coordinates_emit" class="invisible_ship" v-if="isship_invisible" >{{colindex}}{{rowindex}}</div>
  <div v-on:click="coordinates_emit" class="ship" v-else-if="isship" >{{colindex}}{{rowindex}}</div>
  <div class="hit" v-else-if="ishit" >{{colindex}}{{rowindex}}</div>
  <div class="miss" v-else-if="ismiss" >{{colindex}}{{rowindex}}</div>
  <div v-on:click="coordinates_emit" class="disabled" v-else-if="isdisabled" >{{colindex}}{{rowindex}}</div>
  <div v-on:click="coordinates_emit" v-else>{{colindex}}{{rowindex}}</div>
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
      return this.battlefield[this.colindex][this.rowindex].disabled
    },
    ismiss: function () {
      return this.battlefield[this.colindex][this.rowindex].miss
    }
  },
  methods:{
    coordinates_emit: function () {

     let x = this.x ,
         y = this.y;

      this.$emit('xy_position', x , y);
     }
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  div {
    font-size:14px;
    background-color: rgba(93, 255, 253, 0.21);
    color: rgba(1, 0, 55, 0);
    border: 1px solid black;
    display:inline-block;
    position:relative;
    padding:2px;
    width:40px;
    height: 40px;
  }
  .ship  {
    background-color: #315358;
    color: rgba(211, 228, 255, 0);
    border: 1px solid #e58700;
  }
  .invisible_ship {
    background-color: rgba(93, 255, 253, 0.21);
    color: rgba(1, 0, 55, 0);
  }
  .disabled  {
    background-color: rgba(93, 255, 253, 0.2);
    color: rgba(93, 255, 253, 0);
    border: 1px solid rgb(0, 0, 0);
  }
  .hit  {
    background-color: #ff0000;
    color: rgba(0, 9, 169, 0);
    border: 1px solid black;
  }
  .miss  {
    background-color: rgb(157, 117, 0);
    color: rgba(93, 255, 253, 0);
    border: 1px solid rgb(0, 0, 0);
  }
</style>
