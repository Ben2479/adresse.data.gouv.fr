import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import {shuffle} from 'lodash'
import FaCheckSquareO from 'react-icons/lib/fa/check-square-o'
import FaPlus from 'react-icons/lib/fa/plus'
import FaEdit from 'react-icons/lib/fa/edit'

import theme from '../../styles/theme'

import Mapbox from '../mapbox'
import Section from '../section'
import ButtonLink from '../button-link'
import Pie from '../ui/metrics/pie'
import Counter from '../ui/metrics/counter'

import BaseAdresseLocale from './bases-adresse-locales/base-adresse-locale'
import BalMap from './bal-map'

const BasesLocales = React.memo(({datasets, stats}) => {
  const isValidRatio = Math.round((stats.isValid / stats.model['bal-aitf']) * 100)
  const mapData = {
    type: 'FeatureCollection',
    features: datasets.map(dataset => ({
      type: 'Feature',
      properties: {
        id: dataset.id,
        nom: dataset.title,
        license: dataset.license,
        organization: dataset.organization ? dataset.organization.name : null
      },
      geometry: dataset.contour
    }))
  }

  return (
    <div>
      <Section background='white'>
        <div className='intro'>
          <p>La <b>création des voies et des adresses</b> en France est du ressort des <b>communes</b>, via le conseil municipal.<br />{}
          Cette compétence est <b>régulièrement déléguée à un EPCI</b>.</p>
          <p>Une <b>base Adresse locale</b> est donc l’expression de cette compétence, et regroupe toute les adresses d’une collectivité.<br />{}
          Elle est <b>publiée sous sa responsabilité</b>.</p>
          <p>Ces bases de données ont vocation à <b>alimenter les bases nationales</b>, et en particulier la Base Adresse Nationale.</p>
        </div>
      </Section>

      <Section background='white'>
        <h4>Qu’est-ce que le format BAL ?</h4>
        <div>
          <p>L’<a href='http://www.aitf.fr/'>Association des Ingénieurs Territoriaux de France</a> (AITF) a créé en avril 2015 un groupe de travail portant sur la Base Adresse Nationale.</p>
          <p>Les <a href='https://cms.geobretagne.fr/content/travaux-gt-ban-aitf'>travaux de ce groupe</a> ont abouti à la <a href='https://cms.geobretagne.fr/sites/default/files/documents/aitf-sig-topo-adresse-fichier-echange-simplifie-v_1.1_0.pdf'>spécification d’un format d’échange</a>, aujourd’hui en version 1.1.</p>
          <p>Le format <b>BAL 1.1</b> est aujourd’hui le format d’échange à privilégier pour les données Adresse produites localement.</p>
        </div>
        <div className='action'>
          <Link href='/bases-locales/validateur'>
            <ButtonLink>Valider vos données au format BAL <FaCheckSquareO /></ButtonLink>
          </Link>
        </div>
      </Section>

      <Section background='grey'>
        <h4>Créer ou modifier une Base Adresse Locale</h4>
        <div>
          <p>Cet outil permet de générer une nouvelle Base Adresse Locale à partir de la BAN, ou d’éditer une Base Adresse Locale existante.</p>
          <p>Il permet de gérer très simplement les <strong>voies</strong>, les <strong>numéros</strong> et les <strong>positions</strong> des adresses d’une commune ou d’une intercommunalité, mais aussi de gérer des <strong>toponymes</strong>.</p>
          <p>Les données résultantes peuvent ensuite être publiées sous <a href='https://www.etalab.gouv.fr/licence-version-2-0-de-la-licence-ouverte-suite-a-la-consultation-et-presentation-du-decret'>Licence Ouverte</a>.</p>
        </div>
        <div className='action'>

          <div className='button-link'>
            <ButtonLink
              href='https://editeur.adresse.data.gouv.fr/new'
            >
              Créer une nouvelle Base Adresse Locale <FaPlus />
            </ButtonLink>
          </div>

          <div className='button-link'>
            <ButtonLink
              href='https://editeur.adresse.data.gouv.fr/new/upload'
            >
              Modifier une Base Adresse Locale existante <FaEdit />
            </ButtonLink>
          </div>

        </div>
      </Section>

      <Section title='Quelques bases locales déjà publiées' background='white'>
        {shuffle(datasets.filter(d => d.model === 'bal-aitf')).slice(0, 3).map(dataset => (
          <BaseAdresseLocale key={dataset.id} dataset={dataset} />
        ))}
        <div className='centered'>
          <Link href='/bases-locales/jeux-de-donnees'>
            <ButtonLink>
              Voir toutes les Bases Adresse Locales
            </ButtonLink>
          </Link>
        </div>
      </Section>

      <Section title='État du déploiement des Bases Adresse Locales'>
        <Mapbox interactive={false}>
          {(map, marker, popUp) => (
            <BalMap
              map={map}
              popUp={popUp}
              data={mapData}
            />
          )}
        </Mapbox>
      </Section>

      <Section title='Jeux de données publiés' background='white'>
        <div className='stats'>
          <div className='stat'>
            <Counter
              value={stats.count}
              title='Jeux de données publiés'
            />
          </div>

          <div className='stat'>
            <Counter
              value={isValidRatio}
              unit='%'
              color={isValidRatio < 20 ? 'error' : isValidRatio < 50 ? 'warning' : 'success'}
              title='Conformité à la spécification BAL 1.1'
            />
          </div>

          <div className='stat'>
            <Counter
              title='Communes représentées'
              value={stats.communesCount}
            />
          </div>

          <div className='stat'>
            <Counter
              title='Adresses gérées par les collectivités'
              value={stats.numerosCount}
            />
          </div>

          <div className='stat'>
            <Pie
              title='Licences utilisées'
              data={{
                'Licence Ouverte': stats.license.lov2,
                'ODbL 1.0': stats.license['odc-odbl']
              }}
              colors={[theme.colors.green, theme.colors.orange]}
            />
          </div>

        </div>
      </Section>

      <style jsx>{`
        .intro {
          text-align: left;
        }

        .action {
          display: flex;
          flex-flow: row wrap;
          justify-content: center;
          margin-top: 3em;
        }

        .button-link {
          max-width: 400px;
          margin: 0.5em 1em;
        }

        .centered {
          margin: 40px auto;
          display: flex;
          justify-content: center;
        }

        .stats {
          display: flex;
          text-align: center;
          justify-content: space-around;
          align-items: center;
          flex-flow: wrap;
          margin: 2em 0;
        }

        .stat {
          margin: 1em 0.5em;
          width: 300px;
        }

        a {
          text-align: center;
          text-decoration: underline;
        }
        `}</style>
    </div>
  )
})

BasesLocales.propTypes = {
  datasets: PropTypes.array.isRequired,
  stats: PropTypes.shape({
    isValid: PropTypes.number.isRequired,
    model: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    numerosCount: PropTypes.number.isRequired,
    license: PropTypes.object.isRequired
  }).isRequired
}

export default BasesLocales
