<template>
  <div>
      <span>{{selected.userInfo.name}}</span>
      <button @click="search">Update</button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Content',
  props: [],
  data () {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'selected'
    ])
  },
  methods: {
    search () {
      this.$store.dispatch('search', this.selected.userInfo.name)
    }
  }
}
</script>

<style scoped>
button {
  margin-left: 5px;
}
</style>
