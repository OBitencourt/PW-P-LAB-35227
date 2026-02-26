import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import { configDotenv } from 'dotenv'


const users = [
    {
        id: 1,
        name: "Paulo",
        idade: 17
    },
    {
        id: 2,
        name: "Ricardo",
        idade: 19
    },
    {
        id: 3,
        name: "Jonas",
        idade: 20
    },
]

configDotenv()
const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan("dev"))

app.get('/users', (req, res) => {
    res.status(200).json({ message: "sucesso ao acessar a rota de get", users: users })
})

app.post('/users', (req, res) => {
    const { 
        id: id,
        name: name,
        idade: idade,
    } = req.body

    const newUser = {
        id,
        name,
        idade
    }

    users.push(newUser)

    res.status(200).json({ message: "sucesso ao acessar a rota de post", newUser: newUser })
})
app.put('/users:id', (req, res) => {
    res.status(200).json({ message: "sucesso ao acessar a rota de put" })
})
app.delete('/users:id', (req, res) => {

    res.status(200).json({ message: "sucesso ao acessar a rota de delete" })
})

const port = process.env.SERVER_PORT || 3000

app.listen(port, () => {
    console.log("Servidor rodando.", port)
})