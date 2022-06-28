import * as functions from "firebase-functions"
import * as admin from "firebase-admin"

import { TheThingsNetWebhookBody } from "./requestdata"

admin.initializeApp(functions.config().firebase)

exports.pushData = functions
    .region('europe-west1')
    .https.onRequest(async (req, res) => {
        
    try {

        // Verify login data in basic auth header
        const logins = process.env.BASIC_AUTH_LOGINS?.replace(" ", "").split(",")
        
        const authTokens = logins?.map(login => (
            `Basic ${Buffer.from(login).toString('base64')}`
        ))

        if (req.headers.authorization === undefined || !authTokens?.includes(req.headers.authorization)) {
            throw new Error('Auth Error: Basic Auth failed')
        }

        const username = new Buffer(req.headers.authorization.replace("Basic ", ""), 'base64').toString('ascii').split(':')[0]


        // Grab relevant data from the data recieved 
        const data:TheThingsNetWebhookBody = req.body;

        const decodedPayload = data.uplink_message.decoded_payload
        const timestampReceivedAt = data.uplink_message.received_at

        if (decodedPayload == null) {
            throw new Error('Payload error: decoded_payload empty')
        }
        if (timestampReceivedAt == null) {
            throw new Error('Payload error: received_at empty')
        }


        // Push data to database
        const databaseEntry = {
            ...decodedPayload,
            timestamp: timestampReceivedAt
        }

        functions.logger.log(JSON.stringify(databaseEntry))


        let databaseError
        // replace old data in /currentData
        admin.database().ref(`/${username}/currentData`).set(databaseEntry, (error) => {
            databaseError = error
        }) 

        // Push new element to /history
        admin.database().ref(`/${username}/history`).push().set(databaseEntry, (error) => {
            databaseError = error
        }) 

        if (databaseError) {
            throw new Error(`Database Error: ${databaseError}`)
        }


        // Send webhook response that everything went ok
        res.json({
            status: "success",
            data: null
        })

    } catch (error) {
        
        let errorMessage
        if (error instanceof Error) {
            errorMessage = error.message
        } else {
            errorMessage = error
        }

        functions.logger.error(errorMessage)
        
        // Send webhook error response in case something goes wrong
        res.json({
            status: "error",
            message: errorMessage
        })
    }

})
