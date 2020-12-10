import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Image from 'next/image'

import theme from '@/styles/theme'

import Button from '@/components/button'

const Authentification = React.memo(({mail, sendMail, authenticationUrl, publicationRequest}) => {
  return (
    <div className='auth-container'>
      <div>
        <h3>Vous êtes habilité</h3>
        <div className='section'>
          <div className='action column'>
            <p>Je suis un agent de la commune</p>
            <p>Merci de contacter <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>.</p>
          </div>

          <div className='action column'>
            <p>Je suis élu de la commune</p>
            <Link href={authenticationUrl}>
              <a><Image width={280} height={82} className='france-connect' src='/images/FCboutons-10.svg' alt='bouton FranceConnect' /></a>
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h3>Vous n’êtes pas habilité</h3>
        <div className='section column'>
          <p>Je n’ai pas d’habilitation mais je suis en contact avec un élu ou le secrétariat de la commune</p>
          <p>Merci de contacter <a href='mailto:adresse@data.gouv.fr'>adresse@data.gouv.fr</a>.</p>
        </div>
      </div>

      <style jsx>{`
        .auth-container > div {
          margin: 1em 0;
        }

        .column {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .section {
          display: flex;
          flex-flow: wrap;
          justify-content: space-around;
          align-items: center;
          text-align: center;
          border-radius: 2px;
          padding: 1em;
          background: ${theme.colors.lighterGrey};
          box-shadow: 0 1px 4px 0 ${theme.boxShadow};
        }

        .france-connect:hover {
          cursor: pointer;
        }

        .disabled {
          color: ${theme.colors.grey};
          font-style: italic;
          margin: 0.5em 0;
        }
        `}</style>
    </div>
  )
})

Authentification.propTypes = {
  mail: PropTypes.string,
  authenticationUrl: PropTypes.string.isRequired,
  sendMail: PropTypes.func.isRequired,
  publicationRequest: PropTypes.func.isRequired
}

Authentification.defaultProps = {
  mail: null
}

export default Authentification
