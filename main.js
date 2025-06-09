// Variáveis globais para os elementos do DOM
const menu = document.getElementById('menu');
const formEstacionar = document.getElementById('form-estacionar');
const btnEstacionar = document.getElementById('btn-estacionar');
const nomeInput = document.getElementById('nome-input');
const placaInput = document.getElementById('placa-input');

const listaCompleta = document.getElementById('lista-completa');
const formDevolver = document.getElementById('form-devolver');
const formLocalizar = document.getElementById('form-localizar');
const inputBusca = document.getElementById('input-busca');
const resultadoBusca = document.getElementById('resultado-busca');
const btnLocalizar = document.getElementById('btn-localizar');

// Array para armazenar os carros estacionados
let carros = [];
let modoDevolucaoAtivo = false;

/**
 * Função para formatar a data e hora atual
 * @returns {string} Data e hora formatadas
 */
function formatarDataHora() {
    const agora = new Date();
    return `${agora.toLocaleDateString()} ${agora.toLocaleTimeString()}`;
}

// Event listener para o menu de seleção
menu.addEventListener('change', function () {
    const opcao = this.value;

    // Oculta todos os formulários
    formEstacionar.style.display = 'none';
    listaCompleta.style.display = 'none';
    formDevolver.style.display = 'none';
    formLocalizar.style.display = 'none';
    modoDevolucaoAtivo = false;

    // Mostra o formulário correspondente à opção selecionada
    if (opcao === 'estacionar') {
        formEstacionar.style.display = 'flex';
    } else if (opcao === 'listar') {
        listaCompleta.style.display = 'block';
        mostrarLista('listar');
    } else if (opcao === 'devolver') {
        formDevolver.style.display = 'block';
        listaCompleta.style.display = 'block';
        modoDevolucaoAtivo = true;
        mostrarLista('devolver');
    } else if (opcao === 'localizar') {
        formLocalizar.style.display = 'flex';
    }
});

// Event listener para o botão de estacionar
btnEstacionar.addEventListener('click', function () {
    const nome = nomeInput.value.trim();
    const placa = placaInput.value.trim().toUpperCase();

    // Validação dos campos
    if (!nome || !placa) {
        alert("Preencha todos os campos");
        return;
    }

    // Verifica se o carro já está estacionado
    if (carros.some(c => c.placa === placa)) {
        alert("Esse carro já está estacionado!");
        return;
    }

    // Adiciona o carro ao array com a data/hora atual
    const dataHora = formatarDataHora();
    carros.push({ nome, placa, dataHora });
    nomeInput.value = '';
    placaInput.value = '';
    alert("Carro estacionado com sucesso!");
});

/**
 * Função para mostrar a lista de carros
 * @param {string} contexto - Define o contexto (listar ou devolver)
 */
function mostrarLista(contexto) {
    listaCompleta.innerHTML = '<h3>Carros Estacionados:</h3>';
    
    // Cabeçalho da lista
    listaCompleta.innerHTML += `
        <div class="lista-header">
            <span>Placa</span>
            <span>Proprietário</span>
            <span>Data/Hora</span>
            <span>Ações</span>
        </div>
    `;

    // Verifica se há carros estacionados
    if (carros.length === 0) {
        listaCompleta.innerHTML += '<p>Nenhum carro estacionado.</p>';
        return;
    }

    // Preenche a lista com os carros
    carros.forEach((carro, index) => {
        let botoes = '';
        
        // Define os botões de acordo com o contexto
        if (contexto === 'listar') {
            botoes = `<button class="btn-copiar" onclick="copiarPlaca('${carro.placa}')">Copiar Placa</button>`;
        } else if (contexto === 'devolver') {
            botoes = `<button class="btn-devolver" onclick="devolverCarro(${index})">Devolver</button>`;
        }

        // Adiciona o item à lista
        listaCompleta.innerHTML += `
            <div class="lista-item">
                <span>${carro.placa}</span>
                <span>${carro.nome}</span>
                <span>${carro.dataHora}</span>
                <span>${botoes}</span>
            </div>
        `;
    });
}

/**
 * Função para copiar a placa para a área de transferência
 * @param {string} placa - Placa do carro a ser copiada
 */
function copiarPlaca(placa) {
    navigator.clipboard.writeText(placa).then(() => {
        alert(`Placa ${placa} copiada para a área de transferência.`);
    });
}

/**
 * Função para devolver um carro
 * @param {number} index - Índice do carro no array
 */
function devolverCarro(index) {
    const { placa, nome } = carros[index];
    if (confirm(`Deseja devolver o carro ${placa} de ${nome}?`)) {
        carros.splice(index, 1);
        mostrarLista('devolver');
    }
}

// Event listener para o botão de localizar
btnLocalizar.addEventListener('click', () => {
    const busca = inputBusca.value.trim().toLowerCase();
    resultadoBusca.innerHTML = '';

    // Filtra os carros pelo termo de busca
    const encontrados = carros.filter(carro =>
        carro.nome.toLowerCase().includes(busca) ||
        carro.placa.toLowerCase().includes(busca)
    );

    // Exibe os resultados
    if (encontrados.length === 0) {
        resultadoBusca.innerHTML = '<p>Nenhum carro encontrado.</p>';
    } else {
        encontrados.forEach(carro => {
            resultadoBusca.innerHTML += `
                <div>
                    <strong>${carro.placa}</strong> - ${carro.nome}<br>
                    <small>Estacionado em: ${carro.dataHora}</small>
                </div>
            `;
        });
    }
});