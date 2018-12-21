import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtMessage, AtButton, AtModal} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../config/loginSave'
import '../index/index.scss'
import '../users/dashboard.scss'

export default class myReward extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      userReward: [],
      luckId: '',
      openModal: false,
      empty: false
    }
  }

  config =  {
    navigationBarTitleText: '我的中奖'
  };

  closeModal() {
    this.setState({
      openModal: false
    })
  }

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/account/prizeRecord?account_id=' + save.MyID,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        if (JSON.stringify(res.data) === '[]') {
          this.setState({
            empty: true
          });
          return
        }
        this.setState({
          userReward: res.data
        });
      }
    })
  }

  checkReward(lid) {
    this.setState({
      luckId: lid,
      openModal: true
    })
  }

  luckDraw() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/luckdraw?id=' + this.state.luckId,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          openModal: false
        });
        Taro.atMessage({
          'message': '兑奖成功，恭喜你！！',
          'type': 'success'
        });
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/account/prizeRecord?account_id=' + save.MyID,
          header: {
            'Cookie': save.MyLoginSessionID
          }
        }).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              userReward: res.data
            })
          }
        })
      } else {
        this.setState({
          openModal: false
        });
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
        <AtModal content='确定要兑奖吗？' isOpened={this.state.openModal} onConfirm={this.luckDraw.bind(this)} confirmText='确定'
                 cancelText='取消' onCancel={this.closeModal.bind(this)} onClose={this.closeModal.bind(this)}/>
        {
          this.state.empty ? <View style='text-align: center;color: gray;font-size: 16px;margin-top: 70%'>
              ~~你还没有任何的中奖奖品呢，快去参加活动吧~~
            </View> :
            this.state.userReward.map(item => {
              return <View style='margin-top: 3vh;color:red;text-align:center'>
                {item.reward.name}
                {
                  item.exchange ? '~已兑奖~' : <View style='margin-top:1vh'><AtButton type={"primary"} size={"small"}
                                                                                   onClick={this.checkReward.bind(this, item.id)}>兑奖</AtButton></View>
                }
              </View>
            })
        }
        <AtMessage/>
      </View>
    );
  }

}
