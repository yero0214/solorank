<template>
  <div id="app">
    <!-- <div id="nav">
      <router-link to="/">Home</router-link>
    </div> -->
    <router-view/>
  </div>
</template>

<script>
export default {
}
</script>

<style>
ul {
    list-style-type: none;
}
#search {
  position: fixed;
}
#list {
  position: fixed;
  top: 25px;
}
#info {
  position: fixed;
  top: 100px;
}
#content {
  position: relative;
}
#matchList {
  position: absolute;
  left: 300px;
  top: 0px;
}
</style>
