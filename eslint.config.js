const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

const legacyConfig = {
    ignorePatterns: ["node_modules/*", "dist/*", "build/*"],
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended"
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 12,
        sourceType: "module"
    },
    plugins: ["react", "@typescript-eslint", "import"],
    rules: {
        "@typescript-eslint/no-explicit-any": "error",
        "react/react-in-jsx-scope": "off",
        "react/require-default-props": "off",
        "no-spaced-func": "off",
        "max-len": ["error", { code: 180 }],
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: true
            }
        ],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "double"],
        semi: ["error", "always"],
        "no-undef": "off"
    },
    overrides: [
        {
            files: ["*.js"],
            rules: {
                "@typescript-eslint/no-var-requires": "off"
            }
        },
        {
            files: ["eslint.config.js", "jest-setup.js"],
            rules: {
                "@typescript-eslint/no-require-imports": "off",
                "react/prop-types": "off",
                "import/no-extraneous-dependencies": "off"
            }
        }
    ],
    settings: {
        react: {
            createClass: "createReactClass",
            pragma: "React",
            fragment: "Fragment",
            version: "detect",
            flowVersion: "0.53"
        }
    }
};

module.exports = compat.config(legacyConfig);