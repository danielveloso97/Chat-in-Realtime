const express = require("express"); //para rota
const path = require("path"); //padrão do node

const app = express();
const server = require("http").createServer(app); //Defini o protocolo http
const io = require("socket.io")(server); //Protocolo wss do websocket

app.use(express.static(path.join(__dirname, "public"))); //indicar a pasta public(backend)
app.set("views", path.join(__dirname, "public")); //config de utilizar as views como html (ejs  )
app.engine("html", require("ejs").renderFile); //para utilizar o html
app.set("view engine", "html");

app.use("/", (req, res) => {
  res.render("index.html");
});

let messages = [];

io.on("connection", (socket) => {
  console.log(`Socket Conectado: ${socket.id}`);

  socket.emit("previousMessages", messages);

  socket.on("sendMessage", (data) => {
    messages.push(data);
    socket.broadcast.emit("receivedMessage", data);
  });
});

server.listen(3000); //escutar porta 3000
