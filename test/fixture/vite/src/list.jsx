import { h } from 'preact'
import Item from './listItem.jsx'

const items = [0, 1, 2, 3]

export const List = () => {
  return <div id="item-list">{items.map(item => <Item key={`item-${item}`} index={item}/>)}</div>
}
