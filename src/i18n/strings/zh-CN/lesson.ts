import type { LocaleMessage } from '@intlify/core-base'

const lesson: LocaleMessage = {
  copy: {
    getReady: '准备好……',
    getReadyButton: '出题吧！',
    startTyping: '开始打字！',
    grading: '停笔！',
    extraCredit: '……还有打出那个空格的额外加分！ | ……还有打出那些空格的额外 {points} 分！',
    abandoned: {
      header: '是不是有点跟不上了？',
      body: '看起来刚才有点乱套了。深呼吸一下，需要的话回头看看上面的字符，准备好之后，点下面那个灰色大按钮就行。',
      retryButton: '好，再来一次。',
    },
    fieldLabel: '在这里输入',
    navigation: {
      label: '课程导航',
      instructions: '用左右方向键在课程之间切换，手机上则可以左右滑动。',
    },
  },
  platitudes: {
    encouragement: [
      '别现在放弃！',
      '就快成功啦！',
      '你一定能学会！',
      '继续加油！',
      '我相信你！',
      '熟能生巧！',
      '你做得到！',
      '这点小事难不倒你！',
      '永不放弃，绝不投降！',
      '再接再厉！',
      '再试一次！',
      '你绝对没问题！',
    ],
    congratulations: [
      '干得漂亮！',
      '太厉害了！',
      '出色！',
      '太牛了！',
      '你真棒！',
      '为你骄傲！',
      '谁这么强？就是你这么强！',
      '给自己点个赞！',
      '这是你应得的！',
      '努力没白费！',
      '稳得很！',
      '💯💯💯',
      '✨✨✨',
    ],
  },
  tips: [
    '听到较长的停顿时按空格键，因为那代表一个新单词的开始。',
    '别去想点和划，试着记住每个字符“听起来”是什么样的。',
    '研究每个字符的声音时，把眼睛闭上。',
    '用左右方向键在课程之间切换。',
  ],
  practice: {
    elide: '省略',
    insert: '插入',
  },
}
export default lesson
