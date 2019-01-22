<template>
  <div class="note-list-container" v-shortkey="{up: ['arrowup'], down: ['arrowdown'], delete: ['meta', 'd']}" @shortkey="handleShortcuts(selectedNoteID)">
    <ul v-if="filteredNotes.length >= 0">
      <li
        v-for="filteredNote in filteredNotes"
        :key="filteredNote.id"
        :data-note-id="filteredNote.id"
        @click="selectNote(filteredNote.id)"
        :class="{ active: selectedNoteID === filteredNote.id }"
      >
        {{ filteredNote.name }}
      </li>
    </ul>
    <ul v-if="filteredNotes.length <= 0">
      <li
        v-for="note in notes"
        :key="note.id"
        :data-note-id="note.id"
        @click="selectNote(note.id)"
        :class="{ active: selectedNoteID === note.id }"
      >
        {{ note.name }}
      </li>
    </ul>
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
    handleShortcuts: function (e, id) {
      let currentNoteId = this.selectedNoteID
      switch (event.srcKey) {
        case 'up':
          if (this.$store.state.Notes.doesQueryHaveMatch) {
            let prevNoteId = this.filteredNotes[this.filteredNotes.findIndex(function (note) { return note.id === currentNoteId }) - 1].id
            if (prevNoteId) {
              this.selectNote(prevNoteId)
            }
          } else {
            let prevNoteId = this.notes[this.notes.findIndex(function (note) { return note.id === currentNoteId }) - 1].id
            if (prevNoteId) {
              this.selectNote(prevNoteId)
            }
          }
          break
        case 'down':
          if (this.$store.state.Notes.doesQueryHaveMatch) {
            let nextNoteId = this.filteredNotes[this.filteredNotes.findIndex(function (note) { return note.id === currentNoteId }) + 1].id
            if (nextNoteId) {
              this.selectNote(nextNoteId)
            }
          } else {
            let nextNoteId = this.notes[this.notes.findIndex(function (note) { return note.id === currentNoteId }) + 1].id
            if (nextNoteId) {
              this.selectNote(nextNoteId)
            }
          }
          break
        case 'delete':
          this.$store.dispatch('deleteNoteAndSelectNew', id)
          break
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
}
</script>

<style scoped lang="scss">

.active {
  color: #fff;
  background-color: rgb(69, 107, 190);
}

.note-list-container {
  box-sizing: border-box;
  margin: 0;
  padding-top: 5px;
  height: 150px;
  font-size: 13px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  line-height: 21px;
  overflow: scroll;

  li {
    padding-left: 10px;

    &:hover {
      cursor: default;
    }
  }
}
</style>
