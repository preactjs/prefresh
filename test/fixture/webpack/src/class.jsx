import { h, Component } from 'preact'

export class Class extends Component {
  constructor() {
    this.state = { greeting: 'hi' };
    this.setGreeting = this.setGreeting.bind(this);
  }

  setGreeting() {
    this.setState({ greeting: 'bye' });
  }

  render() {
    return (
      <div>
        <p className="class-text">I'm a class component</p>
        <p className="greeting-text">{this.state.greeting}</p>
        <button className="greeting-button" onClick={this.setGreeting}>set</p>
      </div>
    )
  }

}
