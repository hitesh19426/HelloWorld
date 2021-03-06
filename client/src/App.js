import React, { Component } from "react";
import HelloWorldContract from "./contracts/HelloWorld.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { message: "", web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = HelloWorldContract.networks[networkId];
      const instance = new web3.eth.Contract(
        HelloWorldContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    const {contract } = this.state;

    const message = await contract.methods.print().call();
    console.log("message", message);

    // Update state with the result.
    this.setState({ message: message });
  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <p>
          If your contracts compiled and migrated successfully, below will show
          a stored message of null (by default).
        </p>
        <div>The stored message is: {this.state.message}</div>
      </div>
    );
  }
}

export default App;
