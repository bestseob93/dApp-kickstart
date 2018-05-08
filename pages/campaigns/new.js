import React, { Component } from 'react';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';
import { Router } from '../../routes';

class CampaignNew extends Component {
  state = {
    minimumContribution: '',
    errorMessage: '',
    loading: false
  };

  handleChange = (ev) => {
    this.setState({
      minimumContribution: ev.target.value
    });
  }

  onSubmit = async (ev) => {
    ev.preventDefault();
    
    const accounts = await web3.eth.getAccounts();

    this.setState({
      loading: true,
      errorMessage: ''
    });

    try {
      await factory.methods
        .createCampaign(this.state.minimumContribution)
        .send({
          from: accounts[0]
        });

      Router.pushRoute('/');
    } catch (e) {
      if(e) this.setState({ errorMessage: e.message });
    }

    this.setState({
      loading: false
    })
  }

  render() {
    return (
      <Layout>
        <h1>New Campaign!</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input 
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={this.handleChange}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary>Create!</Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
