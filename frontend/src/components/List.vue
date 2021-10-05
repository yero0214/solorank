<template>
  <div id="list">
    <ul>
        <li v-for="user in userList" :key="user.userName">
          <span @click="setSelected(user.userName)">{{user.userInfo.name}}</span>
          <span @click="remove(user.userName)">X</span>
        </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'List',
  props: [],
  data () {
    return {
    }
  },
  computed: {
    userList () {
      return this.$store.state.userList
    }
  },
  methods: {
    setSelected (name) {
      this.$store.commit('setSelected', name)
    },
    remove (name) {
      this.$store.commit('remove', name)
    }

  }
}
</script>

<style scoped>
span {
    margin-right: 5px;
}
ul {
    display:inline-block;
}
li {
    float:left;
}
</style>
