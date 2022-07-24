const fetch = require("node-fetch")
const URLSearchParams = require("url").URLSearchParams

const URLS = {
  TOKEN: "https://www.deviantart.com/oauth2/token",
  GALLERY: "https://www.deviantart.com/api/v1/oauth2/gallery/",
}
const ALLOWED_ORIGINS = [
  'miketilly.com',
  'miketilly.netlify.app',
  /^localhost:\d{3,4}$/,
]

exports.handler = async function(event, context) {
  try {
    const { DEVIANTART_CLIENT_ID, DEVIANTART_CLIENT_SECRET, DEVIANTART_FOLDER_ID, DEVIANTART_USERNAME } = process.env
    const { queryStringParameters: { offset, limit, mode }, headers: { host } } = event

    const validatedHost = validateHost(host, ALLOWED_ORIGINS);

    const access_token = await fetchAccessToken(DEVIANTART_CLIENT_ID, DEVIANTART_CLIENT_SECRET)
    const gallery = await fetchGallery({
      access_token,
      folderId: DEVIANTART_FOLDER_ID,
      limit,
      mode,
      offset,
      username: DEVIANTART_USERNAME
    })

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": validatedHost || ALLOWED_ORIGINS[0],
        "Cache-Control": "max-age=3600"
      },
      body: JSON.stringify(gallery)
    }
  } catch (err) {
    console.log(err)
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message })
    }
  }
}

function validateHost(host, allowedHosts = []) {
  for (const allowedHost of allowedHosts) {
    if (allowedHost instanceof RegExp) {
      if (allowedHost.test(host)) return host
    } else {
      if (allowedHost === host) return host
    }
  }
  return false
}

async function fetchAccessToken(client_id, client_secret) {
  const params = new URLSearchParams({
    client_id,
    client_secret,
    grant_type: "client_credentials"
  })
  const url = URLS.TOKEN + "?" + params.toString()
  const response = await fetch(url, {
    Accept: "application/json"
  })
  if (!response.ok) {
    return { statusCode: response.status, body: response.statusText }
  }
  const { access_token } = await response.json()
  return access_token
}

async function fetchGallery({ folderId, ...options }) {
  const optionsWithDefaults = {
    limit: 24,
    mature_content: true,
    mode: "newest",
    offset: 0,
    ...options,
  }
  const params = new URLSearchParams(
    Object.fromEntries(
      Object.entries(optionsWithDefaults)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => [key, value.toString()])
    )
  )
  const url = URLS.GALLERY + "/" + folderId + "?" + params.toString()

  const response = await fetch(url, {
    Accept: "application/json"
  })
  if (!response.ok) {
    return { statusCode: response.status, body: response.statusText }
  }
  return await response.json()
}