# Authorization Code Flow:

- Always generate an authorization code
- Support **PKCE** for public clients
- Redirect with `?code=...`

```typescript
// response_type=code

{
    code: "SplxlOBeZQQYbYS6WxSbIA",
    state: request.state
}
```

# Implicit Flows:

- Issue `access_token`, `id_token` immediately (no backchannel)
- Use `nonce` to prevent replay attacks
- Redirect using **fragment** `#id_token=...&access_token=...`

```typescript
// response_type=token (Access token only)

{
  access_token: "SlAV32hkKG",
  token_type: "Bearer",
  expires_in: 3600,
  state: request.state
}
```

```typescript
// response_type=id_token (ID token only)

{
  id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  state: request.state
}
```

```typescript
// response_type=id_token token (Both tokens)

{
  access_token: "SlAV32hkKG",
  token_type: "Bearer",
  id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  expires_in: 3600,
  state: request.state
}
```

# Hybrid Flows:

- Issue **authorization_code + id_token**, or **code + token**, or all three
- Return `?code=...` + `id_token=...` (fragment or query)

```typescript
// response_type=code id_token

{
  code: "SplxlOBeZQQYbYS6WxSbIA",
  id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  state: request.state
}
```

```typescript
// response_type=code token

{
  code: "SplxlOBeZQQYbYS6WxSbIA",
  access_token: "SlAV32hkKG",
  token_type: "Bearer",
  expires_in: 3600,
  state: request.state
}
```

```typescript
// response_type=code id_token token (Everything)

{
  code: "SplxlOBeZQQYbYS6WxSbIA",
  access_token: "SlAV32hkKG",
  token_type: "Bearer",
  id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  expires_in: 3600,
  state: request.state
}
```

## Important Notes:

- Hybrid flows return tokens immediately - No need to call token endpoint for those tokens
- Authorization codes are still exchangeable - Even in hybrid flows, the code can be exchanged for refresh tokens
- Fragment vs Query params:
  - Code only: Query parameters (`?code=...`)
  - Tokens present: URL fragments (`#access_token=...`)
- Security considerations:
  - Implicit flows expose tokens in URLs (less secure)
  - Hybrid flows combine benefits but increase complexity
  - Authorization Code flow is most secure
