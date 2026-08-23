// Fonte única do tipo Platform (spec.md seção 1: "Dois boards
// independentes... Instagram e LinkedIn"). resolveProfileInput.ts e
// src/data/mockListings.ts importam daqui em vez de cada um redeclarar o
// mesmo union type — achado do code-reviewer, 2026-08-23.
export type Platform = 'instagram' | 'linkedin'
