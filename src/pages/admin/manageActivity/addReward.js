import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtInput, AtTextarea, AtMessage, AtInputNumber, AtCard, AtFloatLayout} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class addReward extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      price: [],
      reward: [],
      rewardName: [],
      choose: false,
      id: '',
      number: '',
      available: ''
    };
  }

  componentWillMount() {
    // 获取奖品列表
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize/list',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      this.setState({
        price: res.data
      })
    });
  }

  setReward() {
    this.state.rewardName.push(this.state.name + ":" + this.state.number);
    this.state.reward.push({
      id: this.state.id,
      number: this.state.number
    });
    this.setState({
      rewardName: this.state.rewardName,
      reward: this.state.reward,
      choose: false
    });
    console.log(this.state.reward)
  }

  setNumber(e) {
    this.setState({
      number: e
    })
  }

  openFloat(id, name, available) {
    console.log(id, name, available);
    this.setState({
      id: id,
      name: name,
      available: available,
      choose: true
    })
  }


  addReward() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/manage',
      method: "POST",
      data: {
        acid: this.$router.params.id,
        data: this.state.reward
      },
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '添加成功',
          'type': 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/index/index'
          })
        }, 1500)
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
        <AtTextarea count={false} value={this.state.rewardName} disabled={true}/>
        {
          this.state.price.map(item => {
            return <View onClick={this.openFloat.bind(this, item.id, item.name, item.available)}>
              奖品名：{item.name} 可用数量：{item.available}
            </View>
          })
        }
        <AtFloatLayout title='请选择数量' isOpened={this.state.choose}>
          <AtInputNumber type={"number"} max={this.state.available} min={1} step={1} value={this.state.number}
                         onChange={this.setNumber.bind(this)}/>
          <AtButton onClick={this.setReward.bind(this)}>确认</AtButton>
        </AtFloatLayout>
        <View className='userInfo'>
          <AtButton type={"primary"} size={"small"} onClick={this.addReward.bind(this)}>确认添加</AtButton>
        </View>
        <AtMessage/>
      </View>
    );
  }

}
