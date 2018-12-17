import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtMessage, AtCard, AtNavBar} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import './dashboard.scss'
import './users.scss'

export default class myActivity extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      activity: []
    }
  }

  config = {
    navigationBarTitleText: '我参加的活动'
  };

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/activity?id=' + save.MyID,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          activity: res.data
        })
      }
    })
  }

  toDetail(mid) {
    Taro.navigateTo({
      url: '/pages/Activity/activityDetail?id=' + mid
    })
  }

  render() {
    return (
      <View>
        <AtNavBar>我参加的活动</AtNavBar>
        {
          this.state.activity.map(item => {
            return <View>
              <AtCard onClick={this.toDetail.bind(this, item.id)} title={item.name}>
                {item.description}
              </AtCard>
            </View>
          })
        }
        <AtMessage/>
      </View>
    );
  }

}
