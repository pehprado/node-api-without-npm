'use strict'

const http = require('http');
const url = require('url');
const StringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');

let manipulador = {};

manipulador.hello = (data, callback) => {
    callback(200, {'message': 'Hello World'});
};

manipulador.naoEncontrou = (data, callback) => {
    callback(400, {'message': 'Caminho não encontrado!'});
};

let rotas = {
    'hello': manipulador.hello
}

const server = http.createServer((req, res) => {

    let parsedUrl = url.parse(req.url, true);

    let caminho = parsedUrl.pathname;
    let caminhoSemQueryString = caminho.replace(/^\/+|\/+$/g, '');
    let decodificador = new StringDecoder('utf-8');
    let buffer = '';

    req.on('data', data => {
        buffer += decodificador.write(data);
    });

    req.on('end', _ => {
        buffer += decodificador.end();

        let manipuladorEscolhido = typeof(rotas[caminhoSemQueryString]) !== 'undefined' ? rotas[caminhoSemQueryString] : manipulador.naoEncontrou;

        let data = {
            'retorno': buffer
        };

        manipuladorEscolhido(data, (statusCode, retorno) => {
            statusCode = typeof(statusCode) == 'number' ? statusCode : 200;

            retorno = typeof(retorno) == 'object' ? retorno : {};

            let retornoJSON = JSON.stringify(retorno);

            res.setHeader('Content-Type', 'application/json');
            res.writeHead(statusCode);
            res.end(retornoJSON);
        });
    });
});

server.listen(config.port, _ => {
    console.log(`O servidor está escutando na porta ${config.port} no ambiente de ${config.envName}`)
});