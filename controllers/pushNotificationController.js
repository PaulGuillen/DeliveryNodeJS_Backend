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
                'Authorization': 'key=AAAAohNDgus:APA91bGoteFysYY3WKLsh9_ieKqjT1bRBC4SI5ZGlwq0zJhKef-bTNlzdDxKa8GvcuagkuU9gXTbXALK3_8-CoeBNwUWm4BBJsUgey3F9A5kXUPuHB08kql4eQSSALIiCRtZT8ppGcYX'
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
                'Authorization': 'key=AAAAohNDgus:APA91bGoteFysYY3WKLsh9_ieKqjT1bRBC4SI5ZGlwq0zJhKef-bTNlzdDxKa8GvcuagkuU9gXTbXALK3_8-CoeBNwUWm4BBJsUgey3F9A5kXUPuHB08kql4eQSSALIiCRtZT8ppGcYX'
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