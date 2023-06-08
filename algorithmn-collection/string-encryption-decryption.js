// 描述
// 对输入的字符串进行加解密，并输出。

// 加密方法为：
// 当内容是英文字母时则用该英文字母的后一个字母替换，同时字母变换大小写,如字母a时则替换为B；字母Z时则替换为a；
// 当内容是数字时则把该数字加1，如0替换1，1替换2，9替换0；
// 其他字符不做变化。
// 解密方法为加密的逆过程。
// 数据范围：输入的两个字符串长度满足 
// 1≤n≤1000  ，保证输入的字符串都是只由大小写字母或者数字组成

// 输入描述：
// 第一行输入一串要加密的密码
// 第二行输入一串加过密的密码

// 输出描述：
// 第一行输出加密后的字符
// 第二行输出解密后的字符

let str 
while (str = await readline()){
  let encryption = []
  let decryption = []
  let upCase = "ABCDEFGHIJKLMNOPQRSTUVWXYZA".split("")
  let lowerCase = "abcdefghijklmnopqrstuvwxyza".split("")

  // 加密
  str.split("").forEach((item, index) => {
    if (upCase.indexOf(item) !== -1 ){ // 大写
      if (item === "Z"){
        encryption.push("a")
      } else {
        encryption.push(lowerCase[upCase.indexOf(item)+1])
      } 
    } else if (lowerCase.indexOf(item) !== -1) { // 小写
      if ( item === "z"){
        encryption.push("A")
      } else {
        encryption.push(upCase[lowerCase.indexOf(item)+1])
      }
    } else if (/[0-9]/.test(item)){ // 数字
      if (item === '9'){
        encryption.push('0')
      } else {
        encryption.push(++item)
      }
    }
  })

  console.log(encryption.join(""))

  // 解密
  str = await readline()
  str.split("").forEach((item, index) => {
    if (upCase.indexOf(item) !== -1) {
      if (item === "A"){
        decryption.push("z")
      } else {
        decryption.push(lowerCase[upCase.indexOf(item)-1])
      }
    } else if (lowerCase.indexOf(item) !== -1){
      if (item === "a"){
        decryption.push("Z")
      } else {
        decryption.push(upCase[lowerCase.indexOf(item)-1])
      }
    } else if (/0-9/.test(item) !== -1){
      if (item === "0"){
        decryption.push("9")
      } else {
        decryption.push(--item)
      }
    }
  })
  console.log(decryption.join(""))
}
