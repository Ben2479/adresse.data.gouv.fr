import React from 'react'
import dynamic from 'next/dynamic'

import {isWebGLSupported} from '@/lib/browser/webgl'

import Meta from '@/components/meta'
import MainPage from '@/layouts/main'

import Loader from '@/components/loader'
import Notification from '@/components/notification'

import theme from '@/styles/theme'

function MapLoader() {
  return (
    <div className='map-loader-container'>
      <div className='centered'>
        <div className='loading'>
          <Loader />
          Chargement…
        </div>
      </div>
      <style jsx>{`
      .map-loader-container {
        width: 100%;
        height: 100%;
        background: ${theme.backgroundGrey};
      }

      .centered {
        position: relative;
        top: 50%;
      }

      .loading {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
    `}</style>
    </div>
  )
}

function NoWebglError() {
  return (
    <MainPage>
      <Meta title='Attention' description='L’accélération matérielle n’est pas activée sur votre navigateur' />

      <div className='webgl-error'>
        <Notification type='warning'>
          <div>
            <p>L’accélération matérielle n’est pas activée sur votre navigateur, or celle-ci est nécessaire à l’affichage de cette page.</p>
            <p>La plupart du temps cela signifie que vous utilisez un navigateur obsolète ou que cette fonctionnalité a été désactivée volontairement.</p>
            <p>Nous sommes désolés pour le désagrément. N’hésitez pas à <a href='mailto:adresse@data.gouv.fr'>nous contacter</a> pour plus d’informations.</p>
          </div>
        </Notification>
      </div>

      <style jsx>{`
        .webgl-error {
          margin: 100px auto;
          width: 80%;
        }

        a {
          color: ${theme.warningBorder};
        }
      `}</style>
    </MainPage>
  )
}

class MapWrapper extends React.PureComponent {
  state = {
    showMap: false
  }

  componentDidMount() {
    /* eslint-disable node/no-unsupported-features/es-syntax */
    this.MapComponent = isWebGLSupported() ? dynamic(import('./map' /* webpackChunkName: "maplibre-gl" */), {
      ssr: false,
      loading: () => (
        <MapLoader />
      )
    }) : () => (
      <NoWebglError />
    )

    this.setState({
      showMap: true
    })
  }
  /* eslint-enable node/no-unsupported-features/es-syntax */

  render() {
    const {...props} = this.props
    const {showMap} = this.state

    if (showMap) {
      const {MapComponent} = this
      return <MapComponent {...props} />
    }

    return <MapLoader />
  }
}

export default MapWrapper
