import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  isProviderConfigured,
  getAuthorizationUrl,
  getProfileFromCode,
} from "../services/oauthService.js";

const getClientUrl = (req) => {
  const customHost = req?.query?.client_host;
  if (customHost) {
    try {
      const parsed = new URL(customHost);
      return `${parsed.protocol}//${parsed.host}`;
    } catch (_) {}
  }

  const origin = req?.headers?.origin || req?.headers?.referer;
  if (origin) {
    try {
      const parsed = new URL(origin);
      if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") {
        return `${parsed.protocol}//${parsed.host}`;
      }
    } catch (_) {}
  }
  return process.env.CLIENT_URL || "https://froggie.site";
};

const getCallbackUri = (req, provider) => {
  // If explicitly configured with a non-localhost production URL
  if (process.env.SERVER_URL && !process.env.SERVER_URL.includes("localhost")) {
    return `${process.env.SERVER_URL.replace(/\/$/, "")}/api/users/auth/${provider}/callback`;
  }
  const host = req.headers["x-forwarded-host"] || req.get("host");
  const protocol =
    req.headers["x-forwarded-proto"] ||
    req.protocol ||
    (host?.includes("localhost") ? "http" : "https");
  return `${protocol}://${host}/api/users/auth/${provider}/callback`;
};

/**
 * Initiate OAuth consent flow: /api/users/auth/:provider
 */
export const initiateOAuth = (req, res) => {
  const { provider } = req.params;
  const clientUrl = getClientUrl(req);
  const targetRedirect = req.query.redirect || "/";
  const clientHost = req.query.client_host || clientUrl;

  const allowedProviders = ["google", "github", "linkedin", "facebook"];
  if (!allowedProviders.includes(provider)) {
    return res.redirect(`${clientUrl}/login?error=unsupported_provider&provider=${provider}`);
  }

  if (!isProviderConfigured(provider)) {
    return res.redirect(`${clientUrl}/login?error=not_configured&provider=${provider}`);
  }

  try {
    const redirectUri = getCallbackUri(req, provider);

    // Cryptographically resilient state token containing destination redirect and nonce
    const statePayload = JSON.stringify({
      redirect: targetRedirect,
      clientHost,
      nonce: Math.random().toString(36).substring(2),
    });
    const state = Buffer.from(statePayload).toString("base64url");

    console.log(`[OAuth] Initiating ${provider} authentication with redirectUri: ${redirectUri}`);
    const authUrl = getAuthorizationUrl(provider, redirectUri, state);
    return res.redirect(authUrl);
  } catch (error) {
    console.error(`Error initiating OAuth for ${provider}:`, error.message);
    return res.redirect(`${clientUrl}/login?error=initiation_failed&provider=${provider}`);
  }
};

/**
 * Handle OAuth provider callback: /api/users/auth/:provider/callback
 */
export const handleOAuthCallback = async (req, res) => {
  const { provider } = req.params;
  const { code, state, error, error_description } = req.query;

  let targetRedirect = "/";
  let destinationHost = getClientUrl(req);

  // Decode state payload to recover client redirect destination
  if (state) {
    try {
      const parsedState = JSON.parse(Buffer.from(state, "base64url").toString("utf-8"));
      if (parsedState.redirect) targetRedirect = parsedState.redirect;
      if (parsedState.clientHost) destinationHost = parsedState.clientHost;
    } catch (_) {}
  }

  if (error) {
    console.warn(`OAuth error from ${provider}:`, error, error_description);
    return res.redirect(
      `${destinationHost}/login?error=access_denied&provider=${provider}`
    );
  }

  if (!code) {
    return res.redirect(
      `${destinationHost}/login?error=missing_code&provider=${provider}`
    );
  }

  try {
    const redirectUri = getCallbackUri(req, provider);
    const profile = await getProfileFromCode(provider, code, redirectUri);

    if (!profile || !profile.email) {
      return res.redirect(
        `${destinationHost}/login?error=missing_email&provider=${provider}`
      );
    }

    // 1. Check if user already exists by email
    let user = await User.findOne({ email: profile.email.toLowerCase() });

    if (user) {
      // Update missing photo or provider linking
      let shouldSave = false;
      if (!user.image && profile.image) {
        user.image = profile.image;
        shouldSave = true;
      }
      if (!user.providerId && profile.providerId) {
        user.providerId = profile.providerId;
        user.authProvider = provider;
        shouldSave = true;
      }
      if (shouldSave) {
        await user.save();
      }
    } else {
      // 2. Create new user with profile info
      user = await User.create({
        name: profile.name,
        email: profile.email.toLowerCase(),
        image: profile.image || "",
        authProvider: provider,
        providerId: profile.providerId,
      });
    }

    // 3. Issue JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // 4. Securely redirect to client login with token and target redirect destination
    return res.redirect(
      `${destinationHost}/login?token=${token}&provider=${provider}&redirect=${encodeURIComponent(
        targetRedirect
      )}`
    );
  } catch (err) {
    console.error(`OAuth callback failure for ${provider}:`, err.message);
    return res.redirect(
      `${destinationHost}/login?error=auth_failed&provider=${provider}`
    );
  }
};
