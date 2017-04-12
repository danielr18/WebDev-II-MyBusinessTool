import React, { Component, PropTypes } from 'react'
import { IndexLink } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import {
  Navbar,
  Nav,
  NavItem,
  NavDropdown,
  FormGroup,
  Button,
  ControlLabel,
  FormControl
} from 'react-bootstrap'
import { connect } from 'react-redux'

import './Header.scss'
import url from '../../utils/url'
import UserActions from '../../store/user'
import SocketActions from '../../store/socket'

export class Header extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: 'admin@gmail.com',
      password: '12345678',
      isAuthDropdownOpen: false
    }
  }

  static propTypes = {
    login: PropTypes.func,
    signout: PropTypes.func,
    connectSocket: PropTypes.func,
    disconnectSocket: PropTypes.func,
    user: PropTypes.object
  }

  componentDidMount() {
    if (this.props.user) {
      this.props.connectSocket('ws://localhost:8080/MyBusinessTool/notifications')
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== this.props.user) {
      this.setState({
        isAuthDropdownOpen: false
      })
    }

    if (!this.props.user && nextProps.user) {
      this.props.connectSocket('ws://localhost:8080/MyBusinessTool/notifications')
    }

    if (this.props.user && !nextProps.user) {
      this.props.disconnectSocket()
    }
  }

  onAuthDropdownToggle = (isOpen, e) => {
    if (e.target.tagName !== 'REACT') {
      this.setState({
        isAuthDropdownOpen: isOpen
      })
    }
  }

  onEmailChange = e => {
    this.setState({
      email: e.target.value
    })
  }

  onPasswordChange = e => {
    this.setState({
      password: e.target.value
    })
  }

  renderAuthDropdown = () => {
    const { isAuthDropdownOpen, email, password } = this.state

    return (
      <NavDropdown
        eventKey={3}
        title="Sign In"
        id="auth-dropdown"
        open={isAuthDropdownOpen}
        onToggle={this.onAuthDropdownToggle}
      >
        <Navbar.Form>
          <FormGroup controlId="formHorizontalEmail">
            <ControlLabel>Email</ControlLabel>
            <FormControl
              type="email"
              placeholder="Email"
              onChange={this.onEmailChange}
              value={email}
            />
          </FormGroup>

          <FormGroup controlId="formHorizontalPassword">
            <ControlLabel>Password</ControlLabel>
            <FormControl
              type="password"
              placeholder="Password"
              onChange={this.onPasswordChange}
              value={password}
            />
          </FormGroup>

          <FormGroup className="login-btn">
            <Button
              type="submit"
              onClick={() => this.props.login(email, password)}
            >
              Sign in
            </Button>
          </FormGroup>
        </Navbar.Form>
      </NavDropdown>
    )
  }

  renderUserDropdown = () => {
    const { isAuthDropdownOpen } = this.state
    const { user } = this.props

    return (
      <NavDropdown
        eventKey={3}
        title={user.name}
        id="user-dropdown"
        open={isAuthDropdownOpen}
        onToggle={this.onAuthDropdownToggle}
      >
        <div className="user-dropdown">
          <Button
            className="logout-btn"
            onClick={this.props.signout}
          >
            Sign Out
          </Button>
        </div>
      </NavDropdown>
    )
  }

  render() {
    const { user } = this.props

    return (
      <Navbar inverse collapseOnSelect>
        <Navbar.Header>
          <Navbar.Brand>
            <IndexLink to={url('/')}>
              My Business Tool
            </IndexLink>
          </Navbar.Brand>
          <Navbar.Toggle />
        </Navbar.Header>
        <Navbar.Collapse>
          <Nav />
          <Nav pullRight>
            {user ? (
              this.renderUserDropdown()
            ) : (
              this.renderAuthDropdown()
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}

const mapStateToProps = (state) => ({
  user: state.user.user
})

const mapDispatchToProps = (dispatch) => ({
  login: (email, password) => dispatch(UserActions.login(email, password)),
  signout: () => dispatch(UserActions.signout()),
  connectSocket: (url) => dispatch(SocketActions.wsConnect(url)),
  disconnectSocket: () => dispatch(SocketActions.wsDisconnect())
})

export default connect(mapStateToProps, mapDispatchToProps)(Header)
