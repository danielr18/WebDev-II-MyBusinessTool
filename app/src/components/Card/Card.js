import React, { PropTypes } from 'react'

export const Card = (props) => (
  <div className={`card ${props.padded && 'padded'} ${props.className}`}  >
    {props.children}
  </div>
)

Card.propTypes = {
  children: PropTypes.node,
  padded: PropTypes.bool,
  className: PropTypes.string
}

Card.defaultProps = {
  padded: true,
  className: ''
}

export default Card
