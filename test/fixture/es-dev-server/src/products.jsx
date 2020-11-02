import { h, options } from 'preact';
import { useContext } from 'preact/hooks';
import { StoreContext } from './context';

const products = ['apple', 'peach']
console.log(options);
export const Products = () => {
  const { addItem, removeItem, items } = useContext(StoreContext);
  return products.map(id => (
    <div className={`${id}-div`} key={id} onClick={() => items.includes(id) ? removeItem(id) : addItem(id)}>
      {id}
    </div>
  ))
}
