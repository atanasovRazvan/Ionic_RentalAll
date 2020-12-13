import axios from 'axios';
import { getLogger, withLogs } from '../core';
import { ItemProps } from './ItemProps';
import { Plugins } from '@capacitor/core';

const { Storage, Network } = Plugins;

const log = getLogger('itemApi');

const baseUrl = 'localhost:8080';
const itemUrl = `http://${baseUrl}/item`;

const config = {
  headers: {
    'Content-Type': 'application/json'
  }
};

export const getItem: (id: string | undefined) => Promise<ItemProps> = id => {
  return withLogs(axios.get(`${itemUrl}/${id}`, config), 'getItem');
}

export const getItems: (token: string | null) => Promise<ItemProps[]> = token => {
  return withLogs(axios.put(itemUrl, token, config), 'getItems');
}

export const createItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  return withLogs(axios.post(itemUrl, item, config), 'createItem');
}

export const updateItem: (item: ItemProps) => Promise<ItemProps[]> = item => {
  var result = axios.put(`${itemUrl}/${item.id}`, item, config);
  Network.getStatus().then(async status => {
    if(status.connected === false){
      await Storage.set(
        { key: "item_save" + item.id,
          value: JSON.stringify({
          description: item.description,
          price: item.price,
          priceEstimation: item.priceEstimation,
          ownerUsername: item.ownerUsername,
          version: item.version,
          status: false,
          lat: item.lat,
          lng: item.lng,
          photoPath: item.photoPath
        })
        }
      );
    }
  })
  return withLogs(result, 'updateItem');
}

export const deleteITEM: (id?: String) => Promise<ItemProps> = id => {
  return withLogs(axios.delete(`${itemUrl}/${id}`, config), 'deleteItem');
}

interface MessageData {
  event: string;
  payload: {
    item: ItemProps;
  };
}

export const newWebSocket = (onMessage: (data: MessageData) => void) => {
  const ws = new WebSocket(`ws://${baseUrl}`)
  ws.onopen = () => {
    log('web socket onopen');
  };
  ws.onclose = () => {
    log('web socket onclose');
  };
  ws.onerror = error => {
    log('web socket onerror', error);
  };
  ws.onmessage = messageEvent => {
    log('web socket onmessage');
    onMessage(JSON.parse(messageEvent.data));
  };
  return () => {
    ws.close();
  }
}
