const https = require('https');
const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

module.exports = {

    sendNotification(token, data) {

        const notification = JSON.stringify({
            'to': token,
            "data": {
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=YOUR_API_AUTHORIZATION_FROM_FIRESTORE_CLOUD_MESSAGING'
            }
        }

        const req = https.request(options, (res) => {
            console.log('Status code Notificattion', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (error) => {
            console.error(error)
        })

        req.write(notification);
        req.end();
    },
    sendNotificationToMultipleDevices(tokens, data) {

        const notification = JSON.stringify({
            'registration_ids': tokens,
            "data": {
                'title': data.title,
                'body': data.body,
                'id_notification': data.id_notification,
            },
            'priority': 'high',
            'ttl': '4500s'
        });

        const options = {
            hostname: 'fcm.googleapis.com',
            path: '/fcm/send',
            method: 'POST',
            port: 443,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'key=YOUR_API_AUTHORIZATION_FROM_FIRESTORE_CLOUD_MESSAGING'
            }
        }

        const req = https.request(options, (res) => {
            console.log('Status code Notificattion', res.statusCode);
            res.on('data', (d) => {
                process.stdout.write(d)
            })
        })

        req.on('error', (error) => {
            console.error(error)
        })

        req.write(notification);
        req.end();
    }


}
