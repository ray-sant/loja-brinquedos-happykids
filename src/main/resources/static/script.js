const API_URL = "http://localhost:8080/api/brinquedos";

// 1. Carregar a lista assim que a página abre
window.onload = () => {
    listar();
};

// 2. Função para buscar os dados no Java e preencher a tabela
async function listar() {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error("Erro ao buscar dados");
        
        const dados = await res.json();
        const corpoTabela = document.getElementById("listaBrinquedos");
        
        corpoTabela.innerHTML = dados.map(item => `
            <tr>
                <td>${item.id}</td>
                <td>${item.descricao}</td>
                <td>${item.categoria}</td>
                <td>R$ ${item.valor.toFixed(2)}</td>
                <td>
                    <button class="btn-delete" onclick="excluir(${item.id})">Excluir</button>
                </td>
            </tr>
        `).join('');
    } catch (erro) {
        console.error("Erro ao listar:", erro);
    }
}

// 3. Função para salvar um novo brinquedo
async function salvar() {
    console.log("Tentando salvar dados...");

    const item = {
        descricao: document.getElementById("descricao").value,
        categoria: document.getElementById("categoria").value,
        marca: document.getElementById("marca").value,
        valor: parseFloat(document.getElementById("valor").value),
        imagemUrl: document.getElementById("imagemUrl").value
    };

    // Validação básica
    if (!item.descricao || isNaN(item.valor)) {
        alert("Por favor, preencha a Descrição e o Valor corretamente.");
        return;
    }

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item)
        });

        if (res.ok) {
            alert("Brinquedo salvo com sucesso!");
            limparFormulario();
            listar(); // Recarrega a tabela
        } else {
            alert("Erro ao salvar no servidor.");
        }
    } catch (erro) {
        console.error("Erro ao salvar:", erro);
        alert("Não foi possível conectar ao servidor Java.");
    }
}

// 4. Função para excluir um brinquedo
async function excluir(id) {
    if (confirm("Deseja realmente excluir este brinquedo?")) {
        try {
            const res = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert("Brinquedo excluído!");
                listar(); // Recarrega a tabela para sumir o item
            } else {
                alert("Erro ao excluir do servidor.");
            }
        } catch (erro) {
            console.error("Erro ao excluir:", erro);
            alert("Erro de conexão.");
        }
    }
}

// 5. Função auxiliar para limpar os campos após salvar
function limparFormulario() {
    document.getElementById("descricao").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("marca").value = "";
    document.getElementById("valor").value = "";
    document.getElementById("imagemUrl").value = "";
}