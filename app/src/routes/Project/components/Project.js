import React, { Component, PropTypes } from 'react'
import { Row, Col } from 'react-bootstrap'

import './Project.scss'
import CreateTaskForm from '../containers/CreateTaskForm'
import TaskCard from './TaskCard'
import Card from 'components/card'

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
    const { tasks, project, user } = this.props
    const createdTasks = tasks.filter(task => task.status === 'Created')
    const inProcessTasks = tasks.filter(task => task.status === 'In Process')
    const completedTasks = tasks.filter(task => task.status === 'Completed')
    return (
      <div className="container">
        <Row>
          <Col md={4}>
            <CreateTaskForm id_project={this.props.params.id_project} />
          </Col>
          <Col md={8}>
            {(user.id_role === 1 || (project && user.id_user === project.id_leader)) && (
              <div>
                <div className="tasks-header" style={{ margin: 0 }}>
                  <h2>Progress</h2>
                </div>
                {createdTasks.length === 0 && inProcessTasks.length === 0 && completedTasks.length > 0 &&
                  <div className="tasks-header" style={{ backgroundColor: 'green', margin: 0 }}>
                    <h2>Project Completed</h2>
                  </div>
                }
                <Row>
                  <Col sm={4}>
                    <Card className="progress-card">
                      <span className="count">{createdTasks.length}</span>
                      <span className="name">Pending</span>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card className="progress-card">
                      <span className="count">{inProcessTasks.length}</span>
                      <span className="name">In Process</span>
                    </Card>
                  </Col>
                  <Col sm={4}>
                    <Card className="progress-card">
                      <span className="count">{completedTasks.length}</span>
                      <span className="name">Completed</span>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
            <div className="tasks-header">
              <h2>Tasks</h2>
            </div>
            <Row>
              <Col sm={4}>
                <div className="task-header">
                  <h4>Pending</h4>
                </div>
                {
                  tasks &&
                    tasks.filter(task => task.status === 'Created')
                       .map(task => <TaskCard {...task} changeStatus={this.props.changeStatus}/>)
                }
              </Col>
              <Col sm={4}>
                <div className="task-header">
                  <h4>In Process</h4>
                </div>
                {
                  tasks &&
                    tasks.filter(task => task.status === 'In Process')
                       .map(task => <TaskCard {...task} changeStatus={this.props.changeStatus}/>)
                }
              </Col>
              <Col sm={4}>
                <div className="task-header">
                  <h4>Completed</h4>
                </div>
                {
                  tasks &&
                    tasks.filter(task => task.status === 'Completed')
                       .map(task => <TaskCard {...task} />)
                }
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    )
  }
}
