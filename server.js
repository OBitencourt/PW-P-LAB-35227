import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { configDotenv } from 'dotenv'


let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Interstellar", year: 2014 }
];

configDotenv()
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.get('/movies', (req, res) => {
    res.status(200).json({ message: "Sucesso ao acessar a lista de filmes", movies: movies })
})

app.get('/movies/:id', (req, res) => {

    const { 
        id
    } = req.params
    console.log(id)
    
    if (!id) {
        return res.status(404).json({ message: "Não foi adicionado nenhum ID aos parâmetros" })
    }

    const movie = movies.find((movie) => movie.id == id)

    if (!movie) {
        return res.status(404).json({ message: "Não foi achado nenhum filme com este ID" })
    }

    res.status(200).json({ message: "sucesso ao acessar a rota de get movies", movie })
})

app.post('/movies', (req, res) => {

    const moviesLenght = movies.length

    const {
        title,
        year
    } = req.body

    if (!title || !year) {
        res.status(404).json({ message: "Por favor, insira o titulo do filme e o seu ano de criação" })
    }

    const newMovie = {
        id: moviesLenght + 1,
        title,
        year
    }

    movies.push(newMovie)

    res.status(200).json({ message: "Sucesso ao adicionar filme novo", movies: movies})
})

app.put('/movies/:id', (req, res) => {
    
    const { id } = req.params
    const { title, year } = req.body

    const movieToEdit = movies.filter(movie => movie.id == id)

    if (title) {
        movieToEdit[0].title = title
    } 
    if (year) {
        movieToEdit[0].year = year
    }

    if (!title && !year) {
        return res.status(404).json({ message: "Nenhum dado foi passado para que a edição fosse realizada" })
    }

    res.status(200).json({ message: `Sucesso ao editar o filme de id ${id}`, updatedMoviesList: movies })
})

app.delete('/movies/:id', (req, res) => {

    const { id } = req.params

    const movieToDelete = movies.filter(movie => movie.id == id)
    
    movies = movies.filter(movies => movies.id != movieToDelete[0].id)

    res.status(200).json({ message: "sucesso ao acessar a rota de delete", updatedMoviesList: movies})
})

const port = process.env.SERVER_PORT || 3000

app.listen(port, () => {
    console.log("Servidor rodando.", port)
})