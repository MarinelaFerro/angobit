const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Emitter = require('events');


const usersRouter = require('./api/routers/user');
const musicaRouter = require('./api/routers/musica');


const app = express();
const PORT = process.env.PORT || 3001

//  mongodb+srv://mongo:mongo@cluster0.6wuhz.mongodb.net/sound_mary?retryWrites=true&w=majority
mongoose.connect('mongodb://localhost/soundMusic', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Connexao estabelecida.....✔✔✔'))
  .catch((err) => console.log(err));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, DELETE, GET, OPTIONS')
  next()
})
app.use(express.urlencoded({
  extended: false
}));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
// EVENT EMITTER
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter);


app.use('/users', usersRouter);
app.use('/musicas', musicaRouter);

app.all('*', (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} is not Found`);
  err.statusCode = 404;
  next(err);
})

app.use((err, req, res, next) => {
  const code = err.statusCode || 500;
  res.status(code).json({
    status: "fail",
    message: err.message
  })
})

const server = app.listen(PORT, () => {
  console.log(`server run on ${PORT}🚀`);
})

//SOCKET:IO

const io = require('socket.io')(server);

io.on('connection', (socket) => {
  console.log(socket.id);
})

eventEmitter.on('addcomentario', (data) => {
  io.emit('teste', data);
})