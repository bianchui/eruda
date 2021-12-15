import highlight from './highlight'
import beautify from 'js-beautify'
import { Object_assign } from '../jslib'

export default function(util) {
  Object_assign(util, {
    highlight,
    beautify
  })
}
