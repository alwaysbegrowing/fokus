import { NextApiRequest, NextApiResponse } from 'next';

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;


const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;

const identity = 'user';


export default function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {

    const videoGrant = new VideoGrant({
        room: 'cool room',
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        { identity: identity }
    );
    token.addGrant(videoGrant);

    // Serialize the token to a JWT string
    console.log(token.toJwt());

    response.status(200).json({
        token: token.toJwt()
    });

}