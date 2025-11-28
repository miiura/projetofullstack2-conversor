import React from 'react';
import { Card, Badge, ListGroup } from 'react-bootstrap';
import { useCurrency } from '../contexts/CurrencyContext';

const CurrencyInfo = () => {
  const { state } = useCurrency();

  return (
    <Card className="mt-4">
      <Card.Body>
        <Card.Title>
          ℹ️ Informações
          <Badge bg="primary" className="ms-2">useReducer</Badge>
        </Card.Title>
        
        <ListGroup variant="flush">
          <ListGroup.Item>
            <strong>Moeda Origem:</strong> 
            <Badge bg="primary" className="ms-2">{state.fromCurrency}</Badge>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Moeda Destino:</strong> 
            <Badge bg="success" className="ms-2">{state.toCurrency}</Badge>
          </ListGroup.Item>
          <ListGroup.Item>
            <strong>Status:</strong> 
            <Badge bg={state.loading ? 'warning' : 'success'} className="ms-2">
              {state.loading ? 'Carregando...' : 'Pronto'}
            </Badge>
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  );
};

export default CurrencyInfo;