import React, { Component, PropTypes } from 'react'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Navbar,
  Nav,
  NavItem,
  FormGroup,
  Button,
  ControlLabel,
  FormControl,
  Form
} from 'react-bootstrap'
import { connect } from 'react-redux'

import axios from 'utils/axios'
import { stringify as qs } from 'qs'
import ProjectActions from 'store/project'
import Card from 'components/Card'

export class CreateProjectForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      users: [],
      project: {
        name: '',
        description: '',
        id_leader: null
      }
    }
  }

  componentDidMount() {
    axios.get('/api/user?id_role=2')
      .then(response => {
        const users = response.data.data.filter(user => ['Admin', 'Manager'].includes(user.role))
        this.setState((state) => ({
          users,
          project: Object.assign({}, state.project, { id_leader: users[0].id_user })
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

  }

  onNameChange = e => {
    e.persist()
    this.setState((state) => ({
      project: Object.assign({}, state.project, { name: e.target.value })
    }))
  }

  onDescriptionChange = e => {
    e.persist()
    this.setState((state) => ({
      project: Object.assign({}, state.project, { description: e.target.value })
    }))
  }

  onLeaderChange = e => {
    console.log(e.target.value);
    e.persist()
    this.setState((state) => ({
      project: Object.assign({}, state.project, { id_leader: e.target.value })
    }))
  }

  render() {
    const { users, project } = this.state

    return (
      <Card className="project-form-card">
        <h4>Create A Project</h4>
        <Form>
          <FormGroup onChange={this.onNameChange} value={project.name}>
            <ControlLabel>Name</ControlLabel>
            <FormControl label="name" type="text" placeholder="My Business Tool" />
            {/* {help && <HelpBlock>{help}</HelpBlock>} */}
          </FormGroup>

          <FormGroup onChange={this.onDescriptionChange} value={project.description}>
            <ControlLabel>Description</ControlLabel>
            <FormControl componentClass="textarea" placeholder="Describe the project..." />
            {/* {help && <HelpBlock>{help}</HelpBlock>} */}
          </FormGroup>

          <FormGroup onChange={this.onLeaderChange} value={project.id_leader}>
            <ControlLabel>Project Leader</ControlLabel>
            <FormControl componentClass="select" placeholder="select">
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
          </FormGroup>
        </Form>
        <Button onClick={() => this.props.createProject(project)}>Create</Button>
      </Card>
    )
  }
}

const mapStateToProps = () => ({

})

const mapDispatchToProps = (dispatch) => ({
  createProject: (project) => dispatch(ProjectActions.createProject(project))
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateProjectForm)
