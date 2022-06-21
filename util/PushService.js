var admin=require('firebase-admin')
var serviceAccount=require('../push.json')

class PushService {
    constructor() {
        
    }

    init() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }

    send(token, from_user, msg) {
        var fcm_message = {
            notification: {
                title: from_user + ' 님으로 부터 새 메시지가 도착했습니다.',
                body: msg
            },
            data: {
                title: from_user + ' 님으로 부터 새 메시지가 도착했습니다.',
                value: msg
            },
            token: token
        }
    
        admin.messaging().send(fcm_message)
        .then(function(response){
            console.log('Push Send OK')
        })
        .catch(function(error){
            console.log('Push Send Error')
        });
    }
}

module.exports = PushService



