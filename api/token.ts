import { NextApiRequest, NextApiResponse } from 'next';

const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;


const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioApiKey = process.env.TWILIO_API_KEY;
const twilioApiSecret = process.env.TWILIO_API_SECRET;



export default function handler(
    request: NextApiRequest,
    response: NextApiResponse,
) {
    const { room_name: room, user_identity: identity } = request.body

    const videoGrant = new VideoGrant({
        room
    });

    // Create an access token which we will sign and return to the client,
    // containing the grant we just created
    const token = new AccessToken(
        twilioAccountSid,
        twilioApiKey,
        twilioApiSecret,
        { identity }
    );
    token.addGrant(videoGrant);

    response.status(200).json({
        token: token.toJwt()
    });

}