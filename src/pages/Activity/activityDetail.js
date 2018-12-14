import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtMessage, AtCard, AtNavBar, AtNoticebar} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../users/dashboard.scss'

export default class activityDetail extends Component {

  constructor() {
    super(...arguments);
    this.state = ({
      author: {},
      name: '',
      reward: [],
      description: '',
      p_number: 0
    })
  }

  componentDidMount() {
    // 检查是否已经登录
    Taro.request({
      url: 'http://www.r-share.cn:8080/webao_war/account/list',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 401) {
        Taro.navigateTo({
          url: '/pages/users/login'
        })
      }
    });
    Taro.request({
      url: 'http://www.r-share.cn:8080/webao_war/activity?id=' + this.$router.params.id,
      method: "GET",
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          author: res.data[0].author,
          reward: res.data[0].reward,
          name: res.data[0].name,
          description: res.data[0].description,
          p_number: res.data[0].p_number
        })
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

  render() {
    return (
      <View>
        <AtNavBar
          title={this.state.name}
        />
        <AtNoticebar marquee icon='volume-plus'/>
        <View style='margin: 3vh 0;'>
          <AtCard title='本次活动的奖品' extra={'发起人:' + this.state.author.username}>
            {
              this.state.reward.map(item => {
                return <View>
                  <View className='at-article__p'>奖品名：{item.reward.name}</View>
                  <View className='at-article__p'>数量：{item.number}</View>
                </View>
              })
            }
          </AtCard>
        </View>
        <View className='at-article__h3'>
          抽奖详情：
        </View>
        <View className='at-article__p'>
          {this.state.description}
        </View>
        <View className='userInfo'>
          <AtButton size={"small"} type={"primary"}>
            参加抽奖
          </AtButton>
        </View>
        <View className='userInfo'>
          当前参与人数：{this.state.p_number}
        </View>
        <AtMessage/>
      </View>
    )
  }
}
