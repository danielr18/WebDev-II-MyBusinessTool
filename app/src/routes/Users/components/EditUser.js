import React, { Component, PropTypes } from 'react'
import {
  FormGroup,
  Button,
  Row,
  Form,
  Col,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap'
import './Users.scss'
import Card from 'components/Card'
import axios from 'utils/axios'
import UserInfo from './UserInfo'

export default class EditUser extends Component {

  constructor(props) {
    super(props)
    this.state = {
      id_user: 0,
      name: '',
      email: '',
      id_role: 1,
      password: '',
    }
  }

  componentDidMount() {
    this.setState({ ...this.props.user })
  }

  onNameChange = (e) => {
    this.setState({
      name: e.target.value
    })
  }

  onEmailChange = (e) => {
    this.setState({
      email: e.target.value
    })
  }

  onRoleChange = (e) => {
    this.setState({
      id_role: e.target.value
    })
  }

  onPasswordChange = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  render() {
    return (
      <Card>
        <Form>
          <Row>
            <Col sm={1}>
              {!this.props.newUser &&
                <span>{this.state.id_user}</span>
              }
            </Col>
            <Col sm={3}>
              <FormControl
                label="name"
                type="text"
                placeholder="Name"
                onChange={this.onNameChange}
                value={this.state.name}
              />
            </Col>
            <Col sm={2}>
              <FormControl
                label="email"
                type="email"
                placeholder="Email"
                onChange={this.onEmailChange}
                value={this.state.email}
              />
            </Col>
            <Col sm={2}>
              <FormControl
                componentClass="select"
                placeholder="select"
                onChange={this.onRoleChange}
                value={this.state.id_role}
              >
                <option value={1}>Admin</option>
                <option value={2}>Manager</option>
                <option value={3}>Employee</option>
              </FormControl>
            </Col>
            <Col sm={2}>
              <FormControl
                label="password"
                type="text"
                placeholder="Password"
                onChange={this.onPasswordChange}
                value={this.state.password}
              />
            </Col>
            <Col sm={2}>
              <div style={{ display: 'flex' }}>
                <Button style={{ marginRight: '10px' }} onClick={() => this.props.onCancel(this.props.user.id_user)}>Cancel</Button>
                <Button onClick={() => this.props.onSaveUser(this.state)}>Save</Button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }
}
