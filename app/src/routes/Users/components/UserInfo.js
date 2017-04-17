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
import './Users.scss'
import Card from 'components/Card'
import axios from 'utils/axios'

const UserInfo = (props) => {
  return (
    <Card>
      <Row>
        <Col sm={1} >
          <span>{props.id_user}</span>
        </Col>
        <Col sm={3} >
          <span>{props.name}</span>
        </Col>
        <Col sm={3} >
          <span>{props.email}</span>
        </Col>
        <Col sm={2} >
          <span>{props.role}</span>
        </Col>
        <Col sm={3} >
          <div style={{ display: 'flex' }}>
            {props.allowEdit &&
              <Button style={{ 'margin-right': '10px' }} onClick={() => props.onEditUser(props.id_user)}>Edit</Button>
            }
            {props.allowDelete &&
              <Button onClick={() => props.onDeleteUser(props.id_user)}>Delete</Button>
            }
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default UserInfo
