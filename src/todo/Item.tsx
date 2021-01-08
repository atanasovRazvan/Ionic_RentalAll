import React, {useState} from 'react';
import { IonItem, IonModal, IonButton, IonCard, IonCardTitle, IonCardSubtitle, IonCardHeader, IonCardContent, IonBadge, IonFab, IonIcon, IonLabel, IonImg } from '@ionic/react';
import { ItemProps } from './ItemProps';
import { alertCircleOutline } from 'ionicons/icons';
import { createAnimation, Animation } from "@ionic/core";

interface ItemPropsExt extends ItemProps {
  onEdit: (id?: string) => void;
}

const Item: React.FC<ItemPropsExt> = ({ id, description, price, priceEstimation, ownerUsername, status, photoPath, onEdit }) => {

  function viewStatus(status: boolean){
    if(status === false)
      return <IonFab horizontal="end"> <IonIcon icon={alertCircleOutline} /> </IonFab>
  }

  const [showModal, setShowModal] = useState(false);

    const enterAnimation = (baseEl: any) => {
        const backdropAnimation = createAnimation()
            .addElement(baseEl.querySelector("ion-backdrop")!)
            .fromTo("opacity", "0.01", "var(--backdrop-opacity)");

        const wrapperAnimation = createAnimation()
            .addElement(baseEl.querySelector(".modal-wrapper")!)
            .keyframes([
                { offset: 0, opacity: "0", transform: "scale(0)" },
                { offset: 1, opacity: "0.99", transform: "scale(1)" },
            ]);

        return createAnimation()
            .addElement(baseEl)
            .easing("ease-out")
            .duration(500)
            .addAnimation([backdropAnimation, wrapperAnimation]);
    };

    const leaveAnimation = (baseEl: any) => {
        return enterAnimation(baseEl).direction("reverse");
    };


  return (
    <IonItem>
      <IonCard>
        <IonCardHeader onClick={() => onEdit(id)}>
          <IonCardTitle> <div>Price: {price}</div>  {viewStatus(status)}
                        <div><IonBadge> Owner: {ownerUsername} </IonBadge> </div>
          </IonCardTitle>
          <IonCardSubtitle>Estimated Price: {priceEstimation} </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          {description}
          <br></br>
          <IonLabel>
            <IonImg style={{width: "100px"}} alt={"NO PHOTO"} src={photoPath} onClick={() => {setShowModal(true);}}/>
          </IonLabel>
          <IonModal
                isOpen={showModal}
                enterAnimation={enterAnimation}
                leaveAnimation={leaveAnimation}
            >
                <IonImg
                    alt={"No Photo"}
                    src={photoPath}
                    onClick={() => {setShowModal(true);}}
                />
                <IonButton onClick={() => setShowModal(false)}>Close Image</IonButton>
            </IonModal>

        </IonCardContent>
      </IonCard>
    </IonItem>
  );
};

export default Item;
