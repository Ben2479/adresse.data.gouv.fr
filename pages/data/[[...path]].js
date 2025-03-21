import fs from 'node:fs'
import path from 'node:path'
import mime from 'mime'
import PropTypes from 'prop-types'
import {Download} from 'react-feather'

import Head from '@/components/head'
import Section from '@/components/section'
import Page from '@/layouts/main'
import Data from '@/views/data'
import getAnalyticsPusher, {getDownloadTrackData} from '@/lib/util/analytics-tracker'

import ErrorPage from '../_error'

const PATH = process.env.PATH_STATIC_FILE
const rootLink = {
  href: '/donnees-nationales',
  label: 'Données nationales',
}

const getDirectories = path => (
  fs
    .readdirSync(path, {withFileTypes: true})
    .filter(({name}) => !name.startsWith('.')) // Hide hidden files
    .filter(entry => !entry.isSymbolicLink()) // Hide Symbolic links
    .map(entry => ({
      name: entry.name,
      isDirectory: entry.isDirectory()
    }))
)

export function getServerSideProps(context) {
  const {path: paramPath = []} = context.params
  const fileName = `${paramPath.join('/')}`
  const filePath = path.join(PATH, fileName)
  const date = new Date()
  const formattedDate = new Intl.DateTimeFormat('fr', {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(date).replace(/,/g, '\'').replace(/ /g, ' ')

  let stat

  if (!filePath.startsWith(PATH)) {
    console.warn(`[${formattedDate} - WARNING]`, `Attempted illegal access to ${filePath}`)
    context.res.statusCode = 404
    return {
      props: {errorCode: 404},
    }
  }

  try {
    stat = fs.lstatSync(filePath)
  } catch (err) {
    console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
    context.res.statusCode = 404
    return {
      props: {errorCode: 404},
    }
  }

  if (stat.isDirectory()) {
    return {
      props: {
        title: ['data', ...paramPath].join('/') || '',
        path: paramPath || [],
        data: getDirectories(filePath) || [],
      }
    }
  }

  try {
    const fileExtension = path.extname(fileName)
    const contentType = mime.getType(fileExtension) || 'application/octet-stream'
    const fileContents = fs.readFileSync(filePath)
    const sendToTracker = getAnalyticsPusher()

    context.res.setHeader('Content-Type', contentType)
    context.res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    context.res.statusCode = 200
    context.res.end(fileContents)

    sendToTracker(getDownloadTrackData({
      downloadDataType: path.dirname(fileName).split('/')[0],
      downloadFileName: fileName,
      nbDownload: 1
    }))
  } catch (err) {
    console.warn(`[${formattedDate} - ERROR]`, 'File access error:', err)
    return {
      props: {
        errorCode: 502,
        errorMessage: 'Une erreur est survenue lors de la génération du téléchargement.',
      },
    }
  }

  return {props: {}}
}

export default function DataPage({title, path, data, errorCode, errorMessage}) {
  return errorCode && errorCode !== 200 ?
    (<ErrorPage code={errorCode} message={errorMessage} />) :
    (path ? (
      <Page title={`BAN OpenData : ${title}`}>
        <Head
          title='Téléchargez les données de la BAN'
          icon={<Download size={56} alt='' aria-hidden='true' />}
        />
        <Section>
          <Data {...{root: rootLink, path, data}} />
        </Section>
      </Page>
    ) : null)
}

DataPage.propTypes = {
  title: PropTypes.string,
  path: PropTypes.arrayOf(PropTypes.string),
  data: PropTypes.arrayOf(PropTypes.object),
  errorCode: PropTypes.number,
  errorMessage: PropTypes.string,
}
