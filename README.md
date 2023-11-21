# Projeto final módulo Javascript

## Instrução de para rodar o projeto

1. **Execute o comando na raiz do projeto **

```http
npm install
```

2. **Execute o comando **

```http
npm start
```

## Descrição do desafio

### O que?

Desenvolver, utilizando os conceitos abordados ao longo do módulo, uma aplicação de lista de tarefas (ToDo List).

### Requisitos

Dentre as funcionalidades, espera-se que seja possível:

- Adicionar uma tarefa (id, titulo e descrição)
- Editar uma tarefa salva (titulo e descrição)
- Remover uma tarefa salva
- Listar todas as tarefas salvas
- ## Obter uma tarefa, através de um parâmetro (id)

### Validações

- A tarefa não pode ter titulo e descrição vazios.
- O título não deve conter apenas números
- O titulo deve ter no mínimo 4 caracteres.
- A descrição deve ter no mínimo 20 caracteres.
- Não deve haver tarefas com o título duplicado.

## Extra 1

Adicionar a lógica de categoria nas tarefas, com isso as funcionalidades e campos mudam para:

- Adicionar uma tarefa (id, titulo, descrição e categoria)
- Editar uma tarefa salva (titulo, descrição e categoria)
- Listar tarefas de uma categoria em especifico
- Categoria é um campo opcional

### Todas a validações anteriores +

- Categoria deve ter no mínimo 5 caracteres

## Extra 2

Adicionar a lógica de vencimento nas tarefas, com isso as funcionalidades e campos mudam para:

- Adicionar uma tarefa (id, titulo, descrição, categoria e vencimento)
- Editar uma tarefa salva (titulo, descrição, categoria e vencimento)
- Listar tarefas com um campo booleano (vencido) para mostrar se a tarefa está ou não vencida
- Listar tarefas vencidas
- Listar tarefas não vencidas

### Todas a validações anteriores +

- Campo vencimento não pode ser menor que a data de hoje (momento do cadastro/edição)

## Extra 3

Adicionar totalizadores (uma função que retorna as seguintes informações)

- Quantidade de tarefas na aplicação
- Quantidade de tarefas sem categoria
- Quantidade de tarefas por categoria
- Quantidade de tarefas sem vencimento
- Quantidade de tarefas vencidas
- Quantidade de tarefas no prazo

## Extra 4

Adicionar lógica `soft delete` com isso as funcionalidades e campos mudam para:

- Adicionar uma tarefa (id, titulo, descrição, categoria, vencimento, removido)
- Listar tarefas removidas
- Recuperar tarefa removida

### Todas a validações anteriores +

- Campo removido deve ser padrão `false`, ao remover uma tarefa esse campo é alterado, assim não sendo mais listado apenas na funcionalidade especifica de listagem de tarefas removidas
