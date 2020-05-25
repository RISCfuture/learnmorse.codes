import { LocaleMessageObject } from 'vue-i18n'

const website: LocaleMessageObject = {
  getStarted: {
    line1: 'Are you ready to learn Morse code?',
    line2: 'Well too bad, because it’s happening, right now.',
    button: 'OK, I guess'
  },
  resume: {
    text: 'Ready to pick up where you left off?',
    button: 'Let’s do it'
  },
  footer: {
    text: 'This website was developed by {linkToMe}, and it is {linkToProject}. Copyright ©2020 Tim Morgan.',
    linkToMe: 'Tim Morgan',
    linkToProject: 'open-source'
  }
}
export default website
