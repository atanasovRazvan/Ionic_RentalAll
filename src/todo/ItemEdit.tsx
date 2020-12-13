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
  IonIcon,
  IonImg,
  IonActionSheet
} from '@ionic/react';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { RouteComponentProps } from 'react-router';
import { ItemProps } from './ItemProps';
import { trashBin, camera, trash, close } from 'ionicons/icons';
import { MyMap } from '../utilities/MyMap';
import { usePhotoGallery, Photo } from '../utilities/usePhotoGallery';

const log = getLogger('ItemEdit');

function mapLog(source: string){
  return (e:any) => console.log(source, e.latLng.lat(), e.latLng.lng());
}

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
  const [lat, setLat] = useState(47.29341652941491);
  const [lng, setLng] = useState(24.15388570663447);
  const [photoPath, setPhotoPath] = useState('');
  const [item, setItem] = useState<ItemProps>();
  const [photoToDelete, setPhotoToDelete] = useState<Photo>();
  const { photos, takePhoto, deletePhoto} = usePhotoGallery();
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
      setLat(item.lat);
      setLng(item.lng);
      console.log(photoPath);
      setPhotoPath(item.photoPath);
      console.log(photoPath);
    }
  }, [match.params.id, items]);
  const handleSave = () => {
    const editedItem = item ? { ...item, description, price, priceEstimation, ownerUsername, version, status, lat, lng, photoPath } : { description, price, priceEstimation, ownerUsername, version, status, lat, lng, photoPath };
    saveItem && saveItem(editedItem).then(() => history.goBack());
  };
  const handleDelete = () => {
    deleteItem && deleteItem(item?.id).then(() => history.goBack());
  }
  const setMapPosition = (e: any) => {
    setLat(e.latLng.lat());
    setLng(e.latLng.lng());
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

          <IonImg style={{width: "400px", height: "400px", margin: "0 auto"}} alt={"No photo"}
              onClick = {() => {setPhotoToDelete(photos?.find(vd => vd.webviewPath === photoPath))}}
              src={photoPath}
          />
          <IonFab horizontal="end" >
              <IonFabButton size="small" color="danger"
                  onClick={() => {
                      const photoTaken = takePhoto();
                      photoTaken.then((data) => {
                          setPhotoPath(data.webviewPath!);
                      });
                  }}>
                <IonIcon icon={camera}/>
              </IonFabButton>
          </IonFab>
          <br/>
          <br/>
          <br/>
          <br/>

          <MyMap lat={lat} lng={lng} onMapClick={setMapPosition} onMarkerClick={mapLog('onMarker')} ></MyMap>
        <IonLoading isOpen={saving} />
        {savingError && (
          <div>{savingError.message || 'Failed to save item'}</div>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={handleDelete}>
            <IonIcon icon={trashBin} />
          </IonFabButton>
        </IonFab>

        <IonActionSheet
          isOpen={!!photoToDelete}
            buttons={[
              {
                  text: "Delete",
                  role: "destructive",
                  icon: trash,
                  handler: () => {
                      if (photoToDelete) {
                          deletePhoto(photoToDelete);
                          setPhotoToDelete(undefined);
                          setPhotoPath("")
                      }
                  },
              },
              {
                  text: "Cancel",
                  role: "cancel",
                  icon: close,
              },
            ]}
            onDidDismiss={() => setPhotoToDelete(undefined)}
        />

      </IonContent>
    </IonPage>
  );
};

export default ItemEdit;
