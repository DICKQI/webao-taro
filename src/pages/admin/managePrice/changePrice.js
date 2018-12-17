import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtButton, AtMessage, AtRate, AtInput, AtForm, AtSwitch} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../index/index.scss'

export default class changePrice extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      grade: '',
      name: '',
      available: '',
      stock: '',
      is_use: false,
      id: this.$router.params.id
    }
  }

  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize',
      data: {
        id: this.state.id
      },
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          grade: res.data[0].grade,
          name: res.data[0].name,
          available: res.data[0].available,
          stock: res.data[0].stock,
          is_use: res.data[0].is_use,
        });
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'success'
        })
      }
    })
  }

  changeName(e) {
    this.setState({
      name: e
    })
  }

  changeGrade(e) {
    this.setState({
      grade: e
    })
  }

  changeStock(e) {
    this.setState({
      stock: e
    })
  }

  changeAvailable(e) {
    this.setState({
      available: e
    })
  }

  changeUse(e) {
    this.setState({
      is_use: e
    })
  }

  changePrice() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize',
      method: "PUT",
      data: {
        name: this.state.name,
        stock: this.state.stock,
        grade: this.state.grade,
        is_use: this.state.is_use,
        availble: this.state.available,
        id: this.state.id
      },
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.atMessage({
          'message': '修改成功',
          'type': 'success'
        });
        setTimeout(() => {
          Taro.reLaunch({
            url: '/pages/users/dashboard'
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

        <AtInput title='奖品名称' name='name' onChange={this.changeName.bind(this)} value={this.state.name}/>
        <AtInput title='库存量' name='stock' onChange={this.changeStock.bind(this)} value={this.state.stock}/>
        <AtInput title='可用量' name='available' onChange={this.changeAvailable.bind(this)}
                 value={this.state.available}/>
        <View className='toCenter'>
          <Text>奖品等级</Text>
          <AtRate
            value={this.state.grade}
            onChange={this.changeGrade.bind(this)}
            max={5}
          />
        </View>
        <AtSwitch title='是否启用奖品' checked={this.state.is_use} border={false} onChange={this.changeUse.bind(this)}/>
        <AtButton type='primary' formType='submit' onClick={this.changePrice.bind(this)}>提交</AtButton>

        <AtMessage/>
      </View>
    );
  }

}
