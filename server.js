import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { configDotenv } from 'dotenv'


let movies = [
  { id: 1, title: "Inception", year: 2010 },
  { id: 2, title: "Interstellar", year: 2014 }
];

let tasks = [
  { id: 1, title: "Estudar Node.js", completed: false, priority: "high" },
  { id: 2, title: "Fazer LAB-1", completed: true, priority: "medium" }
];

configDotenv()
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

// Movies

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

// Tasks (desculpa os comentários sor, é só pra organizar)

app.get('/tasks', (req, res) => {

    const { completed } = req.query

    if(completed == undefined) {
        return res.status(200).json({ message: "Sucesso ao acessar a lista de filmes", tasks: tasks })
    }

    const isCompleted = completed === 'true'

    const tasksList = tasks.filter(task => task.completed === isCompleted)
    
    res.status(200).json({ 
        message: "Sucesso ao buscar tarefa", 
        tasksList 
    })
})

app.get('/tasks/:id', (req, res) => {

    const { 
        id
    } = req.params
    
    if (!id) {
        return res.status(404).json({ message: "Não foi adicionado nenhum ID aos parâmetros" })
    }

    const task = tasks.find((task) => task.id == id)

    if (!task) {
        return res.status(404).json({ message: "Não foi achado nenhuma task com este ID" })
    }

    res.status(200).json({ message: "Sucesso ao buscar tarefa", task })
})

app.post('/tasks', (req, res) => {

    const tasksLenght = tasks.length

    const {
        title,
        priority
    } = req.body

    if (!title || !priority) {
        return res.status(404).json({ message: "Por favor, insira o titulo da task e o sua prioridade" })
    }

    if (priority != "low" && priority != "medium" && priority != "high") {
        return res.status(404).json({ message: "Por favor, insira uma prioridade válida (low, medium ou high)." })
    }

    const newMovie = {
        id: tasksLenght + 1,
        title,
        completed: false,
        priority
    }

    tasks.push(newMovie)

    res.status(200).json({ message: "Sucesso ao adicionar task nova", updatedTasks: tasks })
})

app.put('/tasks/:id', (req, res) => {
    
    const { id } = req.params
    const { title, priority } = req.body

    const taskToEdit = tasks.filter(task => task.id == id)

    if (title) {
        taskToEdit[0].title = title
    } 
    if (priority) {
        taskToEdit[0].priority = priority
    }

    if (!title && !priority) {
        return res.status(404).json({ message: "Nenhum dado foi passado para que a edição fosse realizada" })
    }

    res.status(200).json({ message: `Sucesso ao editar o filme de id ${id}`, updatedTasks: tasks })
})

app.patch('/tasks/:id/toggle', (req, res) => {
    
    const { id } = req.params

    if (!id) return res.status(404).json({ message: "Forneça um ID"})

    const taskToEdit = tasks.filter(task => task.id == id)

    if (taskToEdit.length == 0) return res.status.json({ message: "Não foi encontrada nenhuma task com esse ID."})

    taskToEdit[0].completed = !taskToEdit[0].completed

    res.status(200).json({ message: `Sucesso ao editar o task de id ${id}`, updatedTask: taskToEdit[0] })
})

app.delete('/tasks/:id', (req, res) => {

    const { id } = req.params

    if (!id) return res.status(404).json({ message: "Forneça um ID"})

    const taskToDelete = tasks.filter(task => task.id == id)

    if (taskToDelete.length == 0) return res.status.json({ message: "Não foi encontrada nenhuma task com esse ID."})
    
    tasks = tasks.filter(tasks => tasks.id != taskToDelete[0].id)

    res.status(200).json({ message: "Sucesso ao deletar tarefa", updatedTasks: tasks})
})


const port = process.env.SERVER_PORT || 3000

app.listen(port, () => {
    console.log("Servidor rodando.", port)
})