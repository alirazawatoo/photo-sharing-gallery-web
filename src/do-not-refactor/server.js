// Supplied by the exercise as the fixed API boundary. The response shape is
// unchanged; the only edits reject malformed query params (instead of letting
// page=-1 wrap around to earlier items) and export the app so it can be tested.

const express = require('express')
const cors = require('cors')
const path = require('path')

const config = require('./config.js')
const { get: getImages } = require('./image-db.js')

const CATEGORIES = ['nature', 'architecture', 'fashion']
const MAX_PAGE = 10000

const app = express()

app.use(cors())

// Serve image files
app.use('/static', express.static(path.join(__dirname, 'public')))

function parsePage(raw) {
  if (raw === undefined) return 1
  if (typeof raw !== 'string' || !/^[1-9]\d*$/.test(raw)) return null
  const page = Number(raw)
  return page <= MAX_PAGE ? page : null
}

/**
 * Retrieve a list of images with response limit of 3 items only
 * @param  {('nature'|'architecture'|'fashion')}  category  Image category
 * @param  {Number}                               page      Page number
 */
app.get('/images', (req, res) => {
  const category = req.query.category
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return res.status(400).send({ error: `category must be one of ${CATEGORIES.join(', ')}` })
  }

  const page = parsePage(req.query.page)
  if (page === null) {
    return res.status(400).send({ error: `page must be an integer between 1 and ${MAX_PAGE}` })
  }

  const images = getImages(category, page)

  // Simulate latency
  setTimeout(() => {
    res.send(images)
  }, config.latencyMs)
})

if (require.main === module) {
  app.listen(config.port, () => {
    console.log(`Photo Sharing App API listening at http://localhost:${config.port}`)
  })
}

module.exports = app
