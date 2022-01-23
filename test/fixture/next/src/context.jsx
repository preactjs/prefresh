import { useState, createContext } from 'react';

export const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addItem = (id) => {
    if (!items.includes(id)) setItems([...items, id]);
  }

  const removeItem = (id) => {
    if (items.includes(id)) setItems(items.filter(itemId => itemId !== id));
  }

  return (
    <StoreContext.Provider value={{ items, addItem, removeItem }}>
      <ul className="store-items">
        {items.map(id => <li key={id}>{id}</li>)}
      </ul>
      {children}
    </StoreContext.Provider>
  )
}
