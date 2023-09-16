import express from 'express'
import path from 'path'

const app = express()

const PORT = process.env.PORT || 3004

app.use(express.static(path.resolve(__dirname, './dist')))
app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, './public/index.html'))
})

app.listen(PORT, console.log('Server listening on port', PORT))
