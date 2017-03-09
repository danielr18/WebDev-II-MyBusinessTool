import React from 'react'
import { IndexLink, Link } from 'react-router'
import './Header.scss'
import url from '../../utils/url'

export const Header = () => (
  <div>
    <h1>I'm a Duck</h1>
    <IndexLink to={url('/')} activeClassName='route--active'>
      Home
    </IndexLink>
    {' · '}
    <Link to={url('/counter')} activeClassName='route--active'>
      Counter
    </Link>
  </div>
)

export default Header
