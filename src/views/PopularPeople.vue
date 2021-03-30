<template>
  <main class="people-grid">
    <PersonCard v-for="person in people" :key="person.personId" :name="person.name" :profilePictureUrl="person.profilePictureUrl" :knownFor="person.knownFor" :personId="person.personId" />
  </main>
</template>

<script>
import PersonCard from "@/components/PersonCard.vue";

export default {
  components: {
    PersonCard
  },
  data: () => {
    return {
      people: []
    }
  },
  created: function() {
    fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/actors?loadRelations=known_for")
      .then(resp => resp.json())
      .then(data => {
        data.forEach(dbActor => {
          const knownFor = dbActor['known_for'].map(movie => movie.title)
          const actor = {
            'name': dbActor.name,
            'knownFor': knownFor,
            'profilePictureUrl': dbActor['profile_picture_url'],
            'personId': dbActor.objectId
          }

          this.people.push(actor)
        })
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
