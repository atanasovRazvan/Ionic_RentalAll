import React from 'react';
import { IonItem, IonLabel, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonBadge } from '@ionic/react';
import { ItemProps } from './ItemProps';

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, description, price, priceEstimation, ownerUsername, onEdit }) => {
  return (
    <IonItem onClick={() => onEdit(id)}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Price: {price}   <IonBadge> Owner: {ownerUsername} </IonBadge> </IonCardTitle>
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
