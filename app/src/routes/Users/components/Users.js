import React, { Component, PropTypes } from 'react'
import {
  FormGroup,
  Button,
  Row,
  Col,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap'
import _ from 'lodash'
import { browserHistory } from 'react-router'
import uuid from 'uuid/v4'

import './Users.scss'
import Card from 'components/Card'
import axios from 'utils/axios'
import UserInfo from './UserInfo'
import EditUser from './EditUser'

export default class Users extends Component {

  constructor(props) {
    super(props)
    this.state = {
      usersInEditMode: [],
      usersToBeAdded: []
    }
  }

  componentDidMount() {
    if (this.props.user.id_role !== 1) {
      browserHistory.push('/')
    } else {
      this.props.getUsers()
    }
  }

  activateEditUser = (id_user) => {
    this.setState(state => ({
      usersInEditMode: state.usersInEditMode.concat(id_user)
    }))
  }

  onAddUser = () => {
    this.setState(state => ({
      usersToBeAdded: state.usersToBeAdded.concat(uuid())
    }))
  }

  onDeleteUser = (id_user) => {
    this.props.deleteUser(id_user)
  }

  onSaveUserEdit = (user) => {
    this.props.editUser(user)
    this.onEditCancel(user.id_user)
  }

  onSaveNewUser = (user) => {
    this.props.addUser(user)
    this.onAddCancel(user.id_user)
  }

  onEditCancel = (id_user) => {
    this.setState(state => ({
      usersInEditMode: state.usersInEditMode.filter(id => id !== id_user)
    }))
  }

  onAddCancel = (id_user) => {
    console.log(id_user)
    this.setState(state => ({
      usersToBeAdded: state.usersToBeAdded.filter(id => id !== id_user)
    }))
  }

  render() {
    const users = _.sortBy(this.props.users, 'id_user')
    const { usersToBeAdded } = this.state
    return (
      <div className="container">
        <div className="users-header">
          <h2>Admin - Users Management</h2>
        </div>
        <Row>
          {users.map(user => (
            <Col sm={12}>
              {this.state.usersInEditMode.includes(user.id_user) ? (
                <EditUser
                  user={user}
                  onCancel={this.onEditCancel}
                  onSaveUser={this.onSaveUserEdit}
                />
              ) : (
                <UserInfo
                  onDeleteUser={this.onDeleteUser}
                  onEditUser={this.activateEditUser}
                  allowEdit={this.props.user.id_user !== user.id_user}
                  allowDelete={this.props.user.id_user !== user.id_user}
                  {...user}
                />
              )}
            </Col>
          ))}
          {usersToBeAdded.map(id_user => (
            <Col sm={12}>
              <EditUser
                user={{ id_user }}
                onCancel={this.onAddCancel}
                onSaveUser={this.onSaveNewUser}
                newUser
              />
            </Col>
          ))}
        </Row>
        <br />
        <Button onClick={this.onAddUser}>Add User</Button>
      </div>
    )
  }
}
