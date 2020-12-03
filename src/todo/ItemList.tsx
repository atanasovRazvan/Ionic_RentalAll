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
  IonLabel
} from '@ionic/react';
import { add } from 'ionicons/icons';
import Item from './Item';
import { getLogger } from '../core';
import { ItemContext } from './ItemProvider';
import { AuthContext } from '../auth'
import { IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/react';
import { ItemProps } from './ItemProps';

const log = getLogger('ItemList');

const ItemList: React.FC<RouteComponentProps> = ({ history }) => {

  const { items, fetching, fetchingError } = useContext(ItemContext);
  const { logout } = useContext(AuthContext);

  const[disableInfiniteScroll, setDisableInfiniteScroll] = useState<boolean>(false);
  const[pos, setPos] = useState(5);

  const[filter, setFilter] = useState<string | undefined>("any price");
  const selectOptions = ["<=500 EUR", ">500 EUR", "any price"];
  const [searchText, setSearchText] = useState<string>("");

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

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButton slot="end" onClick = {handleLogout}>Logout</IonButton>
          <IonTitle>EasyRENT</IonTitle>
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
                onEdit={id => history.push(`/item/${id}`)} />
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
