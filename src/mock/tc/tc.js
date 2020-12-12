export function payer () {
  const arr = ['陈佳佳', '蘑菇吉他', '李炜量']
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
