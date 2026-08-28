// Extraído do polling do PixPaymentPanel (achado em produção 2026-08-27,
// spec.md seção 7): o Pix só está confirmado quando a TRANSAÇÃO específica
// que gerou o QR code está "paga" — nunca quando o `status` do listing
// inteiro é "ativa", porque uma entrada já ativa de um pagamento anterior
// não muda de status até o reforço/ultrapassagem ser aplicado. Função pura
// só pra deixar essa regra testável isoladamente, sem precisar de infra de
// teste de componente React (o repo não tem uma hoje).
export function isPaymentConfirmed(transactionStatus: string | null): boolean {
  return transactionStatus === 'paga'
}
