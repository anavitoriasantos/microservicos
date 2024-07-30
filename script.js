const baseURL = 'http://localhost:4000'; // URL do microserviço de lembretes

async function adicionarLembrete() {
    const texto = document.getElementById('textoLembrete').value;

    try {
        const response = await fetch(`${baseURL}/lembretes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ texto })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const lembrete = await response.json();
        console.log('Lembrete adicionado:', lembrete);
        atualizarLembretes(); // Atualiza a lista de lembretes após adicionar
    } catch (error) {
        console.error('Erro ao adicionar lembrete:', error);
    }
}

async function atualizarLembretes() {
    try {
        const response = await fetch(`${baseURL}/lembretes`);
        
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const lembretes = await response.json();
        const lembretesDiv = document.getElementById('lembretes');
        lembretesDiv.innerHTML = '';

        for (const id in lembretes) {
            const lembrete = lembretes[id];
            lembretesDiv.innerHTML += `
                <div class="lembrete">
                    ID: ${lembrete.contador} - Texto: ${lembrete.texto}
                    <button onclick="mostrarObservacoes(${lembrete.contador})">Ver Observações</button>
                </div>`;
        }
    } catch (error) {
        console.error('Erro ao atualizar lembretes:', error);
    }
}

async function adicionarObservacao() {
    const idLembrete = document.getElementById('idLembreteObservacoes').value; // Usando o ID atualizado
    const texto = document.getElementById('textoObservacao').value;

    if (!idLembrete) {
        console.error('ID do lembrete não fornecido.');
        return;
    }

    if (!texto) {
        console.error('Texto da observação não fornecido.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/lembretes/${idLembrete}/observacoes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ texto })
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Observação adicionada:', data);
        verObservacoes(); // Atualiza a visualização das observações após adicionar
    } catch (error) {
        console.error('Erro ao adicionar observação:', error);
    }
}


async function mostrarObservacoes(idLembrete) {
    if (!idLembrete) {
        console.error('ID do lembrete não definido.');
        return;
    }
    
    document.getElementById('idLembreteObservacoes').value = idLembrete;
    await verObservacoes(); // Adicionado 'await' para garantir que as observações sejam carregadas
}

async function verObservacoes() {
    // Obtenha o ID do lembrete
    const idLembrete = document.getElementById('idLembreteObservacoes').value.trim();
    console.log('ID do lembrete:', idLembrete); // Verifique o ID no console

    if (!idLembrete) {
        console.error('ID do lembrete não fornecido.');
        document.getElementById('observacoes').innerHTML = 'Por favor, insira um ID de lembrete.';
        return;
    }

    try {
        // Requisição para o endpoint de observações
        const response = await fetch(`http://localhost:5000/lembretes/${idLembrete}/observacoes`);
        console.log('Resposta da requisição:', response); // Verifique a resposta da requisição

        if (!response.ok) {
            if (response.status === 404) {
                console.error('Nenhuma observação encontrada para o ID fornecido.');
                document.getElementById('observacoes').innerHTML = 'Nenhuma observação encontrada para o ID fornecido.';
            } else {
                throw new Error(`Erro ao buscar observações: ${response.status} ${response.statusText}`);
            }
            return;
        }

        // Verifique se o conteúdo está no formato JSON
        const observacoes = await response.json();
        console.log('Observações recebidas:', observacoes); // Verifique as observações recebidas

        const observacoesDiv = document.getElementById('observacoes');
        observacoesDiv.innerHTML = '';

        if (!Array.isArray(observacoes) || observacoes.length === 0) {
            observacoesDiv.innerHTML = 'Nenhuma observação encontrada para o ID fornecido.';
        } else {
            observacoes.forEach(obs => {
                // Certifique-se de que obs.id e obs.texto existem e são válidos
                observacoesDiv.innerHTML += `<div class="observacao">ID: ${obs.id} - Texto: ${obs.texto}</div>`;
            });
        }
    } catch (error) {
        console.error('Erro ao buscar observações:', error);
        document.getElementById('observacoes').innerHTML = 'Ocorreu um erro ao buscar observações.';
    }
}


// Atualiza a lista de lembretes ao carregar a página
window.onload = atualizarLembretes;




