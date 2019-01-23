<template>
  <textarea
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
      let dateModified = new Date()
      let options = { year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }
      let dateModifiedFormatted = dateModified.toLocaleDateString('en-US', options)

      let payload = {'contents': e.target.value, 'dateModified': dateModifiedFormatted}
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

<style lang="scss" scoped>
textarea {
  display: block;
  width: 100%;
  flex-grow: 1;
  line-height: 23px;
  padding: 15px;
  font-size: 16px;
  color: #222;
  border: none;
  border-top: 5px solid rgba(0,0,0, .125);

  &:focus {
    outline: none;
  }
}
</style>
