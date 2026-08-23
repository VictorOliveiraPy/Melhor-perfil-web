// Lance mínimo é sempre em reais inteiros (spec.md seção 5: "Mínimo R$ 1,
// sobe de R$ 1 em R$ 1") — nunca há centavos de verdade a exibir. Formata
// sem casas decimais, igual ao "R$ 1.008" do melhorlance.dev de referência.
export function formatCurrency(cents: number): string {
  const value = cents / 100
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}
