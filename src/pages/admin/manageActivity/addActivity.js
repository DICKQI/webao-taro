import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtInput, AtTextarea, AtMessage} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class addActivity extends Component {

  constructor() {
    super(...arguments);
    this.state = ({
      name: '',
      description: '',
    })
  }

  componentDidMount() {
    // 获取可用奖品列表
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize/list',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      this.setState({
        priceList: res.data
      })
    })
  }

  setName(e) {
    this.setState({
      name: e
    })
  }

  setDescription(e) {
    this.setState({
      description: e.target.value
    })
  }

  addActivity() {
    if (this.state.description === '' || this.state.name === '') {
      Taro.atMessage({
        'message': '描述和标题都不能为空噢',
        'type': 'warning'
      });
      return
    }
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity',
      method: "POST",
      data: {
        name: this.state.name,
        description: this.state.description
      },
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.redirectTo({
          url: '/pages/admin/manageActivity/addReward?id=' + res.data[0].id
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
      <View style='margin-top: 25%'>
        <View className='userInfo'>
          <AtInput title='活动名' name='name' onChange={this.setName.bind(this)}
                   placeholder='请输入抽奖活动名'/>
        </View>
        <View style='margin: 10px'>
          <AtTextarea value={this.state.description} onChange={this.setDescription.bind(this)}
                      maxlength='200' placeholder='请输入抽奖描述'/>
        </View>
        <View style='margin-left:10px;margin-right: 10px'>
          <AtButton type={"primary"} onClick={this.addActivity.bind(this)}>
            创建
          </AtButton>
        </View>
        <AtMessage/>
      </View>
    )
  }
}
