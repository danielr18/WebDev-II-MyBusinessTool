import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'

import './Project.scss'

export default class Project extends Component {

  static propTypes = {
    getProject: PropTypes.func.isRequired,
    params: PropTypes.object
  }

  componentDidMount() {
    this.props.getProject(this.props.params.id_project)
  }

  render() {
    return (
      <div className="container">
        <Row>
          <Col md={4}>
            {/* <CreateProjectForm /> */}
          </Col>
          <Col md={8}>
            <div className="tasks-header">
              <h2>Tasks</h2>
            </div>
            <Row>
              <Col sm={6}>
                <div className="task-header">
                  <h2>Pending</h2>
                </div>
              </Col>
              <Col sm={6}>
                <div className="task-header">
                  <h2>Completed</h2>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
