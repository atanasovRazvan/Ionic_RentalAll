import React, { useContext, useEffect, useState } from 'react';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonInput,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonFab,
  IonFabButton,
  IonIcon
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import { trashBin } from 'ionicons/icons';

const log = getLogger('ItemEdit');

interface ItemEditProps extends RouteComponentProps<{
  id?: string;
}> {}

const ItemEdit: React.FC<ItemEditProps> = ({ history, match }) => {
  const { items, saving, deleting, savingPending, savingError, saveItem, deleteItem } = useContext(ItemContext);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [priceEstimation, setPriceEstimation] = useState('');
  const [ownerUsername, setOwner] = useState('');
  const [version, setVersion] = useState(0);
  const [status, setStatus] = useState(true);
  const [item, setItem] = useState<ItemProps>();
  useEffect(() => {
    log('useEffect');
    const routeId = match.params.id || '';
    const item = items?.find(it => it.id === routeId);
    setItem(item);
    if (item) {
      setDescription(item.description);
      setPrice(item.price);
      setPriceEstimation(item.priceEstimation);
      setOwner(item.ownerUsername);
      setVersion(item.version);
      setStatus(item.status);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = item ? { ...item, description, price, priceEstimation, ownerUsername, version, status } : { description, price, priceEstimation, ownerUsername, version, status };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };
  const handleDelete = () => {
    deleteItem && deleteItem(item?.id).then(() => history.goBack());
  }
  log('render');
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Edit</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={handleSave}>
              Save
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          <IonLabel>Description: </IonLabel><IonInput value={description} onIonChange={e => setDescription(e.detail.value || '')} />
          <IonLabel>Price: </IonLabel><IonInput value={price} onIonChange={e => setPrice(e.detail.value || '')} />
          <IonLabel>Estimated Price: </IonLabel><IonInput value={priceEstimation} onIonChange={e => setPriceEstimation(e.detail.value || '')} />
          <IonLabel>Owner: </IonLabel><IonInput value={ownerUsername} onIonChange={e => setOwner(e.detail.value || '')} />
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleDelete}>
            <IonIcon icon={trashBin} />
          </IonFabButton>
        </IonFab>

      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
