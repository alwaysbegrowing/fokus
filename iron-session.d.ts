declare module "iron-session" {
    interface IronSessionData {
        siwe?: SiweMessage;
        nonce?: string
    }
}