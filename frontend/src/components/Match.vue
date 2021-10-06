<template>
  <div class="match">{{player.championName}}</div>
</template>

<script>
export default {
  name: 'Match',
  components: {
  },
  props: ['data', 'name'],
  data () {
    return {
    }
  },
  computed: {
    player () {
      let result
      this.data.matchInfo.info.participants.forEach(e => {
        if (e.summonerName === this.name) {
          result = e
        }
      })
      return result
    }
  },
  methods: {
  }
}
</script>

<style scoped>
.match{
  width: 500px;
  height: 100px;
  background-color: rgb(255, 255, 255);
  margin: 10px;
}
</style>
