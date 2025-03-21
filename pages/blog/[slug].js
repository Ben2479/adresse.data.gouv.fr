import PropTypes from 'prop-types'
import {BookOpen} from 'react-feather'

import {getSinglePost} from '@/lib/blog'

import Page from '@/layouts/main'

import Head from '@/components/head'
import Post from '@/components/post'

function SlugPage({post}) {
  return (
    <Page title={post.title} description={post.excerpt} image={post.feature_image}>
      <Head title='Le Blog de L’Adresse' icon={<BookOpen size={56} alt='' aria-hidden='true' />} />
      <Post {...post} backLink='/blog' />
    </Page>
  )
}

SlugPage.defaultProps = {
  post: null
}

SlugPage.propTypes = {
  post: PropTypes.shape({
    title: PropTypes.string.isRequired,
    excerpt: PropTypes.string.isRequired,
    feature_image: PropTypes.string /* eslint-disable-line camelcase */
  })
}

export async function getServerSideProps({query}) {
  const post = await getSinglePost(query.slug)

  if (!post) {
    return {
      notFound: true
    }
  }

  return {
    props: {
      post
    }
  }
}

export default SlugPage
