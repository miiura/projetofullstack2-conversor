// Estado inicial da aplicação
export const initialState = {
  amount: '',
  fromCurrency: 'USD',
  toCurrency: 'BRL',
  result: null,
  loading: false,
  error: null,
  lastUpdate: null
};

// Tipos de ações para o useReducer
export const ACTION_TYPES = {
  SET_AMOUNT: 'SET_AMOUNT',
  SET_FROM_CURRENCY: 'SET_FROM_CURRENCY',
  SET_TO_CURRENCY: 'SET_TO_CURRENCY',
  CONVERT_START: 'CONVERT_START',
  CONVERT_SUCCESS: 'CONVERT_SUCCESS',
  CONVERT_ERROR: 'CONVERT_ERROR',
  SWAP_CURRENCIES: 'SWAP_CURRENCIES',
  RESET_ERROR: 'RESET_ERROR'
};

// Reducer principal
const currencyReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_AMOUNT:
      return { 
        ...state, 
        amount: action.payload,
        error: null
      };
    
    case ACTION_TYPES.SET_FROM_CURRENCY:
      return { 
        ...state, 
        fromCurrency: action.payload,
        error: null
      };
    
    case ACTION_TYPES.SET_TO_CURRENCY:
      return { 
        ...state, 
        toCurrency: action.payload,
        error: null
      };
    
    case ACTION_TYPES.CONVERT_START:
      return { 
        ...state, 
        loading: true, 
        error: null,
        result: null
      };
    
    case ACTION_TYPES.CONVERT_SUCCESS:
      return {
        ...state,
        loading: false,
        result: action.payload.result,
        lastUpdate: action.payload.timestamp,
        error: null
      };
    
    case ACTION_TYPES.CONVERT_ERROR:
      return {
        ...state,
        loading: false,
        error: action.payload,
        result: null
      };
    
    case ACTION_TYPES.SWAP_CURRENCIES:
      return {
        ...state,
        fromCurrency: state.toCurrency,
        toCurrency: state.fromCurrency,
        error: null
      };
    
    case ACTION_TYPES.RESET_ERROR:
      return {
        ...state,
        error: null
      };
    
    default:
      return state;
  }
};

export default currencyReducer;