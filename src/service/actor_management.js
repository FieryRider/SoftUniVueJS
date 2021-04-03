const globalGetOptions = "pageSize=100"
const getPopularPeopleRequest = () => {
  const people = []
  const actorsRequst = fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/actors?${globalGetOptions}&loadRelations=known_for`)
  const crewRequest = fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/crew?${globalGetOptions}&loadRelations=known_for`)
  return Promise.all([actorsRequst, crewRequest])
    .then(resp => Promise.all(resp.map(r => r.json())))
    .then(([actors, crew]) => {
      console.log(actors)
      actors.forEach(dbActor => {
        const knownFor = dbActor['known_for'].map(movie => movie.title)
        const actor = {
          'name': dbActor.name,
          'knownFor': knownFor,
          'profilePictureUrl': dbActor['profile_picture_url'],
          'personId': dbActor.objectId
        }

        people.push(actor)
      })
      crew.forEach(dbCrewMember => {
        const knownFor = dbCrewMember['known_for'].map(movie => movie.title)
        const crewMember = {
          'name': dbCrewMember.name,
          'knownFor': knownFor,
          'profilePictureUrl': dbCrewMember['profile_picture_url'],
          'personId': dbCrewMember.objectId
        }

        people.push(crewMember)
      })

      return Promise.resolve(people)
    })
}
const addActorRequest = (actor, userToken) => {
  return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/actors", {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'user-token': userToken
    },
    body: JSON.stringify(actor)
  }).then(resp => {
    if (!resp.ok)
      return Promise.reject(`Server returned ${resp.status}: ${resp.statusText}`)

    return Promise.resolve("Actor added successfully")
  }).catch(err => {
    return Promise.reject(err)
  })
}

export {
  getPopularPeopleRequest,
  addActorRequest
}
