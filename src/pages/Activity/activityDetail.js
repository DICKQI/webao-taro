import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtMessage, AtCard, AtNavBar, AtNoticebar} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../users/dashboard.scss'

export default class activityDetail extends Component {


  config = {
    navigationBarTitleText: this.state.name
  };

  constructor() {
    super(...arguments);
    this.state = ({
      author: {},
      name: '',
      reward: [],
      description: '',
      p_number: 0,
      id: '',
      lottery: false,
      result: []
    })
  }

  componentDidMount() {
    // 检查是否已经登录
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/list',
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

    // 获取活动详情
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity?id=' + this.$router.params.id,
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
          p_number: res.data[0].p_number,
          id: res.data[0].id,
          lottery: res.data[0].lottery
        })
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
      if (res.data[0].lottery === true) {
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/luckdraw/record?id=' + res.data[0].id,
          header: {
            'Cookie': save.MyLoginSessionID
          }
        }).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              result: res.data
            })
          } else {
            Taro.atMessage({
              'message': res.data[0].msg,
              'type': 'error'
            })
          }
        })
      }
    })
  }

  joinInActivity(mid) {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/join?id=' + mid,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '祝好运呢！！！',
          'type': 'success'
        });

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
        {
          this.state.lottery ? <View className='userInfo'>
              抽奖结果
              {
                this.state.result.map(item => {
                  return <View style='margin-top: 2vh 0;color:red;' className='at-article__h1'>
                    恭喜{item.account.username}获得{item.reward.name}
                  </View>
                })
              }
            </View> :
            <View
              style='margin-top:10vh;' className='userInfo'>
              <AtButton type={"primary"} onClick={this.joinInActivity.bind(this, this.state.id)}>
                参加抽奖
              </AtButton>
              <View style='margin-top:1vh'>
                当前参与人数：{this.state.p_number}
              </View>
            </View>
        }
        <AtMessage/>
      </View>
    )
  }
}
