import configs from 'rete-cli/configs/eslint.mjs';
import tseslint from 'typescript-eslint'

export default tseslint.config(
  ...configs,
)
