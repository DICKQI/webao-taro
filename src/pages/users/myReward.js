import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtMessage, AtButton, AtModal, AtList, AtListItem} from 'taro-ui'
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

  config = {
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

  checkReward(lid, exchange) {
    if (exchange === true) {
      return
    }
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
            this.state.userReward.map((item, index) => {
              return <View key={index} onClick={this.checkReward.bind(this, item.id, item.exchange)}>
                <AtListItem thumb='https://webao-oss.oss-cn-shenzhen.aliyuncs.com/icon/rewardIcon.png'
                            title={item.reward.name} extraText={item.exchange ? '已兑奖' : '点击兑奖~'}/>
              </View>
            })
        }
        <AtMessage/>
      </View>
    );
  }

}
