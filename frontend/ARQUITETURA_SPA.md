# 🏗️ Arquitetura SPA - Conversor de Moedas

## 📊 Estrutura de Rotas

```
/
├── / (raiz)
│   └── Redireciona baseado em autenticação
│       ├── Se autenticado → /dashboard
│       └── Se não autenticado → /login
│
├── /login
│   └── Login.jsx (pública)
│       └── Usa AuthContext para salvar token
│       └── Redireciona para /dashboard após sucesso
│
└── /dashboard (protegida)
    └── Dashboard.jsx (componente principal)
        ├── Abas: Conversor | Sugerir Moeda | Mural
        ├── CurrencyConverter.jsx
        ├── CurrencyInfo.jsx
        ├── SugerirMoeda.jsx
        ├── Mural.jsx
        └── LogoutButton.jsx
```

---

## 🔐 Fluxo de Autenticação

### 1. **Ao abrir a aplicação:**
```
App.js
  ↓
AuthProvider (carrega token do localStorage)
  ↓
AppRoutes (verifica autenticação)
  ↓
Se autenticado → vai para /dashboard
Se não → vai para /login
```

### 2. **Ao fazer login:**
```
Login.jsx
  ↓
Submete (email + password)
  ↓
api.loginUser()
  ↓
Backend retorna token
  ↓
AuthContext.login(token)
  ├── Salva em localStorage
  ├── Atualiza estado
  └── Navega para /dashboard
```

### 3. **Ao fazer logout:**
```
LogoutButton.jsx
  ↓
AuthContext.logout()
  ├── Remove token do localStorage
  ├── Limpa estado
  └── Navega para /login
```

---

## 📦 Contextos (Context API)

### **AuthContext** (novo)
```javascript
{
  user: { token: "..." } | null,
  token: "..." | null,
  isAuthenticated: true | false,
  loading: true | false,
  login: (token) => void,
  logout: () => void
}
```

### **CurrencyContext** (existente)
- Gerencia estado de conversão de moedas
- Ações: setAmount, setFromCurrency, setToCurrency, etc.

---

## 🎨 Interface do Dashboard

### **Abas (Navegação):**

1. **🔄 Conversor** (padrão)
   - CurrencyConverter.jsx
   - CurrencyInfo.jsx

2. **💡 Sugerir Moeda**
   - SugerirMoeda.jsx
   - POST autenticado

3. **📝 Mural de Sugestões**
   - Mural.jsx
   - GET público

---

## 🔒 Rotas Protegidas

**ProtectedRoute** verifica:
1. Se há token no localStorage
2. Se usuário está autenticado via AuthContext
3. Se não → redireciona para /login
4. Se sim → renderiza o componente protegido

---

## ✅ Checklist de Implementação

- [x] AuthContext criado
- [x] App.js refatorado com rotas
- [x] Dashboard.jsx criado (agrupa funcionalidades)
- [x] Login.jsx atualizado (usa AuthContext)
- [x] LogoutButton.jsx atualizado (usa AuthContext)
- [x] ProtectedRoute implementada
- [x] Redirecionamento baseado em autenticação
- [ ] Testar fluxo completo
- [ ] Verificar se token é persistido ao recarregar

---

## 🚀 Como Testar

1. **Abra a aplicação:**
   ```
   npm start
   ```
   → Vai para /login (pois não há token)

2. **Faça login:**
   - Email e senha válidos
   → Será redirecionado para /dashboard

3. **Teste as abas:**
   - Conversor
   - Sugerir Moeda
   - Mural de Sugestões

4. **Clique em Logout:**
   → Será redirecionado para /login
   → Token será removido

5. **Recarregue a página após login:**
   - Token deverá ser restaurado do localStorage
   - Deve ir direto para /dashboard