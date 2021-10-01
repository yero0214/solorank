<template>
  <div class="Search">
    <input type="text" v-model="name" @keyup.enter="search">
    <button @click="search">Search</button>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
  },
  data () {
    return {
      name: '',
      data: []
    }
  },
  methods: {
    search () {
      this.$store.dispatch('search', this.name)
      this.name = ''
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
button {
  margin-left: 5px;
}
</style>
