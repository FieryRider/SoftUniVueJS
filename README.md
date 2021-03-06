# tmdb-clone

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

## Usage
The application has 8 pages (Login, Register, Movies, People, AddMovie, AddPeople, FavouriteMovies):
* Login, Register, Movies, People are accessable without authentication.
* AddMovie, AddPeople require authentication with an admin account  
* FavouriteMovies is only accessible for logged in users

There are 2 types of users: `Admins` and `Normal Users`.
* The admin accounts are predefined and cannot be registered through the registration form.
* Normal accounts can be registered through the registration form.

Pages:
* The Movies page shows a list of movies. Each movie is clickable and leads to Movie Details page.
* The People page shows list of actors and cast.
* The Favourite Movies page shows a list of favourite movies for that user. Movies can be added to favourite from the `...` menu

**The administrator account is: username: `admin`, password `1234567890`**
