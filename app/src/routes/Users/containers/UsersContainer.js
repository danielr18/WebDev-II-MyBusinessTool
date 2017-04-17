import { connect } from 'react-redux'
import AdminActions from 'store/admin'

/*  This is a container component. Notice it does not contain any JSX,
    nor does it import React. This component is **only** responsible for
    wiring in the actions and state necessary to render a presentational
    component - in this case, the counter:   */

import Users from '../components/Users'

/*  Object of action creators (can also be function that returns object).
    Keys will be passed as props to presentational components. Here we are
    implementing our wrapper around increment; the component doesn't care   */

const mapDispatchToProps = (dispatch) => ({
  //eslint-disable-next-line
  getUsers: () => dispatch(AdminActions.getUsers()),
  deleteUser: (id_user) => dispatch(AdminActions.deleteUser(id_user)),
  editUser: (user) => dispatch(AdminActions.editUser(user)),
  addUser: (user) => dispatch(AdminActions.addUser(user))
})

const mapStateToProps = (state) => ({
  user : state.user.user,
  users : state.admin.users
})

export default connect(mapStateToProps, mapDispatchToProps)(Users)
