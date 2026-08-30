// RELÓGIO

const elementoHora = document.getElementById("hora");

function atualizarRelogio() {
  const agora = new Date();
  const horas = String(agora.getHours()).padStart(2, "0");
  const minutos = String(agora.getMinutes()).padStart(2, "0");
  elementoHora.textContent = `${horas}:${minutos}`;
}

atualizarRelogio();
setInterval(atualizarRelogio, 1000);

// CÁLCULOS

let expressao = "";

const visorExpressao = document.getElementById("visor-expressao");
const visorResultado = document.getElementById("visor-resultado");

function arredondar(numero) {
  return Math.round(numero * 1e10) / 1e10;
}

// troca × ÷ − pelos operadores
function paraCalculo(texto) {
  return texto.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-");
}

function calcularPreview() {
  if (expressao === "") {
    visorResultado.textContent = "";
    return;
  }

  try {
    const resultado = Function(
      `"use strict"; return (${paraCalculo(expressao)})`,
    )();

    if (Number.isFinite(resultado)) {
      visorResultado.textContent = `=${arredondar(resultado)}`;
    } else {
      visorResultado.textContent = "";
    }
  } catch {
    visorResultado.textContent = "";
  }
}

function renderizarTela() {
  visorExpressao.textContent = expressao || "0";
  calcularPreview();
}

// dígito ou ponto decimal
function digitar(valor) {
  const partes = expressao.split(/([+\-×÷])/);
  const numeroAtual = partes[partes.length - 1];

  // bloqueia zero à esquerda (evita erro de sintaxe)
  if (/^0*$/.test(numeroAtual) && valor !== ".") {
    expressao =
      expressao.slice(0, expressao.length - numeroAtual.length) +
      valor.slice(-1);
  } else {
    expressao += valor;
  }

  renderizarTela();
}

// operadores
function inserirOperador(operador) {
  if (expressao === "") return;

  const ultimoCaractere = expressao[expressao.length - 1];
  const ultimoEhOperador = ["+", "-", "×", "÷"].includes(ultimoCaractere);

  if (ultimoEhOperador) {
    expressao = expressao.slice(0, -1) + operador;
  } else {
    expressao += operador;
  }

  renderizarTela();
}

function limpar() {
  expressao = "";
  desmarcarOperadores();
  renderizarTela();
}

function apagar() {
  expressao = expressao.slice(0, -1);
  renderizarTela();
}

function aplicarPorcentagem() {
  if (expressao === "") return;

  try {
    const resultado = Function(
      `"use strict"; return (${paraCalculo(expressao)})`,
    )();
    expressao = String(arredondar(resultado / 100));
    renderizarTela();
  } catch {}
}

function calcularResultado() {
  if (expressao === "") return;

  try {
    const resultado = Function(
      `"use strict"; return (${paraCalculo(expressao)})`,
    )();

    if (!Number.isFinite(resultado)) {
      throw new Error("Resultado inválido");
    }

    expressao = String(arredondar(resultado));
    visorResultado.textContent = "";
    visorExpressao.textContent = expressao;
  } catch {
    visorExpressao.textContent = "Erro";
    visorResultado.textContent = "";
    expressao = "";
  }

  desmarcarOperadores();
}

const botoes = document.querySelectorAll("#grid-numeros button");

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const valor = botao.dataset.valor;
    const acao = botao.dataset.acao;

    if (botao.classList.contains("botao-numero")) {
      digitar(valor);
    } else if (botao.classList.contains("botao-operador")) {
      inserirOperador(valor);
      marcarOperadorSelecionado(botao);
    } else if (acao === "limpar") {
      limpar();
    } else if (acao === "apagar") {
      apagar();
    } else if (acao === "porcentagem") {
      aplicarPorcentagem();
    } else if (acao === "igual") {
      calcularResultado();
    }
  });
});

function marcarOperadorSelecionado(botaoClicado) {
  desmarcarOperadores();
  botaoClicado.classList.add("selecionado");
}

function desmarcarOperadores() {
  document
    .querySelectorAll(".botao-operador")
    .forEach((botao) => botao.classList.remove("selecionado"));
}

renderizarTela();
