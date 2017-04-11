import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { Row, Col, Jumbotron } from 'react-bootstrap'

import './HomeView.scss'
import CreateProjectForm from '../containers/CreateProjectForm'
import ProjectActions from 'store/project'
import ProjectCard from './ProjectCard'

export class HomeView extends Component {

  static propTypes = {
    projects: PropTypes.array,
    user: PropTypes.object,
    getProjects: PropTypes.func
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.user && nextProps.user && nextProps.user.id_user !== this.props.user.id_user) || (!this.props.user && nextProps.user)) {
      this.props.getProjects()
    }
    // if (this.props.projects.length < 1) {
    // }
  }

  renderWelcomeHome() {
    return (
      <div className="container">
        <Jumbotron>
          <h1>Introducing MyBusinessTool</h1>
          <p>A tool to manage "X" Business projects by allowing you to:</p>
          <ul>
            <li>Create Projects</li>
            <li>Create Tasks in your Projects</li>
            <li>Get Project Reports</li>
            <li>Manage Users</li>
            <li>Receive Notifications</li>
          </ul>
          <p>All of this, in the most default bootstrap page ever!</p>
        </Jumbotron>
      </div>
    )
  }

  renderManagerHome() {
    const { projects } = this.props

    return (
      <div className="container">
        <Row>
          <Col sm={4}>
            <CreateProjectForm />
          </Col>
          <Col sm={8}>
            <div className="projects-header">
              <h2>Projects</h2>
            </div>
            <Row>
              {
                projects.map(project => (
                  <Col md={4} sm={6} className="col-project-card">
                    <ProjectCard {...project} />
                  </Col>
                ))
              }
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  renderAdminHome() {
    const { projects } = this.props

    return (
      <div className="container">
        <Row>
          <Col sm={4}>
            <CreateProjectForm />
          </Col>
          <Col sm={8}>
            <div className="projects-header">
              <h2>Projects</h2>
            </div>
            <Row>
              {
                projects.map(project => (
                  <Col md={4} sm={6} className="col-project-card">
                    <ProjectCard {...project} />
                  </Col>
                ))
              }
            </Row>
          </Col>
        </Row>
      </div>
    )
  }

  renderEmployeeHome() {
    const { projects } = this.props

    return (
      <div className="container">
        <div className="projects-header">
          <h2>Projects</h2>
        </div>
        <Row>
          {
            projects.map(project => (
              <Col sm={4} className="col-project-card">
                <ProjectCard {...project} />
              </Col>
            ))
          }
        </Row>
      </div>
    )
  }

  render() {
    const { user } = this.props

    if (!user) return this.renderWelcomeHome()
    if (user.id_role === 1) {
      return this.renderAdminHome()
    } else if (user.id_role === 2) {
      return this.renderManagerHome()
    } else if (user.id_role === 3) {
      return this.renderEmployeeHome()
    }

    return this.renderWelcomeHome()
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user,
  projects: state.project.projects
})

const mapDispatchToProps = (dispatch) => ({
  getProjects: () => dispatch(ProjectActions.getProjects())
})

export default connect(mapStateToProps, mapDispatchToProps)(HomeView)
