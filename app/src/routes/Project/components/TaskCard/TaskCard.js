import React, { PropTypes } from 'react'
import { Button, ButtonToolbar } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Card from 'components/Card'
import url from 'utils/url'



export const TaskCard = (props) => {
  const task = {
    id_task: props.id_task,
    name: props.name,
    description: props.description,
  }
  let button = null;
  if(props.status === "Created"){
    let t = Object.assign({},task,{id_task_status: 2});
    button = <Button bsStyle="info" bsSize="small"  style={{marginBottom: '3px', marginLeft:'5px'}} onClick={(e) => props.changeStatus(t)}> Process task! </Button>
  }
  else if(props.status === "In Process"){
    let t1 = Object.assign({},task,{id_task_status: 3});
    let t = Object.assign({},task,{id_task_status: 1});
    button =
    <div>
        <Button bsStyle="info" bsSize="small"  style={{marginBottom: '3px', marginLeft:'5px'}} onClick={(e) => props.changeStatus(t)}> Suspend task! </Button>
        <Button bsStyle="info" bsSize="small"  style={{marginBottom: '3px', marginLeft:'5px'}} onClick={(e) => props.changeStatus(t1)}> End task! </Button>
    </div>

  }

  return <Card className="task-card" padded={false}>
    <header className="card-header">
      <h4>{props.name}</h4>
    </header>

    <div className="card-body">
      <p className="description">{props.description}</p>
    </div>

    <footer className="card-footer" >
      <ButtonToolbar>
      <LinkContainer to={url(`/task/${props.id_task}`)}>
        <Button className="primary-btn">View Task</Button>
      </LinkContainer>
      </ButtonToolbar>
      <ButtonToolbar style={{paddingTop: '10px'}}>
      {button}
      </ButtonToolbar>
    </footer>
  </Card>
}



TaskCard.propTypes = {
  id_task: PropTypes.number,
  name: PropTypes.string,
  description: PropTypes.string
}

export default TaskCard
