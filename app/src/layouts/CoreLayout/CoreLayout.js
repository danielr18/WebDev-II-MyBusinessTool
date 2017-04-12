import React from 'react'
import { connect } from 'react-redux'
import NotificationSystem from 'react-notification-system'
import _ from 'lodash'

import SocketActions from 'store/socket'
import Header from '../../containers/Header'
import './CoreLayout.scss'
import '../../styles/core.scss'

export class CoreLayout extends React.Component {
  static propTypes = {
    children : React.PropTypes.element.isRequired,
    markNotificationAsRead: React.PropTypes.func,
    notifications: React.PropTypes.object
  }

  componentDidMount() {
    this.notificationSystem = this.refs.notificationSystem
  }

  componentDidUpdate() {
    _.each(this.props.notifications, (notification, id) => {
      this.notificationSystem.addNotification({
        message: notification.msg,
        level: notification.level
      })
      this.props.markNotificationAsRead(id)
    })
  }

  render() {
    return (
      <div>
        <NotificationSystem ref="notificationSystem" />
        <Header />
        <div className="core-layout__viewport">
          {this.props.children}
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  notifications: state.ws.notifications
})

const mapDispatchToProps = (dispatch) => ({
  markNotificationAsRead: id => dispatch(SocketActions.markNotificationAsRead(id))
})

export default connect(mapStateToProps, mapDispatchToProps)(CoreLayout)
