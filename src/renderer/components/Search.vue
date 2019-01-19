<template>
  <div>
    <input
      type="text"
      placeholder="new note name"
      :value="newNoteName"
      @input="updateNoteName"
      v-on:keyup.enter="createNote"
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
      this.$store.commit('createNote')
    },
    updateNoteName: function (e) {
      this.$store.commit('updateNoteName', e.target.value)
    }
  }
}
</script>

<style></style>
