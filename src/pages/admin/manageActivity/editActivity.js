import Taro, {Component} from '@tarojs/taro'
import {View} from '@tarojs/components'
import {AtButton, AtInput, AtTextarea, AtMessage, AtFloatLayout, AtInputNumber} from 'taro-ui'
import 'taro-ui/dist/weapp/css/index.css'
import save from '../../../config/loginSave'
import '../../users/dashboard.scss'

export default class editActivity extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      // 活动基本信息
      id: this.$router.params.id,
      reward: [],
      author: '',
      name: '',
      description: '',

      float: false,

      // 被选中的奖品的基本信息
      priceId: '',
      rewardId: '',
      rewardNumber: 0,
      rewardName: '',
      maxNumber: 0
    }
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

  editAct() {
    if (this.state.name === '' || this.state.description === '') {
      Taro.atMessage({
        'message': '活动名或者活动详情不能为0',
        'type': 'warning'
      })
    }
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity',
      method: "PUT",
      data: {
        id: this.state.id,
        name: this.state.name,
        description: this.state.description
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
      }
    })
  }

  setRewardNumber(e) {
    this.setState({
      rewardNumber: e
    })
  }

  setRewardInfo(mid, rid, number, name) {
    this.setState({
      priceId: mid,
      rewardId: rid,
      rewardNumber: number,
      rewardName: name
    });
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/prize?id=' + mid,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      this.setState({
        maxNumber: res.data[0].available,
        float: true
      })
    })
  }


  setReward() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/manage',
      method: "PUT",
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      },
      data: {
        data: [
          {
            id: this.state.rewardId,
            number: parseInt(this.state.rewardNumber)
          }
        ]
      }
    }).then(res => {
      // 刷新活动
      if (res.statusCode === 200) {
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/activity?id=' + this.state.id,
          header: {
            'Cookie': save.MyLoginSessionID
          }
        }).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              reward: res.data[0].reward,
              author: res.data[0].author.username,
              description: res.data[0].description,
              name: res.data[0].name,
              float: false
            })
          }
        });
        Taro.atMessage({
          'message': '修改奖品成功',
          'type': 'success',
          'duration': 1000
        })
      } else {
        Taro.atMessage({
          'message': '修改失败',
          'type': 'error'
        })
      }
    })
  }

  closeFloat() {
    this.setState({
      float: false
    })
  }

  toAddReward() {
    Taro.navigateTo({
      url: '/pages/admin/manageActivity/addReward?id=' + this.state.id
    })
  }

  deleteReward() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity/manage',
      method: "DELETE",
      header: {
        'content-type': 'application/json',
        'Cookie': save.MyLoginSessionID
      },
      data: {
        ids: [
          this.state.rewardId
        ]
      }
    }).then(res => {
      if (res.statusCode === 200) {
        Taro.request({
          url: 'https://www.r-share.cn/webao_war/activity?id=' + this.state.id,
          header: {
            'Cookie': save.MyLoginSessionID
          }
        }).then(res => {
          if (res.statusCode === 200) {
            this.setState({
              reward: res.data[0].reward,
              author: res.data[0].author.username,
              description: res.data[0].description,
              name: res.data[0].name,
              float: false
            })
          }
        });
        Taro.atMessage({
          'message': '删除成功',
          'type': 'success',
          'duration': 1000
        })
      } else {
        Taro.atMessage({
          'message': res.data[0].msg,
          'type': 'error'
        })
      }
    })
  }


  componentDidMount() {
    Taro.request({
      url: 'https://www.r-share.cn/webao_war/activity?id=' + this.state.id,
      header: {
        'Cookie': save.MyLoginSessionID
      }
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          reward: res.data[0].reward,
          author: res.data[0].author.username,
          description: res.data[0].description,
          name: res.data[0].name
        })
      }
    })
  }

  render() {
    return (
      <View>
        <View className='userInfo'>
          <AtInput title='活动名' name='name' onChange={this.setName.bind(this)} value={this.state.name}
                   placeholder='请输入活动名'/>
        </View>
        <View style='margin-left: 3vh;margin-right: 3vh;margin-top:3vh;margin-bottom:3vh'>
          <AtTextarea onChange={this.setDescription.bind(this)} value={this.state.description}
                      maxlength={200} placeholder='请输入商品描述'/>
          <View style='text-align: center;margin-top:2vh;'>当前活动的奖品,点击奖品可以更改数量</View>
          {
            this.state.reward.map((item, index) => {
              return <View key={index}>
                <View onClick={this.setRewardInfo.bind(this, item.reward.id, item.id, item.number, item.reward.name)}
                      className='at-article__p'>奖品名：{item.reward.name} 数量：{item.number}</View>
              </View>
            })
          }
          <View style='margin-top: 1vh' className='at-row'>
            <View className='at-col' style='margin-right: 2vh'>
              <AtButton onClick={this.editAct.bind(this)} type={"primary"}>提交</AtButton>
            </View>
            <View className='at-col'>
              <AtButton onClick={this.toAddReward.bind(this)} type={"primary"}>新增奖品</AtButton>
            </View>
          </View>
        </View>
        <View>
          <AtFloatLayout isOpened={this.state.float} title={'修改奖品:' + this.state.rewardName}
                         onClose={this.closeFloat.bind(this)}>
            <View className='userInfo'>
              <AtInputNumber type={"number"} value={this.state.rewardNumber} max={this.state.maxNumber} step={1} min={1}
                             onChange={this.setRewardNumber.bind(this)}/>
              <View style='text-align:center;margin-top: 1vh'>可用最多数量:{this.state.maxNumber}</View>
              <View style='margin-top: 2vh;'>
                <AtButton onClick={this.setReward.bind(this)} type={"primary"} size={"small"}>确认</AtButton>
              </View>
              <View style='margin-top: 2vh;'>
                <AtButton onClick={this.deleteReward.bind(this)} type={"primary"} size={"small"}>删除</AtButton>
              </View>
            </View>
          </AtFloatLayout>
        </View>
        <AtMessage/>

      </View>
    );
  }

}
