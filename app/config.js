'use strict'

let ambientes = {};

ambientes.homologacao = {
    'port': 3000,
    'envName': 'homolog'
};

ambientes.producao = {
    'port': 5000,
    'envName': 'prod'
}

let ambienteAtual = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

let ambienteParaExportar = typeof(ambientes[ambienteAtual]) == 'object' ? ambientes[ambienteAtual] : ambientes.homologacao;

module.exports = ambienteParaExportar;