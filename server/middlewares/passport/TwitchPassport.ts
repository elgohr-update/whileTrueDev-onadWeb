import OAuth2Strategy from 'passport-oauth2';

class Strategy extends OAuth2Strategy {
  constructor(
    options: OAuth2Strategy.StrategyOptionsWithRequest,
    verify: OAuth2Strategy.VerifyFunctionWithRequest
  ) {
    super(options, verify);

    this.name = 'twitch';

    this._oauth2.setAuthMethod('Bearer');
    this._oauth2.useAuthorizationHeaderforGET(true);
  }

  /**
   * Retrieve user profile from Twitch.
   *
   * This function constructs a normalized profile, with the following properties:
   *   - `provider`         always set to `twitch`
   *   - `id`
   *   - `username`
   *   - `displayName`
   * @param {String} accessToken
   * @param {Function} done
   * @api protected
   */
  userProfile(accessToken: string, done: (err?: Error | null, profile?: any) => void): void {
    this._oauth2.get(
      'https://api.twitch.tv/helix/users',
      accessToken,
      (err, body, res): void => {
        if (err) {
          console.log(err);
          return done(new OAuth2Strategy.InternalOAuthError('failed to fetch user profile', err));
        }

        console.log(body);

        try {
          if (typeof body === 'string') {
            done(null, {
              ...JSON.parse(body).data[0],
              provider: 'twitch'
            });
          }
        } catch (e) {
          return done(e);
        }
      }
    );
  }

  authorizationParams(options: any): object {
    console.log(this.name);
    const params: {[key: string]: any} = {};
    if (options.forceVerify) {
      params.force_verify = !!options.forceVerify;
    }
    return params;
  }
}

export default { Strategy };
