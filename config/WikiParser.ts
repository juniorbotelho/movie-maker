export const Config = {
  ...Object.defineProperty({}, 'wikiParser', {
    enumerable: true,
    configurable: false,
    writable: true,
    value: 'wikipedia',
  }),

  /**
   * Responsible for verifying if the configuration
   * actually exists in the context of the application,
   * so the program will run in necessary cases.
   */
  includes(config: string) {
    if (config.split('|').includes(this['wikiParser']))
      return {
        async is(condition: string, fnCallback: () => Promise<void>) {
          if (condition === Config['wikiParser']) await fnCallback()
          return this
        },
      }

    /**
     * in case none of the settings set in the services
     * exist, this procedure will pop an exception
     * and stop the program.
     */
    throw new Error(
      `[Config] 🔴 None of ${config} settings exist in this context`
    )
  },
}
