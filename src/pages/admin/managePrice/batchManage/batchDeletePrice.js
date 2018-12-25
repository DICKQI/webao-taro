import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtMessage, AtCheckbox} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../../config/loginSave'
import '../../../users/dashboard.scss'

export default class batchDeletePrice extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      priceList: [],
      chooseList: []
    }
  }

  config = {
    navigationBarTitleText: '批量删除奖品'
  };

  addToList(e) {
    this.setState({
      chooseList: e
    })
  }

  batchDeletePrice() {
    for (var i = 0; i < this.state.chooseList.length; i++) {
      Taro.request({
        url: 'https://www.r-share.cn/webao_war/prize?id=' + this.state.chooseList[i],
        method: "DELETE",
        header: {
          'Cookie': save.MyLoginSessionID
        }
      })
    }
    Taro.atMessage({
      'message': '删除成功',
      'type': 'success'
    });
    setTimeout(() => {
      Taro.reLaunch({
        url: '/pages/users/dashboard'
      })
    }, 1500)
  }

  componentWillMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize/list?all=1',
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        for (var i = 0; i < res.data.length; i++) {
          this.state.priceList.push({
            value: res.data[i].id,
            label: res.data[i].name
          });
          this.setState({
            priceList: this.state.priceList
          })
        }
      }
    })
  }

  render() {
    return (
      <View>
        <AtCheckbox options={this.state.priceList} selectedList={this.state.chooseList}
                    onChange={this.addToList.bind(this)}/>
        <View style='margin-left: 2vh;margin-right: 2vh;margin-top:2vh'><AtButton
          onClick={this.batchDeletePrice.bind(this)} type={"primary"}>删除</AtButton></View>
        <AtMessage/>
      </View>
    );
  }


}
