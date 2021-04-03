<template>
  <main class="people-grid">
    <PersonCard v-for="person in people" :key="person.personId" :name="person.name" :profilePictureUrl="person.profilePictureUrl" :knownFor="person.knownFor" :personId="person.personId" />
    <Spinner class="spinner"
      v-if="isLoading"/>
  </main>
</template>

<script>
import PersonCard from "@/components/PersonCard.vue";
import Spinner from "@/components/Spinner.vue"
import { getPopularPeopleRequest } from "@/service/actor_management.js"

export default {
  components: {
    PersonCard,
    Spinner
  },
  data: () => {
    return {
      people: [],
      isLoading: true
    }
  },
  created: function() {
    getPopularPeopleRequest().then(people => {
      this.people = people
      this.isLoading = false
    })
  }
};
</script>

<style scoped>
.people-grid {
  display: grid;
  grid-template: 1fr 1fr / repeat(5, 235px);
  grid-gap: 40px 40px;
  align-content: center;
  justify-content: center;
  margin-top: 30px;
}
</style>
