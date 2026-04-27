import 'dotenv/config';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model";
console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: "/auth/google/callback"
},

    async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;

            if (!email) {
                return done(new Error("Email not found"), undefined);
            }

            let user = await User.findOne({
                $or: [
                    { googleId: profile.id },
                    { email: email }
                ]
            });

            if (!user) {
                user = await User.create({
                    googleId: profile.id,
                    fullName: profile.displayName,
                    email: email,
                    profileImage: profile.photos?.[0]?.value,
                    role: "user",
                });
            } else if (!user.googleId) {
                user.googleId = profile.id;
                await user.save();
            }

            return done(null, user);
        } catch (err) {
            return done(err as Error, undefined);
        }
    }));

passport.serializeUser((user: any, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

export default passport;