
import React, { Component } from "react";
import "./App.css";
import web3 from "./web3";
import lottery from "./lottery";

class App extends Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }
  onSubmit = async event => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    this.setState({ message: "Waiting on transaction success...." });
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(this.state.value, "ether")
    });
    this.setState({ message: "You have been entered!!" });
  };
  onClick = async ()=>{
    const accounts = await web3.eth.getAccounts();
    this.setState({message:'Waiting on transaction success...'})
    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });
    this.setState({message:"Winner has been picked!"})
  };
  render() {
    return (
      <div className="App">
        <h2>Lottery Contract</h2>
        <p>
          Manager: {this.state.manager}
          <br />
          No of People: {this.state.players.length}
          <br />
          Total Money: {web3.utils.fromWei(this.state.balance, "ether")}
        </p>
        <hr />
        <form onSubmit={this.onSubmit}>
          <h4> Lottery : try your luck</h4>
          <div>
            <label>Amount to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            ></input>
          </div>
          <button>Enter</button>
          
        </form>
        <hr/>
        <h4>Ready to pick winner</h4>
        <button onClick={this.onClick}>Pick Winner</button>
        <hr/>
        <h1>{this.state.message}</h1>
      </div>
    );
  }
}

export default App;
