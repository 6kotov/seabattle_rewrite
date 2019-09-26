<template>
  <div class="ship" v-if="isship" >{{colindex}}{{rowindex}}</div>
  <div class="hit" v-else-if="ishit" >{{colindex}}{{rowindex}}</div>
  <div class="disabled" v-else-if="isdisabled" >{{colindex}}{{rowindex}}</div>
  <div v-on:click="ship_mark_emit" v-else>{{colindex}}{{rowindex}}</div>
</template>

<script>
export default {
  name: 'Cell',
props:["rowindex","colindex","battlefield"],
  data: function () {
    return {
      xy: [this.colindex, this.rowindex]
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

     let x = this.xy[0] ,
         y = this.xy[1];

      this.$emit('xy_position', x , y);
     }
  }
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
    width:50px;
    height: 50px;
  }
  .hit  {
    background-color: #ff0000;
    color: #0009a9;
    border: 1px solid black;
  }
  .ship  {
    background-color: #ff0a02;
    color: rgba(6, 0, 107, 0);
    border: 1px solid #9d9d99;
  }
  .disabled  {
    background-color: rgba(47, 83, 126, 0.11);
    color: rgba(93, 255, 253, 0);
    border: 1px solid rgba(253, 255, 6, 0.35);
  }
</style>
