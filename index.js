
const express = require('express')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const cors = require('cors')
const webpush = require('web-push')
const cron = require('node-cron')

const app = express()

dotenv.config()

app.use(cors())
app.use(bodyParser.json())

webpush.setVapidDetails(process.env.WEB_PUSH_CONTACT, process.env.PUBLIC_VAPID_KEY, process.env.PRIVATE_VAPID_KEY)

app.get('/', (req, res) => {
  res.send('Hello world!')
})

let USERS = []

app.post('/notifications/subscribe', (req, res) => {
  const subscription = req.body

  console.log(subscription)

  const payload = JSON.stringify({
    title: 'Hello!',
    body: 'It works.',
  })
  USERS.push(subscription)
  
  res.status(200).json({'success': true})
});



cron.schedule("*/30 * * * * *", function() {
    if (USERS.length <= 0) {
        return;
    }
    const payload = JSON.stringify({
        title: 'Hello!',
        body: 'It works.',
      })
    USERS.forEach(e => {
        
        webpush.sendNotification(e, payload)
            .then(result => console.log(result))
            .catch(e => console.log(e.stack))
    });
  });


app.listen(9000, () => console.log('The server has been started on the port 9000'))



