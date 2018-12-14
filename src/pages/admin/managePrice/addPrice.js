import Taro, {Component} from '@tarojs/taro'
import {View, Text} from '@tarojs/components'
import {AtForm, AtButton, AtInput, AtSwitch, AtRate} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'

export default class addPrice extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      name: '',
      stock: '',
      grade: 3,
      is_use: false,
      id: '',
    }
  }

  setName(e) {
    this.setState({
      name: e
    })
  }

  setStock(e) {
    this.setState({
      stock: e
    })
  }

  setGrade(e) {
    console.log(e);
    this.setState({
      grade: e
    })
  }

  setIs_use(e) {
    this.setState({
      is_use: e
    })
  }

  addPrice() {
    Taro.request({
      url: 'http://www.r-share.cn:8080/webao_war/prize',
      method: "POST",
      data: {
        name: this.state.name,
        stock: this.state.stock,
        grade: this.state.grade,
        is_use: this.state.is_use
      },
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          id: res.data[0].id,
        });
        Taro.reLaunch({
          url: '/pages/users/dashboard'
        }).then(
          Taro.atMessage({
            'message': '创建商品成功',
            'type': 'success'
          })
        )
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        });
      }
    })
  }

  render() {
    return (
      <View>

        <AtInput title='奖品名称' name='name' value={this.state.name} onChange={this.setName.bind(this)}
                 placeholder='请输入商品名称'/>
        <AtInput title='库存量' name='stock' value={this.state.stock} onChange={this.setStock.bind(this)}
                 placeholder='请输入库存量'/>
        <View style='text-align: center'>奖品等级
          <AtRate
            value={this.state.grade}
            onChange={this.setGrade.bind(this)}
            max={5}
            size={20}
          />
        </View>
        <AtSwitch title='启用' checked={false} border={false} onChange={this.setIs_use.bind(this)}/>
        <AtButton type={"secondary"} formType='submit' onClick={this.addPrice.bind(this)}>提交</AtButton>

      </View>
    );
  }
}


