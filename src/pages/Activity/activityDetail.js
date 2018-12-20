import Taro, {Component} from '@tarojs/taro'
import {View, Image} from '@tarojs/components'
import {AtButton, AtMessage, AtCard, AtNavBar, AtNoticebar, AtCurtain} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../users/dashboard.scss'
import luck from '../../static/luck.png'

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
      result: [],
      myLuck: false,

      apid: '',
      joinUser: 'dk',
      openNotice: false
    })
  }

  componentWillMount() {
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
            });
            for (var i = 0; i < res.data.length; i++) {
              if (res.data[i].account.id === save.MyID) {
                console.log(0);
                var uid = res.data[i].account.id;
                Taro.request({
                  url: 'https://www.r-share.cn/webao_war/account/prizeRecord?prize_id=' + res.data[i].reward.id,
                  header: {
                    'Cookie': save.MyLoginSessionID
                  }
                }).then(result => {
                  setTimeout(() => {
                    for (var j = 0; j < result.data.length; j++) {
                      if (result.data[j].author === uid) {
                        if (result.data[j].exchange === false) {
                          var activity = result.data[j].activity;
                          var cid = parseInt(this.$router.params.id);
                          if (activity === cid) {
                          console.log(3);
                            this.setState({
                              myLuck: true,
                              apid: result.data[j].id
                            });
                            return
                          }
                        }
                      }
                    }
                  }, 1200);
                })
              }
            }
          } else {
            Taro.atMessage({
              'message': res.data[0].msg,
              'type': 'error'
            })
          }
        })
      } else {
        this.setState({
          openNotice: true
        });
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/activity/account?id=' + this.$router.params.id,
          header: {
            'Cookie': save.MyLoginSessionID
          }
        }).then(res=>{
          if (res.statusCode === 200) {
            this.setState({
              openNotice: true,
            });
            setInterval(()=>{
              var index = Math.floor(Math.random() * (res.data[0].data.length - 1 + 1));
              this.setState({
                joinUser: res.data[0].data[index]
              })
            }, 6000)
          }
        })
      }
    })
  }

  luckDraw() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/luckdraw?id=' + this.state.apid,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          myLuck: false
        });
        Taro.atMessage({
          'message': '兑奖成功!!!!',
          'type': 'success'
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
        this.setState({
          p_number: this.state.p_number + 1
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
        <AtCurtain onClose={this.luckDraw.bind(this)} isOpened={this.state.myLuck}>
          <Image mode={"widthFix"} src={luck}/>
        </AtCurtain>
        {
          this.state.openNotice ?
           <AtNoticebar icon='volume-plus' marquee>欢迎{this.state.joinUser}参加抽奖</AtNoticebar> : ''
        }
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
