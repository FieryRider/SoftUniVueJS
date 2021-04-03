const loginRequest = (username, password, store) => {
  return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/users/login", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'login': username,
      'password': password
    })
  }).then(resp => {
    if (resp.status == 401)
      return Promise.reject("Ivalid username or password")
    else if (!resp.ok)
      return Promise.reject(`Server returned ${resp.status}: ${resp.statusText}`)

    return resp.json()
  }).then(data => {
    store.commit("setUserToken", data['user-token'])
    store.commit("setLoginTime")
    return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/services/UserManagement/get-current-user-roles", {
      method: "GET",
      headers: {
        'Content-Type': "application/json",
        'user-token': store.getters.getUserToken
      }
    })
  }).then(resp => {
    if (resp.status >= 500)
      return Promise.reject({
        'status': resp.status,
        'statusText': resp.statusText
      })
    else if (!resp.ok && resp.status < 500)
      return Promise.reject({
        'respData': resp
      })

    return resp.json()
  }).then(data => {
    store.commit("setIsAdmin", data.includes("Admin"))
    return Promise.resolve()
  })
}

const registerRequest = (username, password, email) => {
  return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/users/register", {
    method: "POST",
    body: JSON.stringify({ username, password, email })
  }).then(resp => {
    if (resp.status >= 500)
      return Promise.reject({
        'status': resp.status,
        'statusText': resp.statusText
      })
    else if (!resp.ok && resp.status < 500)
      return Promise.reject({
        'respData': resp
      })
  })
}

export {
  loginRequest,
  registerRequest
}
