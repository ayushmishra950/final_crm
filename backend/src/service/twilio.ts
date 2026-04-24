import twilio from "twilio";

const accountSid = "ACcba9e0fc56604eb7931d7d016d55cf2a";
const authToken = "YOUR_AUTH_TOKEN";
const phoneNumber = "+14157542702";

const client = twilio(accountSid, authToken);

let otpStore: { [key: string]: number } = {};

async function sendOtp(phone: string) {
    const otp = Math.floor(1000 + Math.random() * 9000);

    otpStore[phone] = otp;

    try {
        await client.messages.create({
            body: `Your OTP is ${otp}`,
            from: phoneNumber,
            to: `whatsapp:${phone}`
        });

        return { success: true, otp };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

export { sendOtp, otpStore };