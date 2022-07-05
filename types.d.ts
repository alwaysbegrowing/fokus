declare module "iron-session" {
    interface IronSessionData {
        siwe?: SiweMessage;
        nonce?: string
    }
}

declare module 'next' {
    interface NextApiRequest {
        session: IronSessionData
    }
}

export default {}