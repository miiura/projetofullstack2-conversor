const API_URL = "http://localhoshttps://api.exchangerate-api.com/v4/latest";
const API_KEY = 'de6e266639de39f3cd8a2aa1'; // ajuste se necessário

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  return res.json();
}

export async function insertCurrency(token, currencyData) {
  const res = await fetch(`${API_URL}/currencies/create`, {
    method: "POST",
    headers: { 
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(currencyData)
  });

  return res.json();
}

export async function listCurrencies(token) {
  const res = await fetch(`${API_URL}/currencies/list`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });

  return res.json();
}
