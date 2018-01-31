const restify = require('restify');
const errs = require('restify-errors');

const server = restify.createServer({
  name: 'myapp',
  version: '1.0.0'
});

//Conectando com o banco usando o Knex
const knex = require('knex')({
  client: 'mysql',
  connection: {
    host : '127.0.0.1',
    user : 'root',
    password : 'root',
    database : 'db'
  }
});


server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

server.listen(5000, function () {
  console.log('%s listening at %s', server.name, server.url);
});



server.get('/', restify.plugins.serveStatic({
  directory: './dist',
  file: 'index.html'
}))



//fazendo uma busca no banco
server.get('/read', function (req, res, next) {
  knex('rest').then((dados)=>{
    res.send(dados);
  }, next);
  return next();
});


//Fazendo um insert no banco (Inserindo valores no banco usando metodo POST)
server.post('/create', function (req, res, next) {
  knex('rest')
    .insert(req.body)
    .then((dados)=>{
    res.send(dados);
  }, next);

});


//Fazendo uma busca especifica no banco usando ID
server.get('/show/:id', function (req, res, next) {
  const { id } = req.params;
  knex('rest')
  .where('id', id)
  .first()
  .then((dados)=>{
    if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
    res.send(dados);
  }, next);
});


//Fazendo atualização de um dado
server.put('/update/:id', function (req, res, next) {
  const { id } = req.params;
  knex('rest')
  .where('id', id)
  .update(req.body)
  .then((dados)=>{
    if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
    res.send('dados atualizados');
  }, next);
});


//Excluindo dados do banco
server.del('/delete/:id', function (req, res, next) {
  const { id } = req.params;
  knex('rest')
  .where('id', id)
  .delete()
  .then((dados)=>{
    if(!dados) return res.send(new errs.BadRequestError('nada foi encontrado'))
    res.send('dados excluidos');
  }, next);
});