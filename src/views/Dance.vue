<script setup>
defineProps({
  id: String
})
// import { useRoute } from 'vue-router'

// const route = useRoute()
// const id = route.params.id

// например запрос на backend
// GET /api/dances/25
</script>

<template>
	Это dance {{ id }}
</template>

<style lang="scss" scoped>
</style>
