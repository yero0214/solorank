<template>
  <div id="home">
    <Search/>
    <List/>
    <Content/>
  </div>
</template>

<script>
// @ is an alias to /src
import Search from '@/components/Search.vue'
import Content from '@/components/Content.vue'
import List from '@/components/List.vue'

export default {
  name: 'Home',
  components: {
    Search,
    Content,
    List
  },
  created () {
    this.$store.commit('setSaved')
  },
  computed: {
  }
}
</script>

<style scoped>
</style>
