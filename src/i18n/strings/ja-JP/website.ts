import type { LocaleMessage } from '@intlify/core-base'

const website: LocaleMessage = {
  meta: {
    title: 'モールス信号を学ぼう',
    description: '楽しく、すばやくモールス信号をマスターしよう',
  },
  skipLink: 'メインコンテンツへスキップ',
  localeSwitcher: {
    label: '言語を変更',
  },
  getStarted: {
    line1: 'モールス信号を学ぶ準備はいい？',
    line2: 'まだ？　残念、もう始まってるよ。今すぐにね。',
    button: 'まあ、いいか',
  },
  resume: {
    text: '続きから再開する？',
    button: 'やろう',
  },
  footer: {
    text: 'このサイトは{linkToMe}が制作しました。{linkToProject}です。Copyright ©2020 Tim Morgan.',
    linkToMe: 'Tim Morgan',
    linkToProject: 'オープンソース',
  },
}
export default website
