import React, { Component } from 'react';

class NewWalletForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user_id: 0,
      name: 'New Portfolio',
      base: 'USD',
      exchangeRates:[],
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let target = event.target;
    let name = target.name;
    let value = target.value;
    this.setState({[name]: value});
  }

  handleSubmit(event) {
    event.preventDefault();
    let data = JSON.stringify({
      wallet:{
        name: this.state.name,
        user_id: this.state.user_id,
        base: this.state.base
      }
    });

    fetch(`https://ctrader.herokuapp.com/api/v1/users/${this.state.user_id}/wallets.json`,
      {
        method: "post",
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/json'
        },
        body: data
      }
    )
    .then(response => {
      if (response.ok) {
        return response;
      } else {
        let errorMessage = `${response.status} ($response.statusText)`,
          error = new Error(errorMessage);
        throw(error);
      }
    })
    .then(response=>{
      this.props.getWallets();
    });
  }

  componentDidMount() {
    this.setState({user_id: document.getElementById('current_user').innerHTML});
    this.props.getExchangeRates()
      .then(data => {
        data = data[0].exchange_rates;
        this.setState({exchangeRates: data});
      });
  }

  render() {
    let options = this.state.exchangeRates.map((rate, index) => {
      return( <option key={index} value={rate.symbol}>{rate.symbol}</option> )
    })

    return (
      <div className='info info1'>
        <p></p>
        <h2 className='center'>Add Portfolio</h2>
        <form onSubmit={this.handleSubmit}>
          <div className='row'>
            <div className='small-8 small-centered column'>
              <label>
                Wallet Name:
                <input type="text" name='name' value={this.state.name} onChange={this.handleChange} className="textbox"/>
              </label>
            </div>
            <div className= 'small-8 small-centered column'>
              <label>
                Base currency:
                <select name="base" value={this.state.value} onChange={this.handleChange} className='newwalletbase click'>
                  {options}
                </select>
              </label>
            </div>
            <div className='small-1 small-centered column'>
              <input type="submit" value="Create" className="sign click"/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

export default NewWalletForm
