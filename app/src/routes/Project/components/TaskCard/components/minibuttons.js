import React, { PropTypes } from 'react'
import { Button } from 'react-bootstrap'
import Card from 'components/Card'
import url from 'utils/url'

export const TaskCard = (props) => (
  <Card className="task-card" padded={false}>

    <div className="card-body">
      {
        if(props.currentStatus === "Pending"){
          <Button bsStyle="info" onClick={(e) => changeStatus(2)}> </Button>
        }
        else if(props.currentStatus === "In Process"){
          <Button bsStyle="info" onClick={(e) => changeStatus(3)}> </Button>
        }
      }
    </div>

  </Card>
)

TaskCard.propTypes = {
    changeStatus : PropTypes.func.isRequired
    currentStatus : PropTypes.String.isRequired
}

mapStateToProps{
    
}

export default TaskCard
