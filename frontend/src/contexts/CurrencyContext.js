import React, { createContext, useContext, useReducer } from 'react';
import { convertCurrency } from './api';
import currencyReducer, { initialState, ACTION_TYPES } from './currencyReducer';


// Context
const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(currencyReducer, initialState);

  const actions = {
    setAmount: (amount) => dispatch({ type: ACTION_TYPES.SET_AMOUNT, payload: amount }),
    setFromCurrency: (currency) => dispatch({ type: ACTION_TYPES.SET_FROM_CURRENCY, payload: currency }),
    setToCurrency: (currency) => dispatch({ type: ACTION_TYPES.SET_TO_CURRENCY, payload: currency }),
    swapCurrencies: () => dispatch({ type: ACTION_TYPES.SWAP_CURRENCIES }),
    resetError: () => dispatch({ type: ACTION_TYPES.RESET_ERROR }),
    performConversion: async () => {
  if (!state.amount || isNaN(state.amount) || parseFloat(state.amount) <= 0) {
    dispatch({ type: ACTION_TYPES.CONVERT_ERROR, payload: 'Digite um valor válido' });
    return;
  }

  dispatch({ type: ACTION_TYPES.CONVERT_START });
  
  try {
    const conversionResult = await convertCurrency(
      state.fromCurrency, 
      state.toCurrency, 
      parseFloat(state.amount)
    );
    dispatch({ type: ACTION_TYPES.CONVERT_SUCCESS, payload: conversionResult });
  } catch (error) {
    dispatch({ type: ACTION_TYPES.CONVERT_ERROR, payload: error.message });
        }
    }
}
  return (
    <CurrencyContext.Provider value={{ state, actions }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within CurrencyProvider');
  }
  return context;
};
