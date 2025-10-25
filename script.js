// Produtos com descrição, calorias e selo
const produtos = [
  { nome:"Clássica", preco:22, img:"img/frangoGrelhado.jpg", descricao:"Frango, arroz integral, legumes e salada.", calorias:450, maisVendido:true },
  { nome:"Low Carb", preco:25, img:"img/lowCarb.jpg", descricao:"Frango grelhado, legumes e ovo.", calorias:380, maisVendido:false },
  { nome:"Vegana", preco:24, img:"img/salmaoGrelhado.png", descricao:"Quinoa, legumes e grão de bico.", calorias:350, maisVendido:false }
];

let carrinho = [];
const listaProdutos = document.getElementById("listaProdutos");
const itensCarrinho = document.getElementById("itensCarrinho");
const totalCarrinho = document.getElementById("totalCarrinho");
const qtdCarrinho = document.getElementById("qtdCarrinho");
const modalCarrinho = document.getElementById("modalCarrinho");
const modalCheckout = document.getElementById("modalCheckout");
const resumoDiv = document.getElementById("resumoPedido");

// Renderiza produtos
produtos.forEach((p, i) => {
  const div = document.createElement("div");
  div.classList.add("produto");
  div.innerHTML = `
    ${p.maisVendido ? '<div class="selo">Mais Vendido</div>' : ''}
    <img src="${p.img}" alt="${p.nome}">
    <h3>${p.nome}</h3>
    <p class="descricao">${p.descricao}</p>
    <p class="calorias">${p.calorias} kcal</p>
    <p>R$ ${p.preco.toFixed(2)}</p>
    <button>Adicionar</button>
  `;
  listaProdutos.appendChild(div);
  setTimeout(() => div.classList.add("show"), i * 200);
  div.querySelector("button").addEventListener("click", () => adicionarAoCarrinho(p));
});

// Atualiza carrinho
function atualizarCarrinho() {
  itensCarrinho.innerHTML = "";
  let total = 0;
  carrinho.forEach((item, i) => {
    const li = document.createElement("li");
    li.innerHTML = `${item.nome} - R$ ${item.preco.toFixed(2)} <button onclick="removerItem(${i})">❌</button>`;
    itensCarrinho.appendChild(li);
    total += item.preco;
  });
  totalCarrinho.innerHTML = `<strong>Total:</strong> R$ ${total.toFixed(2)}`;
  qtdCarrinho.textContent = carrinho.length;
}

function adicionarAoCarrinho(produto) {
  carrinho.push(produto);
  atualizarCarrinho();
  modalCarrinho.classList.remove("oculto");
  modalCarrinho.classList.add("show");
  animacaoBotao();
}

function removerItem(i) {
  carrinho.splice(i, 1);
  atualizarCarrinho();
  animacaoBotao();
}

function animacaoBotao() {
  qtdCarrinho.style.transform = "scale(1.3)";
  setTimeout(() => {
    qtdCarrinho.style.transform = "scale(1)";
  }, 200);
}

// Abrir/Fechar carrinho
document.getElementById("btnCarrinho").addEventListener("click", () => {
  modalCarrinho.classList.remove("oculto");
  modalCarrinho.classList.add("show");
});

document.getElementById("btnHero").addEventListener("click", () => {
  modalCarrinho.classList.remove("oculto");
  modalCarrinho.classList.add("show");
});

document.getElementById("fecharCarrinho").addEventListener("click", () => {
  modalCarrinho.classList.remove("show");
  modalCarrinho.classList.add("oculto");
});

// Modo escuro
const btnTheme = document.getElementById("toggleTheme");
if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add("dark-mode");
}
btnTheme.addEventListener("click", () => document.body.classList.toggle("dark-mode"));

// Checkout e WhatsApp
const btnFinalizar = document.getElementById("btnFinalizar");
btnFinalizar.addEventListener("click", () => {
  if (carrinho.length === 0) {
    alert("Seu carrinho está vazio!");
    return;
  }

  modalCarrinho.classList.remove("show");
  modalCheckout.classList.remove("oculto");
  modalCheckout.classList.add("show");

  const pagamento = document.getElementById("pagamento").value;
  let resumo = "";
  let total = 0;

  carrinho.forEach(item => {
    resumo += `• ${item.nome} - R$ ${item.preco.toFixed(2)}\n`;
    total += item.preco;
  });

  resumo += `\n💰 Total: R$ ${total.toFixed(2)}\n📦 Pagamento: ${pagamento}`;
  resumoDiv.innerText = resumo;
});

document.getElementById("btnConfirmar").addEventListener("click", () => {
  const telefone = "5561999999999"; // <-- coloque aqui seu número WhatsApp real
  const texto = encodeURIComponent(resumoDiv.innerText);
  const link = `https://wa.me/${telefone}?text=${texto}`;
  window.open(link, "_blank");
});

document.getElementById("btnVoltar").addEventListener("click", () => {
  modalCheckout.classList.remove("show");
  modalCheckout.classList.add("oculto");
  modalCarrinho.classList.remove("oculto");
  modalCarrinho.classList.add("show");
});
