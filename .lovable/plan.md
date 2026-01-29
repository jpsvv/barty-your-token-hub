

# Plano de Correções - Barty App

## Resumo das Alterações

Foram identificados 3 problemas que precisam ser corrigidos:

1. **Histórico incompleto** - Falta o histórico de utilização e encaminhamento de fichas
2. **Botão Presentear restrito** - Só aparece para fichas que não precisam de preparo
3. **Saudação ausente** - Falta a mensagem "Olá, [nome]" na Home

---

## Correção 1: Histórico Completo na Aba Fichas

### Situação Atual
O histórico mostra apenas as **compras** (orders), mas não mostra quando as fichas foram **utilizadas** ou **presenteadas**.

### Solução
Reorganizar a aba Histórico em duas seções:
- **Fichas Compradas**: Lista de compras com detalhes (já existe)
- **Fichas Usadas/Encaminhadas**: Nova seção mostrando fichas com status `used` ou `gifted`

### Alterações em `src/pages/Tickets.tsx`
- Adicionar filtro para fichas usadas (`status === 'used'`)
- Adicionar filtro para fichas encaminhadas (`status === 'gifted'`)
- Criar nova seção na TabsContent "history" com duas sub-abas ou seções colapsáveis:
  - Compras (existente)
  - Utilizações/Encaminhamentos (novo)
- Exibir para cada ficha usada/encaminhada:
  - Nome do produto
  - Estabelecimento
  - Data/hora da utilização ou encaminhamento
  - Número do pedido
  - Para fichas encaminhadas: telefone de destino

---

## Correção 2: Botão Presentear para Todas as Fichas Disponíveis

### Situação Atual
No componente `TicketCard`, o botão "Presentear" só aparece quando:
```tsx
{isAvailable && !needsProduction && (...)}
```

Isso exclui fichas de produtos que precisam de preparo.

### Solução
Alterar a condição para mostrar o botão "Presentear" para **todas** as fichas com status `available`, independente de precisarem de preparo ou não.

### Alteração em `src/pages/Tickets.tsx`
Modificar a lógica do botão Presentear (linhas 148-161):

**De:**
```tsx
{isAvailable && !needsProduction && (
  <Button ...>Presentear</Button>
)}
```

**Para:**
```tsx
{isAvailable && (
  <Button ...>Presentear</Button>
)}
```

O layout será ajustado para mostrar ambos os botões ("Enviar para preparo" e "Presentear") lado a lado quando aplicável.

---

## Correção 3: Saudação Personalizada na Home

### Situação Atual
O header mostra apenas "Barty" sem saudação ao usuário.

### Solução
Adicionar uma linha de saudação abaixo do título quando o usuário estiver logado.

### Alteração em `src/pages/Home.tsx`
No header (linhas 59-62), adicionar após o título:

```tsx
<div>
  <h1 className="text-2xl font-bold text-gradient">Barty</h1>
  {isAuthenticated && user && (
    <p className="text-sm text-muted-foreground">Olá, {user.name.split(' ')[0]}</p>
  )}
</div>
```

Isso mostrará apenas o primeiro nome do usuário para uma saudação mais amigável.

---

## Detalhes Técnicos

### Estrutura do Histórico Atualizado

```text
Histórico
  |
  +-- Compras (seção existente)
  |     Lista de orders com detalhes
  |
  +-- Fichas Utilizadas (nova seção)
  |     - Fichas com status 'used'
  |     - Data/hora de usedAt
  |     - Nº do pedido
  |
  +-- Fichas Encaminhadas (nova seção)
        - Fichas com status 'gifted'
        - Telefone destino (giftedTo)
        - Data/hora
```

### Arquivos a Serem Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/Tickets.tsx` | Adicionar seções de histórico de uso/encaminhamento; Ajustar condição do botão Presentear |
| `src/pages/Home.tsx` | Adicionar saudação "Olá, [nome]" no header |

---

## Resultado Esperado

Após as correções:

1. O usuário verá no Histórico tanto as compras quanto quando utilizou ou presenteou cada ficha
2. Todas as fichas disponíveis terão a opção de Presentear, mesmo as que precisam de preparo
3. A Home mostrará "Olá, Maria" (ou o nome do usuário) abaixo do título "Barty"

