import React, { Component, PropTypes } from 'react'
import {
  FormGroup,
  Button,
  Row,
  Col,
  ControlLabel,
  FormControl,
  HelpBlock,
} from 'react-bootstrap'
import './Task.scss'
import Card from 'components/Card'
import axios from 'utils/axios'
import url from 'utils/url'
import DocumentActions from 'store/document'
import { Link } from 'react-router'
export default class Task extends Component {

  constructor(props) {
    super(props)
    this.state = {
      users: [],
      documents : [],
      task_assigned_users: [],
      file : null
    }
  }

  componentDidMount() {
    // this.props.getTask(this.props.params.id_task)
    axios.get(`/api/user?id_task=${this.props.params.id_task}`)
      .then(response => {
        const users = response.data.data
        this.setState({
          users
        })
      })
      .catch(response => {
        this.setState({
          users: []
        })
      })
      // axios.get(`/api/task/docs?id_task=${this.props.params.id_task}`)
      //   .then(response => {
      //     const documents = response.data.data
      //     this.setState({
      //       documents
      //     })
      //   })
      //   .catch(response => {
      //     this.setState({
      //       documents : []
      //     })
      //   })
      this.props.getDocuments(this.props.params.id_task);
  }

  static propTypes = {
    getTask: PropTypes.func,
    params: PropTypes.object
  }

  upload(file){
    var fd = new FormData();
    fd.append("file", file);
    fd.append("id_task",this.props.params.id_task);
    const config = {
            headers: { 'content-type': 'multipart/form-data' }
        };
    this.props.createDocument(fd,config);
  }

  // componentWillReceiveProps(nextProps){
  //   console.log("next props");
  //   console.log(nextProps);
  //   if(this.props !== nextProps){
  //     this.setState({
  //         documents: nextProps.documents
  //       }
  //     );
  //   }
  // }

  download(id_document){
    const u = `http://localhost:8080/MyBusinessTool/static/docs?id_document=${id_document}`;
    axios.post(u,{headers: {"Access-Control-Allow-Origin": "*"}})
      .then(response => {
        window.open(u);
      })
      .catch(response => {
      })
  }

  render() {
    const { users } = this.state
    const { task } = this.props
    const { documents } = this.props
    const u = 'http://localhost:8080/MyBusinessTool/static/docs?id_document=';
    return (
      <div className="container">
        <Row>
          <Col sm={4}>
            <Card>
              <FormGroup value={task ? [] : []}>
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
            </Card>
          </Col>
          <Col sm={4}>
            <Card>
            <ControlLabel>Assigned Documents</ControlLabel>
              {
                documents.map(doc =>
                  <div>
                    <a href={`${u}${doc.id_document}`}>{doc.name}</a><br/>
                  </div>
                )
              }
            </Card>
          </Col>
          <Col sm={4}>
            <Card>
              <FormGroup value={task ? [] : []}>
                <ControlLabel>Related Documents</ControlLabel>
                  <FormControl type="file" value="" style={{color: 'transparent'}} onChange = {e => {
                    let file = e.target.files[0]
                    this.setState({
                      file
                    })
                  }} />
                  <Button type="submit" value="" onClick={(e) => this.upload(this.state.file)}> Submit </Button>
                <HelpBlock>Hold Ctrl to select multiple users</HelpBlock>
              </FormGroup>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
