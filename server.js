import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const mongouri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
mongoose.connect(mongouri, { dbName }).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.error(err);
});
const MovieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    director: { type: String, required: true },
    year: { type: Number, required: true },
    category: { type: String, required: true }
});
const Movie=mongoose.model("Movie",MovieSchema);
const app = express();
app.use(express.json());
app.post("/api/v1/movies", (req, res) => {
    const newMovie =req.body;
    Movie.create(newMovie).then((result) => {
        res.status(201).json({ message: "Movie created successfully", data: result });
    }).catch((err) => {
        res.status(500).json({ message: "movie creation failed"});
    });
});

app.get("/api/v1/movies", async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const result = await Movie.find(query);
        res.status(200).json({
            message: "All movies fetched successfully",
            data: result
        });
    } catch (err) {
        console.error("GET MOVIES ERROR:", err);
        res.status(500).json({
            message: "Failed to fetch movies",
            error: err.message
        });
    }
});

app.get("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;
    Movie.findById(id).then((result) => {
        if (result) {
            return res.status(200).json({ message: "Movie details fetched successfully", data: result });
        }
        else{
            return res.status(404).json({ message: "Movie not found" });
        }
    }).catch((err) => {
        res.status(500).json({ message: "Failed to fetch movie" });
    });
});
app.put("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;
    const updatedMovie = req.body;
    Movie.findByIdAndUpdate(id, updatedMovie, { new: true }).then((result) => {
        if (result) {
            return res.status(200).json({ message: "Movie updated successfully", data: result });
        }
        else {
            return res.status(404).json({ message: "Movie not found" });
        }
    }).catch((err) => {
        res.status(500).json({ message: "Failed to update movie" });
    });
});
app.delete("/api/v1/movies/:id", (req, res) => {
    const { id } = req.params;
    Movie.findByIdAndDelete(id).then((result) => {
        if (result) {
            return res.status(200).json({ message: "Movie deleted successfully" });
        }
        else {
            return res.status(404).json({ message: "Movie not found" });
        }
    }).catch((err) => {
        res.status(500).json({ message: "Failed to delete movie" });
    });
});
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});