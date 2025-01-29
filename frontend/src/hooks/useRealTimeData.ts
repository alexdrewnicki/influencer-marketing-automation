import { useState, useEffect, useCallback } from 'react';
import { logger } from '../services/loggerService';

interface WebSocketMessage {
  type: string;
  data: any;
}

export function useRealTimeData<T>(
  initialData: T,
  wsUrl: string,
  options = {
    reconnectAttempts: 3,
    reconnectInterval: 5000,
  }
) {
  const [data, setData] = useState<T>(initialData);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(() => {
    let ws: WebSocket | null = null;
    let reconnectCount = 0;

    const establishConnection = () => {
      ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setIsConnected(true);
        setError(null);
        reconnectCount = 0;
        logger.info('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          switch (message.type) {
            case 'update':
              setData(current => ({ ...current, ...message.data }));
              break;
            case 'refresh':
              setData(message.data);
              break;
            default:
              logger.warn('Unknown message type:', message.type);
          }
        } catch (err) {
          logger.error('Error processing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        logger.error('WebSocket error:', event);
        setError(new Error('WebSocket connection error'));
      };

      ws.onclose = () => {
        setIsConnected(false);
        if (reconnectCount < options.reconnectAttempts) {
          reconnectCount++;
          setTimeout(establishConnection, options.reconnectInterval);
        } else {
          setError(new Error('WebSocket connection failed'));
        }
      };
    };

    establishConnection();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [wsUrl, options.reconnectAttempts, options.reconnectInterval]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return { data, isConnected, error };
}
