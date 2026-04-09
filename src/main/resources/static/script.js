const API_URL = "http://localhost:8080/api/brinquedos";
const API_CATEGORIAS = "http://localhost:8080/api/categorias";

// Variável global para armazenar a lista na tela de Administração
let brinquedosAtuais = [];

// Função auxiliar para converter arquivo em String Base64 (Para o Upload de Fotos)
function lerArquivoImagem(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
}

// =========================================================================
// 1. INICIALIZAÇÃO (Descobre em qual página estamos)
// =========================================================================
window.onload = () => {
    // Se a página tiver o formulário de categorias (Página de ADMINISTRAÇÃO)
    if (document.getElementById("categoria")) {
        carregarCategorias();
    }
    
    // Se a página tiver a tabela (Página de ADMINISTRAÇÃO)
    if (document.getElementById("listaBrinquedos")) {
        listar();
    }
    
    // Se a página tiver o grid de destaques (Página HOME)
    if (document.getElementById("gridDestaques")) {
        carregarDestaques();
    }
    
    // Se a página tiver o grid de catálogo (Página CATÁLOGO)
    if (document.getElementById("gridCatalogo")) {
        carregarCatalogo();
    }
};

/* =========================================================================
   ======================= FUNÇÕES DA ADMINISTRAÇÃO ========================
   ========================================================================= */

// Buscar as categorias e preencher o <select> no formulário
async function carregarCategorias() {
    try {
        const res = await fetch(API_CATEGORIAS);
        const categorias = await res.json();
        const select = document.getElementById("categoria");
        
        if (select) {
            select.innerHTML = '<option value="">Selecione uma Categoria</option>';
            categorias.forEach(cat => {
                select.innerHTML += `<option value="${cat.id}">${cat.nomeCategoria}</option>`;
            });
        }
    } catch (erro) {
        console.error("Erro ao carregar categorias no select:", erro);
    }
}

// Buscar os dados e preencher a tabela de administração (Incluindo miniatura da foto)
async function listar() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar dados");

        brinquedosAtuais = await res.json();
        const corpoTabela = document.getElementById("listaBrinquedos");

        if (corpoTabela) {
            corpoTabela.innerHTML = brinquedosAtuais.map(item => `
                <tr>
                    <td>
                        <img src="${item.imagemUrl || 'images/logo.png'}" 
                             style="width:40px; height:40px; object-fit:cover; border-radius:4px;" 
                             onerror="this.src='images/logo.png'">
                    </td>
                    <td>${item.codigoDoBrinquedo || '-'}</td>
                    <td>${item.descricao}</td>
                    <td>${item.categoria ? item.categoria.nomeCategoria : '-'}</td>
                    <td>R$ ${parseFloat(item.valor).toFixed(2)}</td>
                    <td>
                        <button style="background: #f39c12; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; margin-right: 5px;" onclick="prepararEdicao(${item.id})">Editar</button>
                        <button style="background: #e74c3c; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;" onclick="excluir(${item.id})">Excluir</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (erro) {
        console.error("Erro ao listar:", erro);
    }
}

// Salvar (Serve tanto para Criar novo como para Editar)
async function salvar() {
    console.log("Tentando salvar dados...");
    try {
        const id = document.getElementById("brinquedoId").value;
        const categoriaId = document.getElementById("categoria").value;
        const arquivoInput = document.getElementById("imagemArquivo");

        // Validação básica
        if (!document.getElementById("descricao").value || !categoriaId) {
            alert("Por favor, preencha a Descrição e a Categoria.");
            return;
        }

        // Lógica de Imagem: Pega o que está no campo oculto ou converte o novo arquivo
        let imagemFinal = document.getElementById("imagemUrl").value;
        if (arquivoInput && arquivoInput.files.length > 0) {
            imagemFinal = await lerArquivoImagem(arquivoInput.files[0]);
        }

        // Montar o objeto para enviar ao Java (exatamente igual ao Modelo do Backend)
        const item = {
            codigoDoBrinquedo: document.getElementById("codigo").value,
            descricao: document.getElementById("descricao").value,
            categoria: { id: parseInt(categoriaId) },
            marca: document.getElementById("marca").value,
            valor: parseFloat(document.getElementById("valor").value) || 0,
            imagemUrl: imagemFinal,
            destaque: document.getElementById("destaque").checked,
            detalhes: document.getElementById("detalhes").value
        };

        const metodo = id ? 'PUT' : 'POST';
        const urlFinal = id ? `${API_URL}/${id}` : API_URL;

        const res = await fetch(urlFinal, {
            method: metodo,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        if (res.ok) {
            alert(id ? "Brinquedo atualizado com sucesso!" : "Brinquedo salvo com sucesso!");
            cancelarEdicao(); // Limpa e volta ao estado normal
            listar(); // Recarrega a tabela
        } else {
            alert("Erro ao salvar no servidor. Verifique se a imagem não é grande demais.");
        }
    } catch (erro) {
        console.error("Erro ao salvar:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
}

// Função para excluir um brinquedo
async function excluir(id) {
    if (confirm("Deseja realmente excluir este brinquedo?")) {
        try {
            const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            if (res.ok) {
                alert("Brinquedo excluído!");
                listar();
            } else {
                alert("Erro ao excluir do servidor.");
            }
        } catch (erro) {
            console.error("Erro ao excluir:", erro);
            alert("Erro de conexão.");
        }
    }
}

// Preparar o formulário para Edição
function prepararEdicao(id) {
    const item = brinquedosAtuais.find(b => b.id === id);
    if (!item) return;

    document.getElementById("tituloFormulario").innerText = "Editar Brinquedo";
    document.getElementById("brinquedoId").value = item.id;

    // Bloqueia o código do brinquedo na edição para evitar duplicatas
    const inputCodigo = document.getElementById("codigo");
    inputCodigo.value = item.codigoDoBrinquedo || '';
    inputCodigo.readOnly = true;
    inputCodigo.style.backgroundColor = "#e9ecef";

    document.getElementById("descricao").value = item.descricao || '';
    document.getElementById("categoria").value = item.categoria ? item.categoria.id : '';
    document.getElementById("marca").value = item.marca || '';
    document.getElementById("valor").value = item.valor || '';
    document.getElementById("imagemUrl").value = item.imagemUrl || ''; 
    document.getElementById("destaque").checked = item.destaque || false;
    document.getElementById("detalhes").value = item.detalhes || '';

    document.getElementById("btnSalvar").innerText = "SALVAR EDIÇÃO";
    document.getElementById("btnCancelar").style.display = "block";
    window.scrollTo(0, 0); // Sobe a página para o usuário ver o formulário
}

// Cancelar edição e limpar tudo
function cancelarEdicao() {
    document.getElementById("tituloFormulario").innerText = "Novo Brinquedo";
    document.getElementById("brinquedoId").value = "";

    const inputCodigo = document.getElementById("codigo");
    inputCodigo.value = "";
    inputCodigo.readOnly = false;
    inputCodigo.style.backgroundColor = "#fff";

    document.getElementById("descricao").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("imagemUrl").value = "";
    document.getElementById("imagemArquivo").value = ""; 
    document.getElementById("destaque").checked = false;
    document.getElementById("detalhes").value = "";

    document.getElementById("btnSalvar").innerText = "SALVAR DADOS";
    document.getElementById("btnCancelar").style.display = "none";
}

/* =========================================================================
   =================== FUNÇÕES DA VITRINE (HOME / CATÁLOGO) ==================
   ========================================================================= */

// Função que será executada na página Home (gridDestaques)
async function carregarDestaques() {
    console.log("Aqui você pode carregar os brinquedos da Home Page.");
}

// Função que será executada na página Catálogo (gridCatalogo)
async function carregarCatalogo() {
    console.log("Aqui você pode carregar todos os brinquedos do catálogo.");
}