<template>
  <div id="app">
    <search @newNoteSaved="focusNoteEdit()" />

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
    },
    methods: {
      focusNoteEdit: function () {
        this.$children[2].$el.focus()
      }
    }
}
</script>

<style>
  /* CSS */
</style>
