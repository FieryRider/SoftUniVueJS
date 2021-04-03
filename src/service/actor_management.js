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
  addActorRequest
}
