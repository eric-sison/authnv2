import db from "@/server/db/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { users, accounts, verifications, sessions } from "@/server/db/schemas/authentication";
import { openAPI } from "better-auth/plugins";
import { passkey } from "better-auth/plugins/passkey";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      users,
      accounts,
      verifications,
      sessions,
    },
    usePlural: true,
  }),

  plugins: [openAPI(), passkey()],

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 mins
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    requireEmailVerification: false, //* Make this dynamic, perhaps?
  },

  advanced: {
    generateId: false, // Handle the generation of ID's manually.
    cookiePrefix: "authn",
  },

  user: {
    /**
     * Rename 'image' field to 'picture' - in compliance with openid connect standard claims.
     *  See: https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims
     */
    fields: {
      image: "picture",
    },

    /**
     * Add openid connect standard claims.
     */
    additionalFields: {
      isActive: {
        type: "boolean",
        required: true,
      },

      givenName: {
        type: "string",
        required: true,
      },

      familyName: {
        type: "string",
        required: true,
      },

      middleName: {
        type: "string",
        required: false,
      },

      nickname: {
        type: "string",
        required: false,
      },

      preferredUsername: {
        type: "string",
        required: false,
      },

      profile: {
        type: "string",
        required: false,
      },

      website: {
        type: "string",
        required: false,
      },

      gender: {
        type: "string",
        required: false,
      },

      birthdate: {
        type: "date",
        required: false,
      },

      zoneinfo: {
        type: "string",
        required: false,
      },

      locale: {
        type: "string",
        required: false,
      },

      phoneNumber: {
        type: "string",
        required: false,
      },

      phoneNumberVerified: {
        type: "boolean",
        required: false,
      },

      address: {
        type: "string", // Just stringify the JSON object later
        required: false,
      },
    },
  },
});

export type ServerSession = typeof auth.$Infer.Session;
