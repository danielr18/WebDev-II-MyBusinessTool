import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'

import './Project.scss'
import CreateTaskForm from '../containers/CreateTaskForm'

export default class Project extends Component {

  static propTypes = {
    getTasks: PropTypes.func.isRequired,
    getProject: PropTypes.func.isRequired,
    params: PropTypes.object
  }

  componentDidMount() {
    this.props.getProject(this.props.params.id_project)
    this.props.getTasks(this.props.params.id_project)
  }

  render() {
    return (
      <div className="container">
        <Row>
          <Col md={4}>
            <CreateTaskForm id_project={this.props.params.id_project} />
          </Col>
          <Col md={8}>
            <div className="tasks-header">
              <h2>Tasks</h2>
            </div>
            <Row>
              <Col sm={4}>
                <div className="task-header">
                  <h4>Pending</h4>
                </div>
              </Col>
              <Col sm={4}>
                <div className="task-header">
                  <h4>In Process</h4>
                </div>
              </Col>
              <Col sm={4}>
                <div className="task-header">
                  <h4>Completed</h4>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
