const express = require('express');
const app = express();
const Movie = require('./models/moviemodel');
const ComingSoon = require('./models/comingSoonModel');
const TvShow = require('./models/tvShowsModel');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const cors = require('cors');

require('dotenv').config()

const PORT = process.env.PORT;
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DATABASE_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;

connection.once('open', () => {
    console.log("Database connected succesfully")

})

const movieRoutes = express.Router();

app.use('/movies', movieRoutes);

//get all movies
movieRoutes.route('/').get( (req,res) => {
    Movie.find((err, movies) => {
        if (err) {
            console.log(err);
        } else {
            res.json(movies);
        }
    })
});

//get coming soon movies
movieRoutes.route('/comingsoon').get( (req, res) => {
    ComingSoon.find((err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.json(results);
        }
    }
)});

//get tv shows 
movieRoutes.route('/tvshows').get( () => {
    TvShow.find((err, results) => {
        if (err) {
            console.log(err);
        } else {
            res.json(results);
        }
    }

    )
});

//post a movie
movieRoutes.route('/add').post((req, res) =>{
    let movie = new Movie(req.body);
    movie.save()
        .then(movie => {
            res.status(200).json({'movie': 'movie/s added succesfully'});
        })
        .catch(err => {
            res.status(400).send('adding new movie/s failed');
        });
})

//update a movie
movieRoutes.route('/update/:id').post((req, res) => {
    Movie.findById(req.params._id, function(err, movie) {
        if(!movie){
            res.status(400).send("data not found");
        }
        movie.id = req.body.id;
        movie.title = req.body.title;
        movie.year = req.body.year;
        movie.runtime = req.body.runtime;
        movie.genres = req.body.genres;
        movie.director = req.body.director;
        movie.actors =  req.body.actors;
        movie.plot = req.body.plot;
        movie.posterUrl = req.body.posterUrl;

        movie.save().then( movie => {
            res.json('Movie updated!');
        })
        .catch(err => {
            res.status(400).send("Update not completed due to an error")
        })

    })
})


app.listen(PORT, function() {
    console.log(`Server is running on Port: ${PORT}`);
});