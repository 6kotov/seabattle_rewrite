<template>
  <div>
<Cell @xy_position="coord_emit" :battlefield="battlefield"
      :colindex="colindex" :rowindex="row"  v-for="row in rows" :key="row.id"/>

  </div>
</template>

<script>
  import Cell from './Cell.vue'
export default {
  components:{
      Cell
  },
  props:["colindex","battlefield"],
  data: function () {
    return {
      rows: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    }
  },
  methods: {
    coord_emit (x, y, z) {

      this.$emit('mouse_act', x, y, z);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
