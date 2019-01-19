<template>
  <textarea
    name=""
    id=""
    cols="30"
    rows="10"
    ref="noteContent"
    :value="notes[selectedNoteID].contents"
    @input="updateNoteContents"
  ></textarea>
</template>

<script>
export default {
  data () {
    return {}
  },
  computed: {
    notes () {
      return this.$store.state.Notes.notes
    },
    selectedNoteID () {
      return this.$store.state.Notes.selectedNoteID
    },
    newNoteName () {
      return this.$store.state.Notes.newNoteName
    }
  },
  methods: {
    updateNoteContents: function (e) {
      this.$store.commit('updateNoteContents', e.target.value)
    }
  }
}
</script>

<style></style>
