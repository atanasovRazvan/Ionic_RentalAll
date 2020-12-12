import React from 'react';
import { IonItem, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonBadge, IonFab, IonIcon } from '@ionic/react';
import { ItemProps } from './ItemProps';
import { alertCircleOutline } from 'ionicons/icons';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, description, price, priceEstimation, ownerUsername, status, onEdit }) => {

  function viewStatus(status: boolean){
    if(status === false)
      return <IonFab horizontal="end"> <IonIcon icon={alertCircleOutline} /> </IonFab>
  }

  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle> <div>Price: {price}</div>  {viewStatus(status)}
                        <div><IonBadge> Owner: {ownerUsername} </IonBadge> </div>
          </IonCardTitle>
          <IonCardSubtitle>Estimated Price: {priceEstimation} </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {description}
        </IonCardContent>
      </IonCard>
    </IonItem>
  );
};

export default Item;
