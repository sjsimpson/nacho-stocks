const production = {
  apiURL: 'https://api.nachostocks.com',
}

const development = {
  apiURL: 'http://localhost:3003',
}

const config = process.env.NODE_ENV === 'development' ? development : production

export default config
