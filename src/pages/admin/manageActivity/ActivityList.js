import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtMessage, AtAvatar, AtGrid, AtCard, AtNavBar, AtNoticebar} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class ActivityList extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      activityList: [],
      activityId: '',
      activityName: ''
    }
  }

  componentDidMount() {
    Taro.request({
      url: 'http://www.r-share.cn:8080/webao_war/activity/list',
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          activityList: res.data
        });
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

}
