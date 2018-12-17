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
      activityDetail:'',
      activityId: '',
      activityName: ''
    }
  }

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/list',
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
    });
  }
  getDetail(mid) {
    Taro.request({
      url:'https://www.r-share.cn/webao_war/activity?id=' + mid,
      header:{
        'Cookie': save.MyLoginSessionID
      },
    }).then(res=>{
      if (res.statusCode === 200) {
        this.setState({

        })
      } else {
        Taro.atMessage({
          'message':res.data[0].msg,
          'type':'error'
        })
      }
    })
  }

  render() {
    return (
      <View>
        {
          this.state.activityList.map(item=>{
            return <View className='userInfo'>
              
            </View>
          })
        }
      </View>
    );
  }

  

}
