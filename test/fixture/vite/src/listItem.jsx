import { h, Component } from 'preact'
import { applyHOC } from './hoc.jsx'

class ListItem extends Component {
  render() {
    return <div>item {this.props.index}</div>
  }
}

const WrappedListItem = applyHOC(ListItem)

export default WrappedListItem
