import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "547438454297-7doqioabu0uar7k4m8ksp74kek9695ol.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if user exists in your database or create a new one
      User.findOne({ googleId: profile.id })
        .then((existingUser) => {
          if (existingUser) {
            return done(null, existingUser);
          }
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value,
          });
          newUser.save().then((user) => done(null, user));
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
  User.findById(id)
    .then((user) => done(null, user))
    .catch((err) => done(err));
});

export default passport;
