import React, { Component, PropTypes } from 'react'
import {
  FormGroup,
  Button,
  Row,
  Col,
  ControlLabel,
  FormControl,
  HelpBlock
} from 'react-bootstrap'
import './Task.scss'
import Card from 'components/Card'
import axios from 'utils/axios'

export default class Task extends Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      task_assigned_users: []
    }
  }

  componentDidMount() {
    // this.props.getTask(this.props.params.id_task)
    axios.get('/api/user?id_role=3')
      .then(response => {
        const users = response.data.data
        this.setState({
          users
        })
      })
      .catch(response => {
        this.setState({
          users: []
        })
      })
  }

  static propTypes = {
    getTask: PropTypes.func.isRequired,
    params: PropTypes.object
  }

  render() {
    const { users } = this.state
    const { task } = this.props

    return (
      <div className="container">
        <Row>
          <Col sm={4}>
            <Card>
              <FormGroup value={task ? [] : []}>
                <ControlLabel>Assigned Employees</ControlLabel>
                <FormControl componentClass="select" placeholder="select" multiple>
                  {
                    users.map(user =>
                      <option
                        key={user.id_user}
                        value={user.id_user}
                      >
                        {user.name}
                      </option>
                    )
                  }
                </FormControl>
                <HelpBlock>Hold Ctrl to select multiple users</HelpBlock>
              </FormGroup>
            </Card>
          </Col>
          <Col sm={4}>v</Col>
          <Col sm={4}>v</Col>
        </Row>
      </div>
    )
  }
}
