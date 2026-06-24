import passport from 'passport'
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20'
import { User } from '../models/User.model'
import { env } from './env'
import { logger } from '../utils/logger'

passport.use(
  new GoogleStrategy(
    {
      clientID: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      callbackURL: env.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const email = profile.emails?.[0]?.value
        if (!email) return done(new Error('No email in Google profile'))

        let user = await User.findOne({ googleId: profile.id })

        if (!user) {
          user = await User.findOne({ email })
          if (user) {
            user.googleId = profile.id
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value
            }
            await user.save()
          } else {
            user = await User.create({
              googleId: profile.id,
              email,
              name: profile.displayName,
              avatar: profile.photos?.[0]?.value ?? undefined,
            })
            logger.info(`New user created: ${email}`)
          }
        }

        await User.findByIdAndUpdate(user._id, { 'stats.lastActive': new Date() })
        return done(null, user)
      } catch (err) {
        logger.error('Google OAuth strategy error:', err)
        return done(err as Error)
      }
    }
  )
)

export default passport