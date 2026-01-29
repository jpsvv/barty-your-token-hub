

# 🎫 Plano de Implementação - Barty (App do Usuário)

## Visão Geral
Plataforma de venda de fichas digitais para estabelecimentos gastronômicos e eventos, permitindo compra antecipada e consumo flexível de produtos.

---

## 🎨 Design System
- **Tema:** Modo escuro como padrão com opção de modo claro
- **Cores principais:** Fundo escuro (#0D0D0D), acentos em laranja vibrante (#FF6B00) e dourado (#FFB800)
- **Tipografia:** Moderna e limpa
- **Componentes:** Cards com bordas sutis, botões arredondados, ícones minimalistas

---

## 📱 Telas e Funcionalidades

### 1. Autenticação
- Login com email/senha
- Cadastro de nova conta
- Login com Google
- Recuperação de senha
- Validação de campos

### 2. Home (Explorar)
- **Barra de busca** com seletor de cidade
- **Carrossel de favoritos** com logos dos estabelecimentos
- **Card Carteira Barty** com saldo e botão depositar
- **Lista de estabelecimentos** com:
  - Logo, nome, avaliação (estrelas)
  - Ticker de promoção
  - Botão favoritar (coração)
  - Ordenação por distância ou avaliação
- **Toggle modo claro/escuro**

### 3. Cardápio do Estabelecimento
- **Header:** Logo, imagem de fundo, nome, descrição
- **Informações:** Horário, formas de pagamento, endereço, CNPJ
- **Avaliações:** Nota média, ranking, comentários com respostas
- **Destaques:** Carrossel de produtos em destaque
- **Menu:** 
  - Navegação por categorias (carrossel + hamburger)
  - Lista de produtos com foto, nome, tempo de preparo, preço
  - Indicador de promoção (preço antigo riscado + desconto em verde)
- **Modal do produto:** Adicionais, observações, seletor de quantidade

### 4. Carrinho
- Lista de itens com foto, nome, tempo de preparo, valor
- Controle de quantidade (+ / -)
- Botão excluir item e limpar carrinho
- Valor total
- **Pop-up de conflito** (produtos de estabelecimentos diferentes)
- **Checkout:**
  - Seleção de forma de pagamento (Cartão, PIX, Dinheiro, Carteira Barty)
  - Resumo do pedido
  - Confirmação de pagamento

### 5. Minhas Fichas
- **Lista por estabelecimento** (colapsível)
- **Card de cada ficha:**
  - Nome do produto, valor, tempo médio de preparo
  - Status: Disponível / Enviar para preparo / Em produção
  - Cronômetro de tempo decorrido
  - Número do pedido
  - Validade da ficha
  - Botão encaminhar/presentear
- **Seleção múltipla** para gerar QR Code
- **Modal QR Code:**
  - Lista de fichas selecionadas
  - Alerta para produtos manufaturados
  - Fechamento automático após leitura pelo staff
- **Pop-up de confirmação** para enviar à produção (com aviso de expiração)
- **Aba Histórico:**
  - Fichas compradas (dia, estabelecimento, detalhes)
  - Fichas usadas/encaminhadas

### 6. Perfil
- **Dados da conta:** Nome, CPF, email, telefone
- **Pagamentos:**
  - Carteira Barty (saldo + depositar)
  - Cartões cadastrados (adicionar/remover)
  - Histórico de transações
- **Depositar:**
  - PIX (chave + copiar)
  - Cartão de crédito

---

## 🗄️ Backend (Lovable Cloud)

### Tabelas do Banco de Dados
- **profiles** - Dados do usuário
- **establishments** - Estabelecimentos/eventos
- **products** - Produtos dos estabelecimentos
- **categories** - Categorias de produtos
- **product_addons** - Adicionais dos produtos
- **tickets** - Fichas compradas pelos usuários
- **orders** - Pedidos/compras
- **favorites** - Estabelecimentos favoritos
- **wallet_transactions** - Transações da carteira
- **reviews** - Avaliações dos estabelecimentos
- **cities** - Cidades disponíveis

### Autenticação
- Supabase Auth com email/senha e Google OAuth

---

## 🔄 Fluxos Principais

1. **Explorar → Comprar:** Home → Selecionar estabelecimento → Cardápio → Adicionar produtos → Carrinho → Pagamento → Fichas geradas

2. **Usar Ficha (produto pronto):** Minhas Fichas → Selecionar fichas → Gerar QR Code → Staff lê → Fichas consumidas

3. **Usar Ficha (produto manufaturado):** Minhas Fichas → Enviar para produção → Acompanhar tempo → Selecionar fichas → Gerar QR Code → Retirar produto

4. **Presentear:** Minhas Fichas → Selecionar ficha → Encaminhar → Digitar telefone → Confirmar envio

---

## 📦 Dados de Demonstração
- 5+ estabelecimentos fictícios com logos e imagens
- Cardápios completos com categorias e produtos
- Promoções ativas
- Avaliações e comentários

