<template>
  <textarea
    name=""
    id=""
    cols="30"
    rows="10"
    ref="noteContent"
    :value="notes[notes.findIndex(function(note) {return note.id === selectedNoteID})].contents"
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
      let payload = {'contents': e.target.value, 'dateModified': new Date()}
      this.$store.commit('updateNoteContents', payload)

      // If user types again, restart the timer for saving to the file
      clearTimeout(this.intervalid1)
      this.saveAfterTime()
    },
    saveAfterTime: function () {
      // The context of `this` is changed inside of setTimeout so you have to
      // do something funky like this:
      const self = this
      this.intervalid1 = setTimeout(function () {
        self.$store.commit('saveToFile')
      }, 500)
    }
  }
}
</script>

<style></style>
