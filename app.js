// Array para guardar os pratos do cardápio em memória
const pratos = [];

const app = document.querySelector("#app");
const botoesMenu = document.querySelectorAll("nav button");

function marcarMenuAtivo(rota) {
  botoesMenu.forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.rota === rota);
  });
}

function irPara(rota) {
  marcarMenuAtivo(rota);

  if (rota === "inicio") mostrarInicio();
  if (rota === "cadastro") mostrarCadastro();
  if (rota === "lista") mostrarLista();
  if (rota === "sobre") mostrarSobre();
}

function mostrarInicio() {
  app.innerHTML = `
    <h1>Restaurante Lá Brasa</h1>
    <p>
      Bem-vindo ao sistema de gerenciamento do cardápio do restaurante <strong>Lá Brasa</strong>!
      Aqui você pode cadastrar e gerenciar os pratos servidos em nossa casa.
    </p>

    <p>
      Os itens do cardápio ficam temporariamente guardados na memória do navegador.
    </p>

    <div class="contador">
      Pratos cadastrados no cardápio: <strong>${pratos.length}</strong>
    </div>

    <div class="acoes">
      <button class="botao" id="btnCadastrar">Cadastrar prato</button>
      <button class="botao secundario" id="btnVerCardapio">Ver cardápio</button>
    </div>
  `;

  document.querySelector("#btnCadastrar")
    .addEventListener("click", () => irPara("cadastro"));

  document.querySelector("#btnVerCardapio")
    .addEventListener("click", () => irPara("lista"));
}

function mostrarCadastro() {
  app.innerHTML = `
    <h1>Cadastrar Prato</h1>

    <form id="formPrato">
      <div class="campo">
        <label for="nome">Nome do Prato</label>
        <input id="nome" type="text" placeholder="Ex: Picanha na Brasa" required />
      </div>

      <div class="campo">
        <label for="categoria">Categoria</label>
        <select id="categoria" required>
          <option value="">Selecione...</option>
          <option value="Carnes">Carnes</option>
          <option value="Acompanhamentos">Acompanhamentos</option>
          <option value="Bebidas">Bebidas</option>
          <option value="Sobremesas">Sobremesas</option>
        </select>
      </div>

      <div class="campo">
        <label for="preco">Preço (R$)</label>
        <input id="preco" type="number" step="0.01" min="0" placeholder="Ex: 89.90" required />
      </div>

      <button class="botao" type="submit">Salvar no Cardápio</button>
      <div id="mensagem"></div>
    </form>
  `;

  document.querySelector("#formPrato").addEventListener("submit", function(evento) {
    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const categoria = document.querySelector("#categoria").value;
    const preco = parseFloat(document.querySelector("#preco").value).toFixed(2);

    pratos.push({
      nome,
      categoria,
      preco,
      disponivel: true
    });

    document.querySelector("#mensagem").innerHTML =
      `<div class="mensagem">Prato "${nome}" cadastrado no cardápio com sucesso!</div>`;

    evento.target.reset();
  });
}

function mostrarLista() {
  app.innerHTML = `
    <h1>Cardápio - Lá Brasa</h1>
    <p>Confira abaixo os pratos cadastrados no restaurante.</p>
    <div id="conteudoLista"></div>
  `;

  renderizarTabela();
}

function renderizarTabela() {
  const conteudo = document.querySelector("#conteudoLista");

  if (pratos.length === 0) {
    conteudo.innerHTML = `
      <div class="vazio">
        Nenhum prato cadastrado no cardápio ainda.
      </div>
    `;
    return;
  }

  let linhas = "";

  pratos.forEach((prato, indice) => {
    linhas += `
      <tr class="${!prato.disponivel ? 'item-destaque' : ''}">
        <td><strong>${prato.nome}</strong></td>
        <td>${prato.categoria}</td>
        <td>R$ ${prato.preco}</td>
        <td>${prato.disponivel ? 'Disponível' : 'Esgotado'}</td>
        <td>
          <button class="destaque" data-indice="${indice}">
            ${prato.disponivel ? 'Marcar Esgotado' : 'Marcar Disponível'}
          </button>
          <button class="excluir" data-indice="${indice}">Excluir</button>
        </td>
      </tr>
    `;
  });

  conteudo.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Prato</th>
          <th>Categoria</th>
          <th>Preço</th>
          <th>Status</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${linhas}
      </tbody>
    </table>
  `;

  // Evento para alternar disponibilidade (Disponível / Esgotado)
  document.querySelectorAll(".destaque").forEach(botao => {
    botao.addEventListener("click", function() {
      const indice = Number(this.dataset.indice);
      pratos[indice].disponivel = !pratos[indice].disponivel;
      renderizarTabela();
    });
  });

  // Evento para excluir prato do cardápio
  document.querySelectorAll(".excluir").forEach(botao => {
    botao.addEventListener("click", function() {
      const indice = Number(this.dataset.indice);
      pratos.splice(indice, 1);
      renderizarTabela();
    });
  });
}

function mostrarSobre() {
  app.innerHTML = `
    <h1>Sobre o Lá Brasa</h1>
    <p>
      O <strong>Lá Brasa</strong> é um restaurante especializado em grelhados e cortes nobres na brasa.
    </p>
    <p>
      Esta aplicação é um gerenciador de cardápio em formato Single Page Application (SPA),
      permitindo adicionar pratos, alterar a disponibilidade e remover itens sem recarregar a página.
    </p>
  `;
}

// Configuração dos botões do menu
botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => {
    irPara(botao.dataset.rota);
  });
});

// Inicializa na tela inicial
mostrarInicio();