/** @type {import('@astrojs/starlight/expressive-code').StarlightExpressiveCodeOptions} */

import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'

export default {
    plugins: [pluginLineNumbers()],
}
