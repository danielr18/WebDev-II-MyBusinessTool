import React, { Component, PropTypes } from 'react'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import {
  FormGroup,
  Button,
  ControlLabel,
  FormControl,
  Form,
  HelpBlock
} from 'react-bootstrap'
import { connect } from 'react-redux'

import axios from 'utils/axios'
import { stringify as qs } from 'qs'
import ProjectActions from 'store/project'
import Card from 'components/Card'

export class CreateTaskForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      task: {
        name: '',
        description: '',
        id_leader: null
      }
    }
  }

  componentDidMount() {
    axios.get('/api/user?id_role=3')
      .then(response => {
        const users = response.data.data
        this.setState((state) => ({
          users,
          task: Object.assign({}, state.task, { id_leader: users[0].id_user })
        }))
      })
      .catch(response => {
        this.setState({
          users: []
        })
      })
  }

  componentDidUpdate() {

  }

  static propTypes = {
    id_project: PropTypes.number
  }

  onNameChange = e => {
    e.persist()
    this.setState((state) => ({
      task: Object.assign({}, state.task, { name: e.target.value })
    }))
  }

  onDescriptionChange = e => {
    e.persist()
    this.setState((state) => ({
      task: Object.assign({}, state.task, { description: e.target.value })
    }))
  }

  onLeaderChange = e => {
    e.persist()
    this.setState((state) => ({
      task: Object.assign({}, state.task, {
        id_leader: [...e.target.options].filter(({ selected }) => selected)
                                        .map(({ value }) => value) })
    }))
  }

  render() {
    const { users, task } = this.state
    const { id_project } = this.props

    return (
      <Card className="project-task-card">
        <h4>Create A Task</h4>
        <Form>
          <FormGroup onChange={this.onNameChange} value={task.name}>
            <ControlLabel>Name</ControlLabel>
            <FormControl label="name" type="text" placeholder="Build the Home Page" />
            {/* {help && <HelpBlock>{help}</HelpBlock>} */}
          </FormGroup>

          <FormGroup onChange={this.onDescriptionChange} value={task.description}>
            <ControlLabel>Description</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Describe the task..." />
          </FormGroup>

          <FormGroup onChange={this.onLeaderChange} value={task.id_leader}>
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
        </Form>
        <Button onClick={() => this.props.createTask(id_project, task)}>Create</Button>
      </Card>
    )
  }
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = (dispatch) => ({
  createTask: (id_project, task) => dispatch(ProjectActions.createTask(id_project, task))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateTaskForm)
