const { Console } = require('console');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
var cors = require('cors')
const { v4: uuid } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server , {
  cors: {
    origin: ["http://localhost:3000", "http://192.168.1.53:3000"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});
app.use(cors({
  origin: ["http://localhost:3000", "http://192.168.1.53:3000"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))
let connectedUsers = [];
let currentUser = []
let canAnswer = false
let themes = [
  {
      id : 1 , 
      theme : "developpement"
  },
  {
      id : 2 , 
      theme : "Reseau"
  },
  {
      id : 3 , 
      theme : "Cloud computing"
  },
  {
      id : 4 , 
      theme : "Cybersecurité"
  },
  {
      id : 5 , 
      theme : "Devops"
  },{
      id : 6 , 
      theme : "Systeme"
  },
]

// Définissez le répertoire statique pour servir les fichiers clients (HTML, CSS, JS).
app.use(express.static(__dirname + '/public'));

// Créez une route pour servir votre page HTML.
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Configurez la connexion Socket.io.
io.on('connection', (socket) => {

  // Gérez les événements de communication avec les clients.
  socket.on('message', (data) => {

    // Diffusez le message à tous les clients connectés.
    io.emit('message', data);
  });

  socket.on('join', (data) => {
    const exist = connectedUsers.find(e => e.name === data.name);
    socket.join(data.name)
    if (exist) {
        socket.emit('exist', data);
    }else {
      if(connectedUsers.length < 7){
        connectedUsers.push({
          id: uuid(),
          name: data.name,
          score: 0
      })
      io.emit('joined_other', connectedUsers);
      socket.emit('joined', data.name);
      }
    }
    // Diffusez le message à tous les clients connectés.
  });

  socket.on("can-answer" , data=>{
    canAnswer = data.canAnswer
  })

  socket.on('true-answer', (data)=>{
    const {name , point} = data
    const users = [...connectedUsers]
    const user = users.filter((e)=>e.name == name)
    if(user.length != 0){
      user[0].score += parseInt(point)
      connectedUsers = users
      socket.emit('new-data', connectedUsers)  
    }
  })

  socket.on('themes', (data, callback) => {
    callback(themes)
  });

  socket.on('data', (data, callback) => {
    callback(connectedUsers)
  });

  socket.on('answer', (data) => {
    const user = connectedUsers.filter((el)=>el.name == data.name)
    if (currentUser.length < 1 && canAnswer && user.length > 0) {
      currentUser.push(data)
      socket.emit('answering' + data.name , {
        success : true
      })
      io.emit('answered', data)        
    }else{
      socket.emit('answering' + data.name , {
        success : false
      })
    }
  });

  socket.on('choisir-theme', (data) => {
    let newUsers = [...connectedUsers]
    newUsers.map(el=>{
      if(el.name == data.name){
        el.theme = data.theme
      }
    })
    let newThemes = [...themes]
    newThemes = newThemes.filter(el=> el.id !== data.theme.id)
    themes = newThemes
    io.emit("someone-choice" ,{choice : true})
  });

  socket.on('rem-current', () => {
    currentUser = []
  });

  socket.on('verify-account', (data) => {
    const user = connectedUsers.filter(el=>el.name == data.name)
    const verified = user.length > 0
    socket.emit("verified"+data.name , {verified})
  });

  socket.on('remove', (data) => {
    connectedUsers = connectedUsers.filter(e => e.name !== data)
    socket.to(data).emit('removed')
  });
  // Gérez la déconnexion d'un client.
  socket.on('disconnect', () => {
  });
});

// Lancez le serveur sur le port 23000.
const PORT = process.env.PORT || 23000;
server.listen(PORT, '192.168.1.53', () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${PORT}`);
});
 