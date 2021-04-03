const getFavouriteMoviesRequest = (userToken) => {
  return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies?relationsDepth=2", {
      headers: {
        'Conten-Type': "application/json",
        'user-token': userToken
      }
    })
    .then(resp => {
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
    })
    .then(data => {
      const movies = []
      data.forEach(dbFavMovie => {
        const dbMovie = dbFavMovie.movie
        const movie = {
          'title': dbMovie.title,
          'releaseDate': new Date(dbMovie['release_date']),
          'rating': dbMovie.rating,
          'posterUrl': dbMovie['poster_url'],
          'overview': dbMovie.overview,
          'officialLanguage': dbMovie['official_language'],
          'budget': dbMovie.budget,
          'revenue': dbMovie.revenue,
          'status': dbMovie.status,
          'movieId': dbMovie.objectId,
          'favourite': true
        }

        movies.push(movie)
      })

      return Promise.resolve(movies)
    })
    .catch(err => {
      return Promise.reject(err)
    })
}
const getAllMoviesRequest = (userToken) => {
  let favouriteMoviesIds
  let popularMoviesIds
  let favouriteMoviesRequest = Promise.resolve()
  if (userToken) {
    favouriteMoviesRequest = fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies?relationsDepth=1", {
      headers: {
        'Conten-Type': "application/json",
        'user-token': userToken
      }
    })
  }
  return favouriteMoviesRequest
    .then(resp => {
      if (resp === undefined)
        return Promise.resolve()
      else
        return resp.json()
    })
    .then(data => {
      if (data !== undefined && !("errorData" in data))
        favouriteMoviesIds = data.map(favMovie => favMovie.movie.objectId)

      return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/popular_movies?relationsDepth=1")
    })
    .then(resp => resp.json())
    .then(data => {
      popularMoviesIds = data.map(popularMovie => popularMovie.movie.objectId)
      return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies")
    })
    .then(resp => resp.json())
    .then(data => {
      const movies = []
      data.forEach(dbMovie => {
        const movie = {
          'title': dbMovie.title,
          'releaseDate': new Date(dbMovie['release_date']),
          'rating': dbMovie.rating,
          'posterUrl': dbMovie['poster_url'],
          'overview': dbMovie.overview,
          'officialLanguage': dbMovie['official_language'],
          'budget': dbMovie.budget,
          'revenue': dbMovie.revenue,
          'status': dbMovie.status,
          'movieId': dbMovie.objectId,
          'favourite': favouriteMoviesIds == undefined ? false : favouriteMoviesIds.includes(dbMovie.objectId),
          'popular': popularMoviesIds == null ? false : popularMoviesIds.includes(dbMovie.objectId)
        }

        movies.push(movie)
      })

      return Promise.resolve(movies)
    })

}
const getPopularMoviesRequest = (userToken) => {
  let favouriteMoviesIds
  let popularMoviesIds
  let favouriteMoviesRequest = Promise.resolve()
  if (userToken) {
    favouriteMoviesRequest = fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/favourite_movies?relationsDepth=1", {
      headers: {
        'Conten-Type': "application/json",
        'user-token': userToken
      }
    })
  }
  return favouriteMoviesRequest
    .then(resp => {
      if (resp === undefined)
        return Promise.resolve()
      else
        return resp.json()
    })
    .then(data => {
      favouriteMoviesIds = null
      if (data != undefined && !("errorData" in data))
        favouriteMoviesIds = data.map(favMovie => favMovie.movie.objectId)

      return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/popular_movies?relationsDepth=1")
    })
    .then(resp => resp.json())
    .then(data => {
      popularMoviesIds = data.map(popularMovie => popularMovie.movie.objectId)
      return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies")
    })
    .then(resp => resp.json())
    .then(data => {
      const movies = []
      data.filter(dbMovie => popularMoviesIds.includes(dbMovie.objectId)).forEach(dbMovie => {
        const movie = {
          'title': dbMovie.title,
          'releaseDate': new Date(dbMovie['release_date']),
          'rating': dbMovie.rating,
          'posterUrl': dbMovie['poster_url'],
          'overview': dbMovie.overview,
          'officialLanguage': dbMovie['official_language'],
          'budget': dbMovie.budget,
          'revenue': dbMovie.revenue,
          'status': dbMovie.status,
          'movieId': dbMovie.objectId,
          'favourite': favouriteMoviesIds == null ? false : favouriteMoviesIds.includes(dbMovie.objectId),
          'popular': popularMoviesIds == null ? false : popularMoviesIds.includes(dbMovie.objectId)
        }
        movies.push(movie)
      })

      return Promise.resolve(movies)
    })
}
const addMovieRequest = (movie, cast, genres, userToken) => {
  let addedMovieId
  return fetch("https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies", {
    method: "POST",
    headers: {
      'Content-Type': "application/json",
      'user-token': userToken
    },
    body: JSON.stringify(movie)
  }).then(resp => {
    if (!resp.ok)
      return Promise.reject(`Server returned ${resp.status}: ${resp.statusText}`)

    return resp.json()
  }).then(movie => {
    addedMovieId = movie.objectId
    return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies/${addedMovieId}/cast`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        'user-token': userToken
      },
      body: JSON.stringify(cast)
    })
  }).then(resp => {
    if (!resp.ok)
      return Promise.reject(`Server returned ${resp.status}: ${resp.statusText}`)

    return fetch(`https://eu-api.backendless.com/8764A135-6D4C-0237-FF3B-E041AA778300/A5DE6895-9860-4194-A9BD-99EC35D4131D/data/movies/${addedMovieId}/genres`, {
      method: "POST",
      headers: {
        'Content-Type': "application/json",
        'user-token': userToken
      },
      body: JSON.stringify(genres)
    })
  }).then(resp => {
    if (!resp.ok)
      return Promise.reject(`Server returned ${resp.status}: ${resp.statusText}`)

    return Promise.resolve("Movie added successfully")
  })
}

export {
  getAllMoviesRequest,
  getFavouriteMoviesRequest,
  getPopularMoviesRequest,
  addMovieRequest
}
