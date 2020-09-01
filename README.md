![logo](https://www.movierankings.net/static/media/logo.577ce152.jpg)

# The Movie Ranking Database (Client)
Front-end for [The Movie Ranking Database](https://www.movierankings.net/). Created for Jeff D. Lowe & *Lights, Camera, Barstool*

The back-end API for the site can be found at [this repo](https://github.com/mnichols17/ts-express-server)


## Features
+ Search through 4000+ movie reviews using live-search and up to 16 different filter categories
	+ Each review card includes the movie poster, the title and the score & rank based on what score/rank category the user decided to look at
	+ The list of movies uses infinite scrolling and pagination to generate 120 reviews per page
+ [Random Movie Generator](https://www.movierankings.net/random) - Generates a random movie based on user-selected filters.
+ Each review contains information about the reviewed movie like a short plot summary, the main cast, a trailer and what streaming providers you can watch it on. Each review also suggests a list of 6 similar movies to the users

## Routes
+ `/` - Landing Page and List of Movies
+ `/review/{movie_id}` - Individual Reviews
+ `/random` - Random Movie Generator and generated reviews

## Built Using
+ Node
+ React (in Typescript)
+ [React-Router](https://github.com/ReactTraining/react-router)
+ [Axios](https://github.com/axios/axios)
+ [React-Infinite-Scroll](https://github.com/ankeetmaini/react-infinite-scroll-component#readme)
+ [Smoothscroll-Polyfill](https://github.com/iamdustan/smoothscroll)
+ [React-Select](https://github.com/JedWatson/react-select)
+ [React-Player](https://github.com/CookPete/react-player)
+ [React-Loading](https://github.com/fakiolinho/react-loading)
