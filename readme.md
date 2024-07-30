# Projeto de Lembretes e Observações

Este projeto é um sistema de gerenciamento de lembretes e observações distribuído, com um barramento de eventos para comunicação entre microserviços. O sistema é dividido em quatro microserviços principais:

1. **Barramento de Eventos**
2. **Consulta**
3. **Lembretes**
4. **Observações**

## Microserviço de Barramento de Eventos

O barramento de eventos distribui eventos para os microserviços relevantes.

- **Endpoint POST `/eventos`**: Recebe eventos e os distribui para os microserviços de lembretes, observações e consulta.

**Porta**: 10000

### Funcionamento

Quando um evento é recebido, o barramento o distribui para os seguintes microserviços:

- **Lembretes** (porta 4000)
- **Observações** (porta 5000)
- **Consulta** (porta 6000)

Isso permite que todos os microserviços sejam atualizados com as alterações em tempo real.

## Microserviço de Consulta

O microserviço de consulta é responsável por armazenar e consultar lembretes e observações. Ele mantém um banco de dados em memória que associa lembretes às suas observações.

- **Endpoint GET `/lembretes`**: Retorna todos os lembretes armazenados.
- **Endpoint POST `/eventos`**: Recebe eventos do barramento e atualiza o banco de dados de lembretes e observações com base nos tipos de eventos recebidos.

**Porta**: 6000

### Funcionamento

Quando um evento do tipo `LembreteCriado` ou `ObservacaoCriada` é recebido, o microserviço atualiza seu banco de dados em memória (`baseConsulta`) com as informações fornecidas. Isso permite que o serviço responda a consultas sobre os lembretes e suas observações associadas.

- **LembreteCriado**: Adiciona um novo lembrete ao banco de dados.
- **ObservacaoCriada**: Adiciona uma nova observação a um lembrete existente.

## Microserviço de Lembretes

O microserviço de lembretes é responsável por criar e listar lembretes.

- **Endpoint POST `/lembretes`**: Cria um novo lembrete. Envia um evento para o barramento de eventos com o tipo `LembreteCriado`.
- **Endpoint GET `/lembretes`**: Lista todos os lembretes existentes.

**Porta**: 4000

### Funcionamento

Quando um novo lembrete é criado, o microserviço envia um evento para o barramento de eventos. Esse evento é então distribuído para os outros microserviços para garantir que todos os componentes do sistema estejam atualizados.

## Microserviço de Observações

O microserviço de observações gerencia as observações associadas a lembretes.

- **Endpoint POST `/lembretes/:id/observacoes`**: Adiciona uma nova observação a um lembrete. Envia um evento para o barramento de eventos com o tipo `ObservacaoCriada`.
- **Endpoint GET `/lembretes/:id/observacoes`**: Lista todas as observações associadas a um lembrete específico.

**Porta**: 5000

### Funcionamento

Quando uma nova observação é adicionada, o microserviço envia um evento para o barramento de eventos. Esse evento é então distribuído para os microserviços relevantes para garantir que as observações sejam corretamente associadas aos lembretes e armazenadas.

## Como Executar

Para executar o projeto, siga estas etapas:

1. **Clone o repositório**

   Primeiro, clone o repositório para sua máquina local:

   ```bash
   git clone <URL do repositório>
   cd <diretório do projeto>


2. **Instale as dependências**

   **Lembretes:** </br>
   cd lembretes </br>
   npm install

   **Observacoes:** </br>
   cd ../observacoes <br>
   npm install

   **Barramento de Eventos:** </br>
   cd ../barramento-de-eventos </br>
   npm install

   **Consulta:** </br>
   cd ../consulta </br>
   npm install


4. **Inicie os microserviços** </br>
   Em terminais separados, inicie cada microserviço na sua respectiva porta:

   **Lembretes (porta 4000):** </br>
   cd lembretes </br>
   npm start

   **Observacoes (porta 5000):** </br>
   cd ../observacoes </br>
   npm start

   **Barramento de Eventos (porta 10000):** </br>
   cd ../barramento-de-eventos </br>
   npm start

   **Consulta (porta 6000):** </br>
   cd ../consulta </br>
   npm start

5. **Teste a API** </br>
   Utilize ferramentas como Thunder Client ou Postman para enviar requisições HTTP e testar os endpoints dos microserviços. </br>
   Certifique-se de que cada microserviço está funcionando corretamente e interagindo com o barramento de eventos como esperado.

   
   



