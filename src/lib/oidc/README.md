# Authorization Code Flow:

`response_type=code`

```typescript
{
    code: "SplxlOBeZQQYbYS6WxSbIA",
    state: request.state
}
```

# Implicit Flows:

`response_type=token` (Access token only)

```typescript
{
  access_token: "SlAV32hkKG",
  token_type: "Bearer",
  expires_in: 3600,
  state: request.state
}
```

`response_type=id_token` (ID token only)

```typescript
{
  id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  state: request.state
}
```

`response_type=id_token token` (Both tokens)

```typescript
{
  access_token: "SlAV32hkKG",
  token_type: "Bearer",
  id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  expires_in: 3600,
  state: request.state
}
```

# Hybrid Flows:

`response_type=code id_token`

```typescript
{
  code: "SplxlOBeZQQYbYS6WxSbIA",
  id_token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  state: request.state
}
```

`response_type=code token`

```typescript
{
  code: "SplxlOBeZQQYbYS6WxSbIA",
  access_token: "SlAV32hkKG",
  token_type: "Bearer",
  expires_in: 3600,
  state: request.state
}
```

`responnse_type=code id_token token` (Everything)

```typescript
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
