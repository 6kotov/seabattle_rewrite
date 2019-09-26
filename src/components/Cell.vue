<template>
  <div v-on:click="ship_mark_emit" class="ship" v-if="isship" >{{colindex}}{{rowindex}}</div>
  <div v-on:click="ship_mark_emit" class="hit" v-else-if="ishit" >{{colindex}}{{rowindex}}</div>
  <div v-on:click="ship_mark_emit" class="disabled" v-else-if="isdisabled" >{{colindex}}{{rowindex}}</div>
  <div v-on:click="ship_mark_emit" v-else>{{colindex}}{{rowindex}}</div>
</template>

<script>
export default {
  name: 'Cell',
props:["rowindex","colindex","battlefield"],
  data: function () {
    return {
      x: this.colindex,
      y: this.rowindex
    }
  },
  computed:{
    isship: function () {
      return this.battlefield[this.colindex][this.rowindex].ship
    },
    ishit: function () {
      return this.battlefield[this.colindex][this.rowindex].hit
    },
    isdisabled: function () {
      return this.battlefield[this.colindex][this.rowindex].disabled
    }
  },
  methods:{
    ship_mark_emit: function () {

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
    color: rgba(1, 0, 55, 0.66);
    border: 1px solid black;
    display:inline-block;
    position:relative;
    padding:2px;
    width:40px;
    height: 40px;
  }
  .hit  {
    background-color: #ff0000;
    color: #0009a9;
    border: 1px solid black;
  }
  .ship  {
    background-color: #315358;
    color: rgba(211, 228, 255, 0.85);
    border: 1px solid #00ff00;
  }
  .disabled  {
    background-color: rgba(93, 255, 253, 0.2);
    color: rgba(93, 255, 253, 0);
    border: 1px solid rgb(0, 0, 0);
  }
</style>
