
# Plano - Exibir Validade da Ficha no Cardápio

## Resumo

Adicionar a informação de validade da ficha no modal de detalhes do produto (Drawer) na página do estabelecimento, para que o usuário saiba quando a ficha expira antes de fazer a compra.

---

## Alteração Necessária

### Arquivo: `src/pages/EstablishmentPage.tsx`

#### 1. Criar função para formatar texto de validade

Adicionar uma função helper que converte a configuração de validade em texto legível:

```typescript
const getValidityText = () => {
  if (!establishment) return '';
  const validity = establishment.ticketValidity;
  
  switch (validity.type) {
    case 'same_day':
      return 'Válido apenas no dia da compra';
    case 'fixed_date':
      const date = new Date(validity.fixedDate + 'T00:00:00');
      return `Válido até ${date.toLocaleDateString('pt-BR')}`;
    case 'days':
    default:
      return `Válido por ${validity.days || 30} dias após a compra`;
  }
};
```

#### 2. Exibir no modal do produto

Adicionar abaixo do preço no Drawer do produto, junto às informações de tempo de preparo:

```tsx
<div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
  <Calendar className="h-4 w-4" />
  {getValidityText()}
</div>
```

#### 3. Importar ícone Calendar

Adicionar `Calendar` na lista de imports do lucide-react.

---

## Visual do Resultado

No modal do produto, abaixo do nome e tempo de preparo, aparecerá:

```
📅 Válido por 30 dias após a compra
```

Ou para eventos:
```
📅 Válido até 22/02/2025
```

Ou para estabelecimentos com validade no mesmo dia:
```
📅 Válido apenas no dia da compra
```

---

## Detalhes Técnicos

| Localização no código | Alteração |
|----------------------|-----------|
| Linha 3-6 | Adicionar `Calendar` no import |
| Após linha 144 | Adicionar função `getValidityText()` |
| Linhas 398-401 | Adicionar linha com ícone e texto de validade |

---

## Arquivos a Serem Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/pages/EstablishmentPage.tsx` | Adicionar função de formatação e exibir validade no modal |
