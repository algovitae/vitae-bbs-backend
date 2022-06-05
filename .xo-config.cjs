module.exports = {
    space: 2,
    envs: ['es2021', 'node'],
    extends: [
      'xo',
      'xo-typescript',
    ],
    rules: {
      "@typescript-eslint/no-implicit-any-catch": "off",
      "@typescript-eslint/naming-convention": "off", // FIXME
      "import/extensions": "off",
      "new-cap": "off",
      "unicorn/no-array-for-each": "off",
      "unicorn/no-await-expression-member": "off",
    },
    ignores: [
      'nexus-typegen.ts'
    ]
  }