/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: ana masumi Student ID: ______________ Date: ________________
*  Vercel Link: _______________________________________________________________
*
********************************************************************************/ 

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());

// Require the moviesDB.js module
const MoviesDB = require('./modules/moviesDB.js');
const db = new MoviesDB();

// Initialize the database connection and start the server
db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((err) => {
    console.log('Error:', err);
});

app.get('/', (req, res) => {
    res.json({ message: "API Listening" });
});

app.post('/api/movies', (req, res) => {
    db.addNewMovie(req.body).then((movie) => {
        res.status(201).json(movie);
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

app.get('/api/movies', (req, res) => {
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 10;
    const title = req.query.title;

    console.log('Page:', page); // Add this line
    console.log('PerPage:', perPage); // Add this line

    db.getAllMovies(page, perPage, title).then((movies) => {
        res.json(movies);
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});


app.get('/api/movies/:id', (req, res) => {
    db.getMovieById(req.params.id).then((movie) => {
        if (movie) {
            res.json(movie);
        } else {
            res.status(404).json({ error: "Movie not found" });
        }
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});


app.put('/api/movies/:id', (req, res) => {
    db.updateMovieById(req.body, req.params.id).then((movie) => {
        res.status(204).end();
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});


app.delete('/api/movies/:id', (req, res) => {
    db.deleteMovieById(req.params.id).then(() => {
        res.status(204).end();
    }).catch((err) => {
        res.status(500).json({ error: err });
    });
});

module.exports = app;