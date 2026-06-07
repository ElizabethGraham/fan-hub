import { defineConfig, globalIgnores } from 'eslint/config';
import expo from 'eslint-config-expo/flat.js';
import prettier from 'eslint-config-prettier';

const eslintConfig = defineConfig([
  ...expo,
  globalIgnores([
    'node_modules/',
    '.expo/',
    'dist/',
    'android/',
    'ios/',
  ]),
  {
    rules: {
      // react-hooks/refs flags every useRef(new Animated.Value()).current,
      // which is the standard React Native Animated pattern. Safe to disable.
      'react-hooks/refs': 'off',

      // Keep exhaustive-deps as a warning so we notice but don't block CI.
      'react-hooks/exhaustive-deps': 'warn',

      // setLoading/setError at the top of a data-fetching effect is universal
      // in React Native. The rule is too strict for this pattern.
      'react-hooks/set-state-in-effect': 'off',

      // Date.now() inside a useEffect is fine — effects are not render fns.
      'react-hooks/purity': 'off',
    },
  },
  prettier, // Must be the last element
]);

export default eslintConfig;
