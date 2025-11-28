import axios from 'axios';

const API_KEY = 'de6e266639de39f3cd8a2aa1';
const BASE_URL = 'https://api.exchangerate-api.com/v4/latest';

export const convertCurrency = async (fromCurrency, toCurrency, amount) => {
  try {
    console.log(`Convertendo: ${amount} ${fromCurrency} para ${toCurrency}`);
    
    // Fazer requisição para a API
    const response = await axios.get(`${BASE_URL}/${fromCurrency}`);
    
    const rate = response.data.rates[toCurrency];
    
    if (!rate) {
      throw new Error(`Taxa para ${toCurrency} não encontrada`);
    }
    
    // Calcular resultado
    const result = (amount * rate).toFixed(2);
    const timestamp = new Date().toLocaleTimeString();
    
    return {
      result,
      rate,
      timestamp
    };
    
  } catch (error) {
    console.error('Erro na conversão:', error);
    throw new Error('Erro ao converter moeda. Tente novamente.');
  }
};