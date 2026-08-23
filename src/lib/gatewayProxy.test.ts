import { describe, it, expect } from 'vitest'
import { buildGatewayRequest } from './gatewayProxy'

describe('buildGatewayRequest', () => {
  it('should join the api base url with the path and query string', () => {
    // Given
    const params = {
      apiBaseUrl: 'http://localhost:8000',
      path: ['profiles', 'preview'],
      search: '?foo=bar',
    }

    // When
    const request = buildGatewayRequest(params)

    // Then
    expect(request.url).toBe('http://localhost:8000/profiles/preview?foo=bar')
  })

  it('should strip a trailing slash from the api base url before joining', () => {
    // Given
    const params = { apiBaseUrl: 'http://localhost:8000/', path: ['health'], search: '' }

    // When
    const request = buildGatewayRequest(params)

    // Then
    expect(request.url).toBe('http://localhost:8000/health')
  })

  it('should attach X-Gateway-Secret when a secret is provided', () => {
    // Given
    const params = { apiBaseUrl: 'http://localhost:8000', path: ['health'], search: '', gatewaySecret: 'shh' }

    // When
    const request = buildGatewayRequest(params)

    // Then
    expect(request.headers['X-Gateway-Secret']).toBe('shh')
  })

  it('should not attach the header when no secret is configured', () => {
    // Given: GATEWAY_SECRET não configurado no ambiente (ex.: dev local
    // sem .env ainda) — nunca deve mandar um header vazio/undefined
    const params = { apiBaseUrl: 'http://localhost:8000', path: ['health'], search: '' }

    // When
    const request = buildGatewayRequest(params)

    // Then
    expect(request.headers['X-Gateway-Secret']).toBeUndefined()
  })
})
