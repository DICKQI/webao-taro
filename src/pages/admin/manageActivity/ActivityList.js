import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtMessage, AtAvatar, AtGrid, AtCard, AtNavBar, AtNoticebar, AtFloatLayout} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class ActivityList extends Component {

  constructor() {
    super(...arguments);
    this.state = {

      activityList: [],
      activityDetail: '',
      activityId: '',
      activityName: '',
      p_number: '',
      reward: [],

      choose: false,
      lottery: false,

      result: []

    }
  }

  config = {
    navigationBarTitleText: '检索所有的抽奖活动'
  };

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

  openFloat(name, id) {

    this.setState({
      activityName: name,
      activityId: id,
      choose: true
    });

    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity?id=' + id,
      header: {
        'Cookie': save.MyLoginSessionID
      },
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          activityDetail: res.data[0].description,
          reward: res.data[0].reward,
          p_number: res.data[0].p_number,
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

  beginLuckDraw() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/luckdraw',
      method: "POST",
      header: {
        'Cookie': save.MyLoginSessionID,
        'content-type': 'application/json'
      },
      data: {
        activity_id: this.state.activityId
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          "message": '开奖成功',
          'type': 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/users/dashboard'
          })
        }, 1500)
      } else {
        Taro.aMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }

  deleteActivity(mid) {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity?id=' + mid,
      method: "DELETE",
      header: {
        'Cookie': save.MyLoginSessionID,
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '删除活动成功',
          'type': 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/users/dashboard'
          })
        }, 1500)
      }
    })
  }


  closeFloat() {
    this.setState({
      choose: false
    })
  }


  render() {
    return (
      <View>
        {
          this.state.activityList.map(item => {
            return <View style='margin: 3vh 0;'>
              <AtCard onClick={this.openFloat.bind(this, item.name, item.id)}
                      title={item.name + (item.lottery ? '(已开奖)' : '')}
                      extra={item.author.username}>
                抽奖详情：。。。。。。
              </AtCard>
            </View>
          })
        }
        <AtFloatLayout title={this.state.activityName} isOpened={this.state.choose}
                       onClose={this.closeFloat.bind(this)}>
          <AtCard title='本次活动的奖品们'>
            {
              this.state.reward.map(item => {
                return <View className='at-article__p'>
                  <View>奖品名：{item.reward.name}</View>
                  <View>数量：{item.number}</View>
                </View>
              })
            }
          </AtCard>
          <View className='at-article__h3'>抽奖详情</View>
          <View className='at-article__p'>{this.state.activityDetail}</View>
          {
            this.state.lottery ? <View className='userInfo'>
                抽奖结果
                {
                  this.state.result.map(item => {
                    return <View style='margin-top: 1vh 0;color:red;' className='at-article__h1'>
                      恭喜{item.account.username}获得{item.reward.name}
                    </View>
                  })
                }
              </View>
              : <View>
                <View className='userInfo' style='margin-top: 1vh'>
                  当前参与人数：{this.state.p_number}
                  <AtButton type={"primary"} size={"small"} onClick={this.beginLuckDraw.bind(this)}>开始抽奖</AtButton>
                </View>
              </View>
          }
          <View className='userInfo' style='margin-top: 1vh'>
            <AtButton type={"primary"} size={"small"}
                      onClick={this.deleteActivity.bind(this, this.state.activityId)}>删除该活动</AtButton>
          </View>
          <AtMessage/>
        </AtFloatLayout>
      </View>
    );
  }
}
