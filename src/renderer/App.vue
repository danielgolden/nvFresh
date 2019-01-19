<template>
  <div id="app">
    <!-- <p>{{this.$store.state.Notes}}</p> -->
    <search />

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
    }
}
</script>

<style>
  /* CSS */
</style>
