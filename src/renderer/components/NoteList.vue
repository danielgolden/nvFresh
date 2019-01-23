<template>
  <div class="note-list-container" v-shortkey="['meta', 'd']" @shortkey="deleteNote(selectedNoteID)">
    <select size="7" ref="filteredNoteList" v-if="filteredNotes.length >= 0" @input="selectNote(filteredNotes[$refs.filteredNoteList.selectedIndex].id)">
      <option
        v-for="filteredNote in filteredNotes"
        :key="filteredNote.id"
        :value="filteredNote.name"
        :data-note-id="filteredNote.id"
        :class="{ active: selectedNoteID === filteredNote.id }"
      >
        {{ filteredNote.name }}
      </option>
    </select>
    <select size="10" ref="noteList" v-if="filteredNotes.length <= 0" @input="selectNote(notes[$refs.noteList.selectedIndex].id)">
      <option
        v-for="note in notes"
        :key="note.id"
        :value="note.name"
        :data-note-id="note.id"
        @click="selectNote(note.id)"
        :class="{ active: selectedNoteID === note.id }"
      >
        {{ note.name }}
      </option>
    </select>
  </div>
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
    },
    doesQueryHaveMatch () {
      return this.$store.state.Notes.doesQueryHaveMatch
    },
    filteredNotes () {
      return this.notes.filter(note => {
        let nameAndContents = note.name + note.contents
        return nameAndContents
          .toLowerCase()
          .includes(this.newNoteName.toLowerCase())
      })
    }
  },
  methods: {
    selectNote: function (id) {
      this.$store.commit('selectNote', id)
    },
    deleteNote: function (e, id) {
      let currentNoteId = this.selectedNoteID

      if (window.confirm('You are about to delete the note "' + this.notes[this.notes.findIndex(function (note) { return note.id === currentNoteId })].name + '"!')) {
        this.$store.dispatch('deleteNoteAndSelectNew', this.selectedNoteID)
      }
    }
  },
  watch: {
    newNoteName (oldValue, newValue) {
      if (this.filteredNotes.length > 0) {
        this.selectNote(this.filteredNotes[0].id)
      }
    }
  }
  // trying select the proper note on page load
  // ,
  // mounted: function () {
  //   debugger
  //   if (this.doesQueryHaveMatch) {
  //     this.$refs.noteList.options.hasClass('active').selected = true
  //   } else {
  //     debugger
  //     this.$refs.filteredNoteList.options[this.notes.findIndex(function (note) { return note.id === this.selectedNoteID })].selected = true
  //   }
  // }
}
</script>

<style scoped lang="scss">
.note-list-container {
  box-sizing: border-box;
  margin: 1px 0 -3px;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 21px;

  select {
    width: 100%;
    font-size: 13px;
    border: none;

    &:focus {
      outline: none;

    }
  }

  option {
    padding: 2px 10px;

    &:hover {
      cursor: default;
    }
  }
}
</style>
