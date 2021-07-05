const fs = require('fs')
const fetch = require('isomorphic-fetch')
const jsdom = require('jsdom')
const { JSDOM } = jsdom

async function main () {
  const response = await fetch('https://www.soundtransit.org/ride-with-us/service-alerts/elevator-escalator-service-status')
  const body = await response.text()
  // const body = fs.readFileSync('./sample.html', 'utf8')

  const dom = new JSDOM(body)
  const [elevators, escalators] = [...dom.window.document.querySelectorAll('.content table')].map(table =>
    [...table.querySelectorAll('tr')].map(tr =>
      [...tr.querySelectorAll('td,th')].map(td => td.textContent.trim())
    )
  )
  const data = [
    ...elevators.slice(0,1).map(row => (['Type', ...row])), // header row
    ...elevators.slice(1).map(row => (['Elevator', ...row])),
    ...escalators.slice(1).map(row => (['Escalator', ...row])),
  ]

  console.log(JSON.stringify(data, null, 4))
}
main()
