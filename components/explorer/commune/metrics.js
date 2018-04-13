import React from 'react'
import PropTypes from 'prop-types'

import FaGroup from 'react-icons/lib/fa/group'
import FaArrowsAlt from 'react-icons/lib/fa/arrows-alt'

const Metrics = ({population, surface}) => (
  <div className='metrics'>
    <div className='metric'>
      <FaGroup size={40} />
      <div>{population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} habitants</div>
    </div>
    <div className='metric'>
      <FaArrowsAlt size={40} />
      <div>{surface / 100} km²</div>
    </div>
    <style jsx>{`
      .metrics {
        display: grid;
        text-align: center;
      }

      .metric {
        display: grid;
        justify-items: center;
        align-self: center;
      }
        `}</style>
  </div>
)

Metrics.propTypes = {
  population: PropTypes.number.isRequired,
  surface: PropTypes.number.isRequired
}

export default Metrics
