import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import Card from 'components/Card'

export const ProjectCard = (props) => (
  <Card className="project-card" padded={false}>
    <header className="card-header">
      <h4>{props.name}</h4>
    </header>

    <div className="card-body">
      <p className="description">{props.description}</p>
      <p className="leader">{`Leader: ${props.project_leader.name}`}</p>
    </div>

    <footer className="card-footer">
      <Button className="primary-btn">View Project</Button>
    </footer>
  </Card>
)

ProjectCard.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  project_leader: PropTypes.object,
}

export default ProjectCard
