// ===========================================
// 1. DADOS DE OPÇÕES DAS MARMITAS (Referência para o cliente)
// ===========================================
const opcoesMarmitas = [
    "Frango Desfiado (Arroz integral/branco, Lentilha com grão de bico)",
    "Estrogonofe de Frango (Batata saltê, Abobrinha, Lentilha)",
    "Almôndegas ao Molho (Purê de batata inglesa, Vagem e brócolis)",
    "Carne Moída (Purê de batata doce, Grão de bico)",
    "Picadinho de Músculo (Arroz integral/branco, Vagem com cenoura)",
    "Filé de Frango Grelhado (Arroz integral/branco, Cenoura e brócolis)",
    "Lasanha de Abobrinha (Carne moída, arroz integral/branco, mix de legumes)" 
];

// ===========================================
// 2. DADOS DO CARDÁPIO PRINCIPAL (Kits e Produtos Avulsos)
// ===========================================
const produtos = [
    {
        id: 101,
        nome: "KIT 5 MARMITAS",
        descricao: "5x Marmitas de 400g. Escolha entre as 7 opções disponíveis. *Melhor custo-benefício!*",
        calorias: "R$ 26,80/unidade",
        preco: 134.00,
        imagem: "img/frangoGrelhado.jpg", // Substitua pelo seu caminho de imagem
        destaque: true
    },
    {
        id: 102,
        nome: "KIT 10 MARMITAS",
        descricao: "10x Marmitas de 400g. Escolha entre as 7 opções disponíveis. Entrega em duas datas diferentes!",
        calorias: "R$ 25,90/unidade",
        preco: 259.00,
        imagem: "img/lowCarb.jpg", // Substitua pelo seu caminho de imagem
        destaque: true
    },
    {
        id: 103,
        nome: "KIT 20 MARMITAS",
        descricao: "20x Marmitas de 400g. Escolha entre as 7 opções disponíveis. *Grande desconto!*",
        calorias: "R$ 24,90/unidade",
        preco: 498.00,
        imagem: "img/assadoCardapio.jpg", // Substitua pelo seu caminho de imagem
        destaque: false
    },
    {
        id: 201,
        nome: "LASANHA DE ABOBRINHA (Avulsa)",
        descricao: "Marmita Avulsa de Lasanha de abobrinha com carne moída. Pague no PIX e ganhe 5% OFF!",
        calorias: "Marmita de 400g",
        preco: 29.90,
        imagem: "img/pexinCardapio.png", // Substitua pelo seu caminho de imagem
        destaque: true
    }
];

// ===========================================
// 3. VARIÁVEIS E SELETORES
// ===========================================
let carrinho = [];
const VALOR_MINIMO_FRETE_GRATIS = 299.00; // Valor para ativar o Frete Grátis

const produtosMap = new Map(produtos.map(p => [p.id, p])); 

const listaProdutosEl = document.getElementById("listaProdutos");
const itensCarrinhoEl = document.getElementById("itensCarrinho");
const totalCarrinhoEl = document.getElementById("totalCarrinho");
const qtdCarrinhoEl = document.getElementById("qtdCarrinho");
const modalCarrinhoEl = document.getElementById("modalCarrinho");
const modalCheckoutEl = document.getElementById("modalCheckout");
const resumoDivEl = document.getElementById("resumoPedido");
const pagamentoSelectEl = document.getElementById("pagamento");
const freteAvisoEl = document.getElementById("freteGratisAviso"); // Novo seletor

// ===========================================
// 4. FUNÇÕES UTILITÁRIAS
// ===========================================

const formatarReal = valor => `R$ ${valor.toFixed(2).replace('.', ',')}`;

const toggleModal = (modal, show) => {
    modal.classList.toggle("show", show);
    modal.classList.toggle("oculto", !show);
};

// ===========================================
// 5. LÓGICA DO CARRINHO E FRETE
// ===========================================

function calcularTotal() {
    return carrinho.reduce((total, item) => total + (item.preco * item.quantidade), 0);
}

function updateCheckoutFreteAviso(totalCompra) {
    if (totalCompra >= VALOR_MINIMO_FRETE_GRATIS) {
        freteAvisoEl.classList.remove('oculto');
    } else {
        freteAvisoEl.classList.add('oculto');
    }
}


function adicionarAoCarrinho(produtoId) {
    const id = parseInt(produtoId);
    const produtoBase = produtosMap.get(id);

    if (!produtoBase) return;

    let itemCarrinho = carrinho.find(item => item.id === id);

    if (itemCarrinho) {
        itemCarrinho.quantidade++;
    } else {
        carrinho.push({ ...produtoBase, id: id, quantidade: 1 });
    }
    
    atualizarCarrinho();
    toggleModal(modalCarrinhoEl, true);
    animacaoBotao();
}

function removerItem(produtoId) {
    const id = parseInt(produtoId);
    const index = carrinho.findIndex(item => item.id === id);

    if (index > -1) {
        carrinho[index].quantidade--;
        if (carrinho[index].quantidade === 0) {
            carrinho.splice(index, 1); 
        }
    }
    atualizarCarrinho();
    animacaoBotao();
}

function atualizarCarrinho() {
    itensCarrinhoEl.innerHTML = "";
    let totalGeral = calcularTotal();
    let qtdTotal = 0;

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        qtdTotal += item.quantidade;

        const li = document.createElement("li");
        li.innerHTML = `
            ${item.nome} (x${item.quantidade}) - ${formatarReal(subtotal)}
            <button onclick="removerItem(${item.id})">❌</button>
        `;
        itensCarrinhoEl.appendChild(li);
    });

    totalCarrinhoEl.innerHTML = `<strong>Total:</strong> ${formatarReal(totalGeral)}`;
    qtdCarrinhoEl.textContent = qtdTotal;
    
    // AVISO: A lógica de Frete Grátis é chamada aqui também, para atualizar caso o valor mude no carrinho.
    updateCheckoutFreteAviso(totalGeral); 
}

function animacaoBotao() {
    qtdCarrinhoEl.style.transform = "scale(1.3)";
    setTimeout(() => {
        qtdCarrinhoEl.style.transform = "scale(1)";
    }, 200);
}

// ===========================================
// 6. RENDERIZAÇÃO E DETALHES VISUAIS
// ===========================================

function renderizarProdutos() {
    listaProdutosEl.innerHTML = '';
    
    // 1. Renderiza a tabela de Opções 
    listaProdutosEl.innerHTML += `
        <div class="opcoes-container">
            <h3>Nossas 7 Opções de Marmitas (400g)</h3>
            <ul class="lista-opcoes">
                ${opcoesMarmitas.map(opcao => `<li>✅ ${opcao}</li>`).join('')}
            </ul>
            <p class="aviso-kit">
                *As opções acima são para escolha **após** a compra de um Kit, via WhatsApp.*
                <br>Pedidos avulsos são apenas a Lasanha.
            </p>
        </div>
    `;

    // 2. Renderiza os Kits e Lasanha Avulsa 
    produtos.forEach((p, i) => {
        const div = document.createElement("div");
        div.setAttribute('data-id', p.id); 
        div.classList.add("produto");
        
        div.innerHTML = `
            ${p.destaque ? '<div class="selo">DESTAQUE</div>' : ''}
            <img src="${p.imagem}" alt="${p.nome}">
            <h3>${p.nome}</h3>
            <p class="descricao">${p.descricao}</p>
            <p class="calorias">${p.calorias}</p>
            <p class="preco-principal"><strong>${formatarReal(p.preco)}</strong></p>
            <button data-id="${p.id}">Adicionar ao Pedido</button>
        `;
        listaProdutosEl.appendChild(div);
        
        setTimeout(() => div.classList.add("show"), i * 200);
        
        div.querySelector("button").addEventListener("click", (e) => {
            const produtoId = e.target.getAttribute('data-id');
            adicionarAoCarrinho(produtoId);
        });
    });
}

// Inicializa a renderização
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    atualizarCarrinho();
});

// ===========================================
// 7. CHECKOUT E WHATSAPP
// ===========================================

document.getElementById("btnFinalizar").addEventListener("click", () => {
    const total = calcularTotal();
    if (total === 0) {
        alert("Seu carrinho está vazio! Adicione kits antes de finalizar.");
        return;
    }
    
    toggleModal(modalCarrinhoEl, false);
    toggleModal(modalCheckoutEl, true);
    
    const pagamento = pagamentoSelectEl.value;
    let resumoTexto = `*NOVO PEDIDO BOTANICFIT (KITS)*\n\n`;
    let resumoHTML = '<ul>';

    carrinho.forEach(item => {
        const subtotal = item.preco * item.quantidade;
        resumoTexto += `• ${item.nome} (x${item.quantidade}) - ${formatarReal(subtotal)}\n`;
        resumoHTML += `<li>${item.nome} (x${item.quantidade}) - ${formatarReal(subtotal)}</li>`;
    });
    
    resumoHTML += '</ul>';
    resumoHTML += `<p><strong>Total da Compra:</strong> ${formatarReal(total)}</p>`;
    
    // Lógica de Frete no Checkout
    if (total >= VALOR_MINIMO_FRETE_GRATIS) {
        resumoHTML += `<p style="color: green; font-weight: bold;">✅ Frete Grátis Atingido!</p>`;
        resumoTexto += `\n*FRETE:* GRÁTIS`;
    } else {
        resumoHTML += `<p>Taxa de entrega será adicionada ao total final.</p>`;
        resumoTexto += `\n*FRETE:* A calcular (Conforme região)`;
    }

    resumoHTML += `<p><strong>Pagamento:</strong> ${pagamento}</p>`;
    resumoHTML += `<p class="aviso-kit">**Após o envio, entraremos em contato para coletar as opções de marmita desejadas.**</p>`;

    resumoDivEl.innerHTML = resumoHTML;
    
    resumoTexto += `\n*TOTAL FINAL:* ${formatarReal(total)}\n*Pagamento:* ${pagamento}\n\n*Aguardando dados para entrega (Nome, Endereço e Opções de Marmita):*`;
    resumoDivEl.setAttribute('data-whatsapp-text', resumoTexto);
    
    // Garante que o aviso de frete dinâmico é exibido/ocultado corretamente
    updateCheckoutFreteAviso(total);
});

document.getElementById("btnConfirmar").addEventListener("click", () => {
    const telefone = "5561981801192";
    const textoCompleto = resumoDivEl.getAttribute('data-whatsapp-text');
    const link = `https://wa.me/${telefone}?text=${encodeURIComponent(textoCompleto)}`;
    window.open(link, "_blank");
});

document.getElementById("btnVoltar").addEventListener("click", () => {
    toggleModal(modalCheckoutEl, false);
    toggleModal(modalCarrinhoEl, true);
});

// Event Listeners Finais
document.getElementById("btnCarrinho").addEventListener("click", () => {
    atualizarCarrinho();
    toggleModal(modalCarrinhoEl, true);
});

document.getElementById("fecharCarrinho").addEventListener("click", () => {
    toggleModal(modalCarrinhoEl, false);
});

document.getElementById("toggleTheme").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});

document.getElementById("btnHero").addEventListener("click", () => {
    document.querySelector('.container').scrollIntoView({ behavior: 'smooth' });
});

[modalCarrinhoEl, modalCheckoutEl].forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) toggleModal(modal, false);
    });
});