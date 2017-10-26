import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'

// Unable to pass the css by className, maybe a react-dropzone bug ¯\_(ツ)_/¯
const style = {
  width: '90%',
  margin: '20px auto',
  border: '1px dashed #ccc',
  height: '200px',
  textAlign: 'center',
  lineHeight: '200px'
}

const Holder = ({file, handleDrop}) => (
  <Dropzone style={style} multiple={false} onDrop={handleDrop}>
    {file[0] ? <h2>{file[0].name}</h2> : <p>Glisser un fichier ici (max 6Mo ou environ 15000 lignes), ou cliquer pour choisir</p>}
  </Dropzone>
)

Holder.propTypes = {
  file: PropTypes.array.isRequired,
  handleDrop: PropTypes.func.isRequired
}

export default Holder
