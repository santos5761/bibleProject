const capBlock = document.querySelector(".cvs");
const verBlock = document.querySelector(".versiculos");
const fecharVerBlock = document.querySelector("#sairVersiculo");
const container = document.querySelector(".container");
let capBlockOpened = false;

fetch("https://www.abibliadigital.com.br/api/books")
  .then((response) => response.json())
  .then((data) => {
    const bancadaLivros = document.querySelector(".livros");
    const antigoTestamento = document.querySelector(".antigoTestamento");
    const novoTestamento = document.querySelector(".novoTestamento");

    // Gerando os livros
    for (let i = 0; i < data.length; i++) {
      if (data[i].testament === "VT") {
        gerarLivros(
          data[i].name,
          antigoTestamento,
          data[i].chapters,
          data[i].abbrev.pt
        );
      } else if (data[i].testament === "NT") {
        gerarLivros(
          data[i].name,
          novoTestamento,
          data[i].chapters,
          data[i].abbrev.pt
        );
      }
    }
  });

function gerarLivros(nomeLivro, anexoLivros, cap, nomeAbreviado) {
  const div = document.createElement("div");
  div.classList.add("livro");

  const titulo = document.createElement("p");
  titulo.textContent = nomeLivro;

  div.appendChild(titulo);
  anexoLivros.appendChild(div);

  // Aparecer capitulos
  div.addEventListener("click", function () {
    if (!capBlockOpened) {
      capBlock.style.animation = "2s aparecerCaps forwards";
      container.style.filter = "brightness(0.5)";
      var h1Capitulos = document.createElement("h1");
      h1Capitulos.textContent = "Capitulos";
      h1Capitulos.id = "capver";
      capBlock.appendChild(h1Capitulos);

      var imgCapitulos = document.createElement("img");
      imgCapitulos.alt = "X";
      imgCapitulos.id = "fechar";
      capBlock.appendChild(imgCapitulos);

      imgCapitulos.addEventListener("click", function () {
        capBlock.innerHTML = "";
        capBlock.style.animation = "desaparecerCaps 3s forwards";
        container.style.filter = "brightness(1)";
        capBlockOpened = false;
      });

      for (let c = 1; c <= cap; c++) {
        (function (capitulo) {
          var capBox = document.createElement("div");
          capBox.classList.add("cv");
          capBox.textContent = capitulo;

          capBlock.appendChild(capBox);

          capBox.addEventListener("click", function () {
            verBlock.style.animation = "aparecerVersiculos 3.5s forwards";
            fecharVerBlock.style.animation = "aparecerVersiculos 3.5s forwards";
            const livroId = nomeAbreviado;

            fetch(
              `https://www.abibliadigital.com.br/api/verses/nvi/${livroId}/${capitulo}`
            )
              .then((response) => response.json())
              .then((responseJs) => responseJs.verses)
              .then((versiculos) => {
                versiculos.forEach((versiculo) => {
                  var h1titulo = document.createElement("h1");
                  h1titulo.classList.add("titVersiculo");
                  verBlock.appendChild(h1titulo);

                  criarVersiculos(
                    livroId,
                    capitulo,
                    versiculo.number,
                    versiculo.text
                  );
                });
                gerarBotoes(capitulo, livroId, cap);
              });
          });
        })(c);
      }

      capBlockOpened = true;
    }
  });
}

function criarVersiculos(abrevi, numCap, numeroVersic, versic) {
  var h1titulo = document.createElement("h1");
  h1titulo.classList.add("titVersiculo");
  const titVersiculo = document.querySelector(".titVersiculo");
  titVersiculo.textContent = abrevi.toUpperCase() + " Cap " + numCap;

  const versiculo = document.createElement("div");
  versiculo.classList.add("versiculo");
  verBlock.appendChild(versiculo);

  const numVersiculo = document.createElement("p");
  numVersiculo.classList.add("numVersiculo");
  numVersiculo.textContent = numeroVersic;
  versiculo.appendChild(numVersiculo);

  let txtVersiculo = document.createElement("p");
  txtVersiculo.classList.add("txtVersiculo");
  txtVersiculo.textContent = versic;
  versiculo.appendChild(txtVersiculo);
}

//Gera, anexa e configura botoes de voltar e avançar
function gerarBotoes(capitulo, livroId, totalCapitulos) {
  //inicio
  //Gerando
  let botoes = document.createElement("div");
  botoes.classList.add("buttons");
  verBlock.appendChild(botoes);

  let btnVoltar = document.createElement("button");
  btnVoltar.textContent = "Capítulo Anterior";
  botoes.appendChild(btnVoltar);

  let btnAvancar = document.createElement("button");
  btnAvancar.textContent = "Próximo Capítulo";
  botoes.appendChild(btnAvancar);

  //Texto do btn
  if (capitulo === 1) {
    btnVoltar.style.display = "none";
  } else if (capitulo > 1) {
    btnVoltar.style.display = "inline";
  }

  if (capitulo === totalCapitulos) {
    btnAvancar.style.display = "none";
  } else if (capitulo < totalCapitulos) {
    btnAvancar.style.display = "inline";
  }

  //Configuração do btn Avançar
  btnAvancar.addEventListener("click", function () {
    verBlock.innerHTML = "";
    capitulo++;
    fetch(
      `https://www.abibliadigital.com.br/api/verses/nvi/${livroId}/${capitulo}`
    )
      .then((response) => response.json())
      .then((responseJs) => responseJs.verses)
      .then((versiculos) => {
        var h1titulo = document.createElement("h1");
        h1titulo.classList.add("titVersiculo");
        verBlock.appendChild(h1titulo);

        // Aparição dos versículos
        versiculos.forEach((versiculo) => {
          criarVersiculos(livroId, capitulo, versiculo.number, versiculo.text);
        });

        gerarBotoes(capitulo, livroId, totalCapitulos);
      });
  });

  // Chame a função quando precisar rolar para o topo
  scrollToTop();
  //fim

  //Configuração do btn Voltar
  btnVoltar.addEventListener("click", function () {
    verBlock.innerHTML = "";
    capitulo--;
    fetch(
      `https://www.abibliadigital.com.br/api/verses/nvi/${livroId}/${capitulo}`
    )
      .then((response) => response.json())
      .then((responseJs) => responseJs.verses)
      .then((versiculos) => {
        var h1titulo = document.createElement("h1");
        h1titulo.classList.add("titVersiculo");
        verBlock.appendChild(h1titulo);

        // Aparição dos versículos
        versiculos.forEach((versiculo) => {
          criarVersiculos(livroId, capitulo, versiculo.number, versiculo.text);
        });

        gerarBotoes(capitulo, livroId, totalCapitulos);
      });
  });

  // Chame a função quando precisar rolar para o topo
  scrollToTop();
}

// Para rolar para o topo da página
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth" // Esta opção faz com que a rolagem seja suavizada
  });
}

//Desaparecer versiculo:

fecharVerBlock.addEventListener("click", function () {
  verBlock.style.animation = "desaparecerVersiculos 1s forwards";
  fecharVerBlock.style.animation = "desaparecerFecharVersiculos 1s forwards";
  verBlock.innerHTML = "";
});
