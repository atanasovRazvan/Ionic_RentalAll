import React, { useContext, useState, useEffect } from 'react';
import { RouteComponentProps, Redirect } from 'react-router';
import {
  IonButton,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonList, IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSearchbar,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonBadge
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { AuthContext } from '../auth'
import { IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/react';
import { ItemProps } from './ItemProps';
import { Network } from '@capacitor/core';

const log = getLogger('ItemList');

let NStatus = "Online";

Network.addListener("networkStatusChange", status => {
  NStatus = status.connected === true ? "Online" : "Offline";
  log(NStatus, "in listener");
})

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {

  const [networkStatus, setNetworkStatus] = useState<string>(NStatus);
  Network.addListener("networkStatusChange", status => {
    setNetworkStatus(status.connected === true ? "Online" : "Offline");
    log(networkStatus, "in listener");
  })

  const { items, conflictualItems, fetching, fetchingError, savingPending, saveItem } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);

  const[disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const[pos, setPos] = useState(5);
  const[conflict, setConflict] = useState<boolean>(false);

  const[filter, setFilter] = useState<string | undefined>("any price");
  const selectOptions = ["<=500 EUR", ">500 EUR", "any price"];
  const [searchText, setSearchText] = useState<string>("");

  const renderColor = () => {
    return networkStatus === "Online" ? "primary" : "danger";
  }

  const renderStatus = () => {
    return networkStatus;
  }

  useEffect(() => {
    log(networkStatus, "in useEffect()");
  }, [networkStatus]);

  const networkStatusView = <IonBadge color = { renderColor() }>Network status: { renderStatus() }</IonBadge>

  const [apartmentsShow, setApartmentsShow] = useState<ItemProps[]>([]);

  const handleLogout = () => {
    logout?.();
    return <Redirect to={{pathname: "/login"}} />;
  }

  async function searchNext($event: CustomEvent<void>)
    {
      if(items && pos < items.length){
        setApartmentsShow([...items.slice(0, 5+pos)]);
        setPos(pos+5);
      }
      else{
        setDisableInfiniteScroll(true);
      }
      log("items from" + 0 + "to " + pos)
      log(apartmentsShow)
      await ($event.target as HTMLIonInfiniteScrollElement).complete();
    }

  log('render');

  useEffect(() =>{
    if(items?.length){
      setApartmentsShow(items.slice(0, pos));
    }
  }, [items]);

  //filter
  useEffect(()=>{
    if(filter && items){
      if(filter === "<=500 EUR"){
        setApartmentsShow(items.filter((item) => Number.parseInt(item.price) <= 500) );
      }
      else if(filter === ">500 EUR"){
        setApartmentsShow(items.filter((item) => Number.parseInt(item.price) > 500) );
      }
      else if(filter === "any price"){
        setApartmentsShow(items);
      }
    }
  }, [filter]);

  //search
  useEffect(()=>{
    if(searchText === "" && items){
      setApartmentsShow(items);

    }
    if(searchText && items){
      setApartmentsShow(items.filter((item) => item.description.startsWith(searchText)));
    }
  },[searchText]);
    
  useEffect(() => {
    if(savingPending === true){
      setConflict(true);
    }
    else{
      setConflict(false);
    }
  }, [savingPending]);

  async function handleEdit(id : string | undefined) {
    const item = conflictualItems?.find(it => it.id === id);
    if(item && item.id){
        console.log(item);
        item.id = item.id.split('_')[0];
        item.version = item.version+1;
        console.log(item);
        saveItem && saveItem(item);
    }
    return;

  }

  if(conflict === true){
    return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Conflicts</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          
        <IonList>
            {conflictualItems?.map((item: ItemProps) => 
                <Item key={item.id} id={item.id} description={item.description} 
                    price={item.price} priceEstimation={item.priceEstimation} ownerUsername={item.ownerUsername} 
                    version={item.version} status={item.status} onEdit = {id => handleEdit(id)}>
                </Item>)}
        </IonList>

      </IonContent>
    </IonPage>
    )}

  else
  log("ITEMS: ", items);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="end" onClick = {handleLogout}>Logout</IonButton>
          <IonTitle>EasyRENT</IonTitle>
          { networkStatusView }
        </IonToolbar>
        <IonSearchbar value={searchText} debounce={500} onIonChange={(e) => setSearchText(e.detail.value!)}/>

        <IonItem>
            <IonLabel>Filter products by rating</IonLabel>
            <IonSelect value={filter} onIonChange={(e) => setFilter(e.detail.value)}>
                {selectOptions.map((option) => (
                <IonSelectOption key={option} value={option}>
                    {option}
                </IonSelectOption>
                ))}
            </IonSelect>
        </IonItem>
      </IonHeader>
      <IonContent>

        <IonLoading isOpen={fetching} message="Fetching items" />
        {items && apartmentsShow.map((item: ItemProps) => {
            return(
            <IonList>
              <Item key={item.id} id={item.id} description={item.description} 
                price={item.price} priceEstimation={item.priceEstimation} ownerUsername={item.ownerUsername} 
                version={item.version} status={item.status} onEdit={id => history.push(`/item/${id}`)} />
            </IonList>
            );
        })}

        <IonInfiniteScroll threshold="75px" disabled={disableInfiniteScroll} onIonInfinite={(e: CustomEvent<void>) => searchNext(e)}>
            <IonInfiniteScrollContent loadingSpinner="bubbles" loadingText="Loading for more items..."/>
        </IonInfiniteScroll>

        {fetchingError && (
          <div>{fetchingError.message || 'Failed to fetch items, showing in-memory saved items!'}</div>
        )}
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => history.push('/item')}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default ItemList;
