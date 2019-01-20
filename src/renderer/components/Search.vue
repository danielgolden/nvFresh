<template>
  <div>
    <input
      type="text"
      placeholder="new note name"
      :value="newNoteName"
      @input="updateNoteName"
      @keyup.enter="createNote"
      v-shortkey.focus="['meta', 'l']"
    />
    <!-- <button @click="createNote">Create New Note</button> -->
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
    }
  },
  methods: {
    createNote: function () {
      this.$store.dispatch('createNoteandClearInput', this.notes.length)
      this.$emit('newNoteSaved')
    },
    updateNoteName: function (e) {
      this.$store.commit('updateNoteName', e.target.value)
    }
  }
}
</script>

<style></style>
