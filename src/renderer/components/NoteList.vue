<template>
  <div>
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
      return this.notes.filter(notes => {
        return notes.name
          .toLowerCase()
          .includes(this.newNoteName.toLowerCase())
      })
    }
  },
  methods: {
    selectNote: function (id) {
      this.$store.commit('selectNote', id)
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
  font-weight: bold;
  color: blue;
}
</style>
