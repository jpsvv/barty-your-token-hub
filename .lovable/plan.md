
# Plano de Correção - Validade Configurável das Fichas

## Resumo

Atualmente, todas as fichas têm validade fixa de 30 dias após a compra. A correção permite que cada estabelecimento/evento defina a validade das fichas de seus produtos, podendo ser:
- Validade para o mesmo dia (ex: eventos de um dia)
- Validade para uma data específica (ex: festival de 3 dias)
- Validade em dias a partir da compra (ex: 7 dias, 30 dias)

---

## Alterações Necessárias

### 1. Atualizar Tipos (`src/types/index.ts`)

Adicionar campo de configuração de validade no `Establishment`:

```typescript
export interface Establishment {
  // ... campos existentes ...
  
  // Configuração de validade das fichas
  ticketValidity: {
    type: 'days' | 'fixed_date' | 'same_day';
    days?: number;        // Se type === 'days': quantidade de dias
    fixedDate?: string;   // Se type === 'fixed_date': data ISO (ex: "2024-02-22")
  };
}
```

**Opções de validade:**
- `same_day`: Ficha válida apenas no dia da compra (expira às 23:59)
- `days`: Ficha válida por X dias a partir da compra
- `fixed_date`: Ficha válida até uma data específica (útil para eventos)

---

### 2. Atualizar Mock Data (`src/data/mockData.ts`)

Adicionar configuração de validade para cada estabelecimento de demonstração:

| Estabelecimento | Tipo de Validade | Configuração |
|-----------------|------------------|--------------|
| Bar do Zé | days | 30 dias |
| Boteco Carioca | days | 15 dias |
| Gastrobar Premium | days | 7 dias |
| Festival de Cerveja | fixed_date | 22/02/2024 |
| Pizzaria Bella Napoli | same_day | - |

---

### 3. Atualizar `TicketsContext.tsx`

Modificar a função `createOrder` para calcular a validade baseada na configuração do estabelecimento:

**De (linha 52):**
```typescript
expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
```

**Para:**
```typescript
expiresAt: calculateTicketExpiration(establishment.ticketValidity),
```

**Nova função auxiliar:**
```typescript
function calculateTicketExpiration(validity: Establishment['ticketValidity']): Date {
  const now = new Date();
  
  switch (validity.type) {
    case 'same_day':
      // Expira às 23:59:59 do dia atual
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      return endOfDay;
      
    case 'fixed_date':
      // Data fixa definida pelo estabelecimento
      const fixed = new Date(validity.fixedDate + 'T23:59:59');
      return fixed;
      
    case 'days':
    default:
      // X dias a partir da compra
      const days = validity.days || 30;
      return new Date(now.getTime() + days * 24 * 60 * 60 * 1000);
  }
}
```

---

### 4. Exibir Validade no Card da Ficha (`src/pages/Tickets.tsx`)

Adicionar exibição da data de validade no `TicketCard` para que o usuário saiba quando a ficha expira:

```tsx
<p className="text-xs text-muted-foreground">
  Válido até {ticket.expiresAt.toLocaleDateString('pt-BR')}
</p>
```

Para fichas com validade no mesmo dia, destacar com cor de alerta:
```tsx
{isExpiringSoon && (
  <Badge variant="destructive" className="text-xs">
    Expira hoje!
  </Badge>
)}
```

---

### 5. Verificação de Fichas Expiradas

Adicionar lógica no `TicketsContext` para marcar automaticamente fichas como expiradas quando `expiresAt < now`:

```typescript
// Verificar fichas expiradas ao carregar
useEffect(() => {
  const now = new Date();
  setTickets(prev => prev.map(ticket => {
    if (ticket.status === 'available' && ticket.expiresAt < now) {
      return { ...ticket, status: 'expired' };
    }
    return ticket;
  }));
}, []);
```

---

## Arquivos a Serem Modificados

| Arquivo | Alteração |
|---------|-----------|
| `src/types/index.ts` | Adicionar campo `ticketValidity` no tipo `Establishment` |
| `src/data/mockData.ts` | Configurar validade para cada estabelecimento de demo |
| `src/contexts/TicketsContext.tsx` | Usar configuração do estabelecimento para calcular `expiresAt` |
| `src/pages/Tickets.tsx` | Exibir data de validade no card da ficha |

---

## Resultado Esperado

1. Cada estabelecimento pode definir sua própria regra de validade
2. Fichas mostram claramente quando expiram
3. Fichas próximas de expirar são destacadas visualmente
4. Fichas expiradas saem da aba Fichas e vão para o histórico e são marcadas automaticamente como "expired"
5. O Festival de Cerveja terá validade até a data final do evento
6. A Pizzaria terá fichas válidas apenas no dia da compra
