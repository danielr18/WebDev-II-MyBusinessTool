import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Card from 'components/Card'
import url from 'utils/url'

export const TaskCard = (props) => (
  <Card className="task-card" padded={false}>
    <header className="card-header">
      <h4>{props.name}</h4>
    </header>

    <div className="card-body">
      <p className="description">{props.description}</p>
    </div>

    <footer className="card-footer">
      <LinkContainer to={url(`/project/${props.id_task}`)}>
        <Button className="primary-btn">View Task</Button>
      </LinkContainer>
    </footer>
  </Card>
)

TaskCard.propTypes = {
  id_task: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string
}

export default TaskCard
