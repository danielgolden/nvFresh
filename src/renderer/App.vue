<template>
  <div id="app">
    <!-- <p>{{this.$store.state.Notes}}</p> -->
    <search />

    <button @click="saveAFile">Save A File</button>

    <hr>

    <NoteList />

    <hr>

    <NoteEdit />
  </div>
</template>

<script>
  import LandingPage from '@/components/LandingPage'
  import Search from '@/components/Search'
  import NoteList from '@/components/NoteList'
  import NoteEdit from '@/components/NoteEdit'
  // import { remote } from 'electron'

export default {
    data () {
      return {
        johnson: "I'm johnson"
      }
    },
    name: 'nv-fresh-electron',
    components: {
      LandingPage,
      Search,
      NoteList,
      NoteEdit
    },
    methods: {
      saveAFile: function () {
        // remote.app.setPath('jones.txt', 'userData')
        // console.log(remote.app.getPath('desktop'))
      }
    }
}
</script>

<style>
  /* CSS */
</style>
