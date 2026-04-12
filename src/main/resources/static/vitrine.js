const API_URL = "https://loja-brinquedos-happykids.onrender.com/api/brinquedos";
const API_EQUIPE = "https://loja-brinquedos-happykids.onrender.com/api/equipe";
const API_CATEGORIAS = "https://loja-brinquedos-happykids.onrender.com/api/categorias";

// 1. INICIALIZAÇÃO
window.onload = () => {
    if (document.getElementById("gridDestaques")) {
        carregarDestaques();
    }
    if (document.getElementById("gridCatalogo")) {
        carregarCatalogo();
    }
    if (document.getElementById("gridEquipe")) {
        carregarEquipe();
    }
    if (document.getElementById("gridCategorias")) {
        carregarCategoriasVitrine();
    }
    if (document.getElementById("gridProdutosCategoria")) {
        carregarProdutosPorCategoria();
    }
    // NOVA VERIFICAÇÃO (Passo 4): Se estiver na página de Detalhes
    if (document.getElementById("produtoDetalhes")) {
        carregarDetalhesBrinquedo();
    }
};

// ==========================================
// FUNÇÕES DA HOME E CATÁLOGO GERAL
// ==========================================

async function carregarDestaques() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar dados do servidor");
        const brinquedos = await res.json();
        const grid = document.getElementById("gridDestaques");
        const destaques = brinquedos.filter(b => b.destaque === true);
        
        if (destaques.length === 0) {
            grid.innerHTML = "<p>Nenhum brinquedo em destaque no momento.</p>";
            return;
        }
        grid.innerHTML = destaques.map(item => criarCard(item)).join('');
    } catch (erro) {
        console.error("Erro ao carregar destaques:", erro);
        document.getElementById("gridDestaques").innerHTML = "<p>Erro ao carregar os brinquedos.</p>";
    }
}

async function carregarCatalogo() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar dados do servidor");
        const brinquedos = await res.json();
        const grid = document.getElementById("gridCatalogo");
        
        if (brinquedos.length === 0) {
            grid.innerHTML = "<p>Nenhum brinquedo cadastrado.</p>";
            return;
        }
        grid.innerHTML = brinquedos.map(item => criarCard(item)).join('');
    } catch (erro) {
        console.error("Erro ao carregar catálogo:", erro);
        document.getElementById("gridCatalogo").innerHTML = "<p>Erro ao carregar o catálogo.</p>";
    }
}

// ==========================================
// FUNÇÕES DAS CATEGORIAS
// ==========================================

async function carregarCategoriasVitrine() {
    try {
        const res = await fetch(API_CATEGORIAS);
        if (!res.ok) throw new Error("Erro ao buscar categorias");
        const categorias = await res.json();
        const grid = document.getElementById("gridCategorias");
        
        if (categorias.length === 0) {
            grid.innerHTML = "<p>Nenhuma categoria cadastrada no sistema.</p>";
            return;
        }

        grid.innerHTML = categorias.map(cat => `
            <div class="card" onclick="verProdutosDaCategoria(${cat.id}, '${cat.nomeCategoria}')" style="cursor: pointer; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <img src="${cat.imgCategoria || 'images/logo.png'}" alt="${cat.nomeCategoria}">
                <h3 style="margin-top: 15px; color: #2980b9;">${cat.nomeCategoria}</h3>
            </div>
        `).join('');
    } catch (erro) {
        console.error("Erro ao carregar categorias:", erro);
        document.getElementById("gridCategorias").innerHTML = "<p>Erro ao carregar as categorias.</p>";
    }
}

function verProdutosDaCategoria(idCategoria, nomeCategoria) {
    window.location.href = `produtos-categoria.html?id=${idCategoria}&nome=${encodeURIComponent(nomeCategoria)}`;
}

async function carregarProdutosPorCategoria() {
    const params = new URLSearchParams(window.location.search);
    const idCategoria = params.get('id');
    const nomeCategoria = params.get('nome');

    const titulo = document.getElementById("tituloCategoria");
    if (nomeCategoria) titulo.innerText = `Catálogo de Brinquedos :: ${nomeCategoria}`;

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar brinquedos");
        const todosBrinquedos = await res.json();
        const grid = document.getElementById("gridProdutosCategoria");
        
        const brinquedosFiltrados = todosBrinquedos.filter(b => b.categoria && b.categoria.id == idCategoria);

        if (brinquedosFiltrados.length === 0) {
            grid.innerHTML = `<p>Nenhum brinquedo encontrado na categoria "${nomeCategoria}".</p>`;
            return;
        }
        grid.innerHTML = brinquedosFiltrados.map(item => criarCard(item)).join('');
    } catch (erro) {
        console.error("Erro ao carregar produtos:", erro);
        document.getElementById("gridProdutosCategoria").innerHTML = "<p>Erro ao carregar os brinquedos.</p>";
    }
}

// ==========================================
// FUNÇÕES DA EQUIPE E AUXILIARES
// ==========================================

async function carregarEquipe() {
    try {
        const res = await fetch(API_EQUIPE);
        if (!res.ok) throw new Error("Erro ao buscar dados da equipe");
        const integrantes = await res.json();
        const grid = document.getElementById("gridEquipe");
        
        if (integrantes.length === 0) {
            grid.innerHTML = "<p>Nenhum integrante cadastrado no sistema.</p>";
            return;
        }

        grid.innerHTML = integrantes.map(pessoa => `
            <div class="card">
                <img src="${pessoa.foto || 'images/logo.png'}" alt="${pessoa.nome}" style="border-radius: 50%; width: 150px; height: 150px; object-fit: cover; margin: 0 auto 15px auto;">
                <h3>${pessoa.nome}</h3>
                <p class="categoria-tag">RGM: ${pessoa.rgm}</p>
            </div>
        `).join('');
    } catch (erro) {
        console.error("Erro ao carregar equipe:", erro);
        document.getElementById("gridEquipe").innerHTML = "<p>Erro ao carregar os dados da equipe.</p>";
    }
}

function criarCard(item) {
    const imagem = item.imagemUrl || 'images/logo.png'; 
    const nomeCategoria = item.categoria ? item.categoria.nomeCategoria : 'Sem categoria';
    
    return `
        <div class="card" style="cursor:pointer;" onclick="window.location.href='detalhes.html?id=${item.id}'">
            <img src="${imagem}" alt="${item.descricao}">
            <h3>${item.descricao}</h3>
            <p class="categoria-tag">${nomeCategoria}</p>
            <p class="price">R$ ${item.valor.toFixed(2)}</p>
        </div>
    `;
}

// ==========================================
// PASSO 4: CARREGAR DETALHES DO BRINQUEDO
// ==========================================

async function carregarDetalhesBrinquedo() {
    // Lê o ID que vem na URL (ex: detalhes.html?id=1)
    const params = new URLSearchParams(window.location.search);
    const idBrinquedo = params.get('id');

    if (!idBrinquedo) {
        document.getElementById("produtoDetalhes").innerHTML = "<p>Brinquedo não encontrado (ID ausente).</p>";
        return;
    }

    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao conectar ao servidor");
        
        const todosBrinquedos = await res.json();
        
        // Procura na lista o brinquedo que tem o ID exato
        const brinquedo = todosBrinquedos.find(b => b.id == idBrinquedo);

        if (!brinquedo) {
            document.getElementById("produtoDetalhes").innerHTML = "<p>O brinquedo não existe no catálogo.</p>";
            return;
        }

        const nomeCategoria = brinquedo.categoria ? brinquedo.categoria.nomeCategoria : 'Sem Categoria';

        // 1. Atualiza o título Breadcrumb (Página 4 do PDF)
        document.getElementById("breadcrumbDetalhe").innerText = `Catálogo de Brinquedos :: ${nomeCategoria} :: ${brinquedo.descricao}`;

        // 2. Preenche os dados nos campos
        document.getElementById("imgDetalhe").src = brinquedo.imagemUrl || 'images/logo.png';
        document.getElementById("descDetalhe").innerText = brinquedo.descricao;
        document.getElementById("codigoDetalhe").innerText = brinquedo.codigoDoBrinquedo || '-';
        document.getElementById("marcaDetalhe").innerText = brinquedo.marca || '-';
        document.getElementById("valorDetalhe").innerText = `R$ ${brinquedo.valor.toFixed(2)}`;
        document.getElementById("textoDetalhes").innerText = brinquedo.detalhes || 'Sem detalhes adicionais.';

    } catch (erro) {
        console.error("Erro ao carregar detalhes:", erro);
        document.getElementById("produtoDetalhes").innerHTML = "<p>Erro ao carregar os detalhes do brinquedo.</p>";
    }
}