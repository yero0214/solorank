import Vue from 'vue'
import Vuex from 'vuex'

import axios from 'axios'

Vue.use(Vuex)

const uri = 'http://localhost:99/call'
const yero0214 = 'RGAPI-431d1c01-2509-4c95-a436-7bd90bb368bd'
const haga4214 = 'RGAPI-a09201f6-7e0f-4898-9986-cca8202e8268'

const func = {
  setCookie (name, value, type, time) {
    var todayDate = new Date()
    if (type === 'seconds') {
      todayDate.setSeconds(todayDate.getSeconds() + time)
    } else if (type === 'Hours') {
      todayDate.setHours(todayDate.getHours + time)
    } else if (type === 'max') {
      todayDate.setTime(todayDate.getTime + 365 * 24 * 60 * 60 * 1000)
    }
    document.cookie = name.toUpperCase() + '=' + escape(value.toUpperCase()) + '; path=/; expires=' + todayDate.toGMTString() + ';'
  },
  getCookie (name) {
    var search = name + '='
    if (document.cookie.length > 0) {
      let offset = document.cookie.indexOf(search)
      if (offset !== -1) {
        offset += search.length
        let end = document.cookie.indexOf(';', offset)
        if (end === -1) end = document.cookie.length
        return unescape(document.cookie.substring(offset, end))
      }
    }
  }
}

export default new Vuex.Store({
  state: {
    userList: [],
    selected: ''
  },
  getters: {
    selected (state) {
      let result = {}
      state.userList.forEach(e => {
        if (e.userName === state.selected) {
          result = e
        }
      })
      return result
    }
  },
  mutations: {
    setSaved (state) {
      const list = func.getCookie('saved').split('/')
      console.log(list)
      list.forEach(e => {
        if (e !== '') {
          state.userList.push({
            userName: e,
            userInfo: {
              name: e
            },
            tierInfo: {},
            matchList: []
          })
        }
      })
    },
    setSelected (state, payload) {
      state.selected = payload
    },
    remove (state, payload) {
      state.userList.forEach((e, i, o) => {
        if (e.userName === payload) {
          o.splice(i, 1)
        }
      })
      let string = ''
      state.userList.forEach(e => {
        string += e.userInfo.name + '/'
      })
      func.setCookie('saved', string, 'max')
    },
    setUserInfo (state, payload) {
      let found = false
      state.userList.forEach(e => {
        if (e.userName === payload.name) {
          e.userInfo = payload.data
          e.userName = payload.name
          found = true
        }
      })
      if (!found) {
        state.userList.push({
          userName: payload.name,
          userInfo: payload.data,
          tierInfo: {},
          matchList: []
        })
      }
    },
    setTierInfo (state, payload) {
      state.userList.forEach(e => {
        if (e.userName === payload.name) {
          e.tierInfo = payload.data
        }
      })
    },
    setMatchList (state, payload) {
      state.userList.forEach(e => {
        if (e.userName === payload.name) {
          e.matchList.push({
            matchId: payload.matchId,
            matchInfo: {},
            matchTimeline: {}
          })
        }
      })
    },
    // queueId list url: http://static.developer.riotgames.com/docs/lol/queues.json
    // queueId:
    //   420 = solo
    //   440 = flex
    setMatchInfo (state, payload) {
      state.userList.forEach(e => {
        if (e.userName === payload.name) {
          e.matchList.forEach(f => {
            if (f.matchId === payload.matchId) {
              f.matchInfo = payload.data
            }
          })
        }
      })
    },
    setMatchTimeline (state, payload) {
      state.userList.forEach(e => {
        if (e.userName === payload.name) {
          e.matchList.forEach(f => {
            if (f.matchId === payload.matchId) {
              f.matchTimeline = payload.data
            }
          })
        }
      })
    }
  },
  actions: {
    search ({ dispatch, commit, state }, name) {
      if (func.getCookie(name.toUpperCase()) === name.toUpperCase()) {
        alert(`You have to wait x seconds to renew ${name}`)
        return
      }
      dispatch('getUserInfo', name)
      func.setCookie(name, name, 'seconds', 30)
    },
    getUserInfo ({ commit, state }, name) {
      axios
        .get(uri, {
          params: {
            uri: `https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}`,
            token: yero0214
          }
        })
        .then(response => {
          commit('setUserInfo', { name: response.data.name, data: response.data })
          commit('setSelected', response.data.name)
          this.dispatch('getTierInfo', { name: response.data.name, id: response.data.id })
          this.dispatch('getMatchIdList', response.data.name)
          let string = ''
          state.userList.forEach(e => {
            string += e.userInfo.name + '/'
          })
          func.setCookie('saved', string, 'max')
        })
        .catch(error => {
          console.log(error)
        })
    },
    getTierInfo ({ commit }, payload) {
      axios
        .get(uri, {
          params: {
            uri: `https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/${payload.id}`,
            token: yero0214
          }
        })
        .then(response => {
          commit('setTierInfo', { name: payload.name, data: response.data })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getMatchIdList ({ commit, state }, name) {
      state.userList.forEach(e => {
        if (e.userName === name) {
          e.matchList = []
          axios
            .get(uri, {
              params: {
                uri: `https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/${e.userInfo.puuid}/ids?type=ranked&start=0&count=5`,
                token: yero0214
              }
            })
            .then(response => {
              response.data.forEach(matchId => {
                commit('setMatchList', { name: name, matchId: matchId })
                this.dispatch('getMatchInfo', { name: name, matchId: matchId })
                this.dispatch('getMatchTimeline', { name: name, matchId: matchId })
              })
            })
            .catch(error => {
              commit('remove', name)
              console.log(error)
            })
        }
      })
    },
    getMatchInfo ({ commit }, payload) {
      axios
        .get(uri, {
          params: {
            uri: `https://asia.api.riotgames.com/lol/match/v5/matches/${payload.matchId}`,
            token: haga4214
          }
        })
        .then(response => {
          commit('setMatchInfo', { name: payload.name, matchId: payload.matchId, data: response.data })
        })
        .catch(error => {
          console.log(error)
        })
    },
    getMatchTimeline ({ commit }, payload) {
      axios
        .get(uri, {
          params: {
            uri: `https://asia.api.riotgames.com/lol/match/v5/matches/${payload.matchId}/timeline`,
            token: haga4214
          }
        })
        .then(response => {
          commit('setMatchTimeline', { name: payload.name, matchId: payload.matchId, data: response.data })
        })
        .catch(error => {
          console.log(error)
        })
    }
  },
  modules: {
  }
})
