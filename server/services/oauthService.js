/**
 * OAuth 2.0 Service for Google, GitHub, LinkedIn, and Facebook
 * Uses native Node.js fetch (Node 18+) with zero external dependencies.
 */

export const isProviderConfigured = (provider) => {
  switch (provider) {
    case "google":
      return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    case "github":
      return Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
    case "linkedin":
      return Boolean(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);
    case "facebook":
      return Boolean(process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET);
    default:
      return false;
  }
};

/**
 * Generate OAuth 2.0 consent screen redirect URL
 */
export const getAuthorizationUrl = (provider, redirectUri, state = "") => {
  const encRedirect = encodeURIComponent(redirectUri);
  const stateQuery = state ? `&state=${encodeURIComponent(state)}` : "";

  switch (provider) {
    case "google": {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      if (!clientId) throw new Error("GOOGLE_CLIENT_ID is not configured in .env");
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encRedirect}&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=select_account${stateQuery}`;
    }

    case "github": {
      const clientId = process.env.GITHUB_CLIENT_ID;
      if (!clientId) throw new Error("GITHUB_CLIENT_ID is not configured in .env");
      return `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encRedirect}&scope=read:user%20user:email${stateQuery}`;
    }

    case "linkedin": {
      const clientId = process.env.LINKEDIN_CLIENT_ID;
      if (!clientId) throw new Error("LINKEDIN_CLIENT_ID is not configured in .env");
      return `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${encRedirect}&scope=openid%20profile%20email${stateQuery}`;
    }

    case "facebook": {
      const appId = process.env.FACEBOOK_APP_ID;
      if (!appId) throw new Error("FACEBOOK_APP_ID is not configured in .env");
      return `https://www.facebook.com/v19.0/dialog/oauth?client_id=${appId}&redirect_uri=${encRedirect}&scope=email,public_profile${stateQuery}`;
    }

    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

/**
 * Exchange OAuth authorization code for verified user profile details
 */
export const getProfileFromCode = async (provider, code, redirectUri) => {
  switch (provider) {
    case "google":
      return await getGoogleProfile(code, redirectUri);
    case "github":
      return await getGithubProfile(code, redirectUri);
    case "linkedin":
      return await getLinkedinProfile(code, redirectUri);
    case "facebook":
      return await getFacebookProfile(code, redirectUri);
    default:
      throw new Error(`Unsupported OAuth provider: ${provider}`);
  }
};

/* ------------------- GOOGLE ------------------- */
async function getGoogleProfile(code, redirectUri) {
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange Google code");
  }

  const profileRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const profile = await profileRes.json();
  if (!profileRes.ok) throw new Error("Failed to fetch Google user profile");

  return {
    provider: "google",
    providerId: profile.sub,
    email: profile.email,
    name: profile.name || profile.given_name || "Google User",
    image: profile.picture || "",
  };
}

/* ------------------- GITHUB ------------------- */
async function getGithubProfile(code, redirectUri) {
  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange GitHub code");
  }

  const userRes = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
      "User-Agent": "froggie-oauth-app",
      Accept: "application/json",
    },
  });

  const userData = await userRes.json();
  if (!userRes.ok) throw new Error("Failed to fetch GitHub user profile");

  let email = userData.email;
  // If primary email is hidden, fetch user's verified emails
  if (!email) {
    try {
      const emailRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "User-Agent": "froggie-oauth-app",
          Accept: "application/json",
        },
      });
      const emails = await emailRes.json();
      if (Array.isArray(emails)) {
        const primary = emails.find((e) => e.primary && e.verified) || emails[0];
        if (primary) email = primary.email;
      }
    } catch (e) {
      console.warn("Could not fetch private GitHub emails:", e.message);
    }
  }

  if (!email) {
    email = `${userData.id}+${userData.login}@users.noreply.github.com`;
  }

  return {
    provider: "github",
    providerId: String(userData.id),
    email,
    name: userData.name || userData.login || "GitHub User",
    image: userData.avatar_url || "",
  };
}

/* ------------------- LINKEDIN ------------------- */
async function getLinkedinProfile(code, redirectUri) {
  const tokenRes = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      client_id: process.env.LINKEDIN_CLIENT_ID,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error_description || tokenData.error || "Failed to exchange LinkedIn code");
  }

  const profileRes = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });

  const profile = await profileRes.json();
  if (!profileRes.ok) throw new Error("Failed to fetch LinkedIn user profile");

  return {
    provider: "linkedin",
    providerId: profile.sub,
    email: profile.email,
    name: profile.name || `${profile.given_name || ""} ${profile.family_name || ""}`.trim() || "LinkedIn User",
    image: profile.picture || "",
  };
}

/* ------------------- FACEBOOK ------------------- */
async function getFacebookProfile(code, redirectUri) {
  const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&client_secret=${process.env.FACEBOOK_APP_SECRET}&code=${code}`;

  const tokenRes = await fetch(tokenUrl);
  const tokenData = await tokenRes.json();

  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(tokenData.error?.message || "Failed to exchange Facebook code");
  }

  const profileUrl = `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${tokenData.access_token}`;
  const profileRes = await fetch(profileUrl);
  const profile = await profileRes.json();

  if (!profileRes.ok) throw new Error(profile.error?.message || "Failed to fetch Facebook user profile");

  const email = profile.email || `${profile.id}@facebook.user`;
  const image = profile.picture?.data?.url || "";

  return {
    provider: "facebook",
    providerId: String(profile.id),
    email,
    name: profile.name || "Facebook User",
    image,
  };
}
