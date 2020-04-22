module.exports = {
  printWidth: 100,
  semi: true, // 在每个语句的末尾添加分号
  singleQuote: true, // 使用单引号而不是双引号
  trailingComma: "none", // 多行时尽可能打印尾随逗号<none|es5|all>
  bracketSpacing: true, // 对象文字中打印括号之间的空格
  jsxBracketSameLine: true, // 将>多行JSX元素放在最后一行的末尾，而不是单独放在下一行
  arrowParens: "avoid", // 在单个箭头函数参数周围加上括号<avoid|always>
  requirePragma: false,
  proseWrap: "preserve",
  endOfLine: "auto", // 处理windows上面出现的 Delete `␍`eslint(prettier/prettier) 的错误
};