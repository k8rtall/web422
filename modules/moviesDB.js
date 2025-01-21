const mongoose = require('mongoose');

class MoviesDB {
    constructor() {
        this.Movie = null;
    }

    async initialize(connectionString) {
        await mongoose.connect(connectionString);
        const movieSchema = new mongoose.Schema({
            title: String,
            year: Number,
            director: String,
            // Add more fields as needed
        });
        this.Movie = mongoose.model('Movie', movieSchema);
    }

    async addNewMovie(data) {
        const newMovie = new this.Movie(data);
        return await newMovie.save();
    }

    async getAllMovies(page, perPage, title) {
        const query = title ? { title: new RegExp(title, 'i') } : {};
        const pageNumber = parseInt(page, 10) || 1; // Default to 1 if page is not provided or invalid
        const perPageNumber = parseInt(perPage, 10) || 10; // Default to 10 if perPage is not provided or invalid
        const skip = (pageNumber - 1) * perPageNumber;
    
        console.log('Parsed Page Number:', pageNumber); // Add this line
        console.log('Parsed PerPage Number:', perPageNumber); // Add this line
        console.log('Skip:', skip); // Add this line
    
        const movies = await this.Movie.aggregate([
            { $match: query },
            { $sort: { year: 1 } },
            { $skip: skip },
            { $limit: perPageNumber }
        ]);
    
        return movies;
    }
    
    
    

    async getMovieById(id) {
        return await this.Movie.findById(id);
    }

    async updateMovieById(data, id) {
        return await this.Movie.findByIdAndUpdate(id, data, { new: true });
    }

    async deleteMovieById(id) {
        return await this.Movie.findByIdAndDelete(id);
    }
}

module.exports = MoviesDB;
