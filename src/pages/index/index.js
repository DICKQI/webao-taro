import Taro, {Component} from '@tarojs/taro'
import {View, Image, Swiper, SwiperItem} from '@tarojs/components'
import {AtCurtain, AtGrid, AtSearchBar, AtDivider, AtCard} from 'taro-ui'
import './index.scss'
import img1 from '../../static/1.png'
import img2 from '../../static/2.png'
import img3 from '../../static/3.png'
import curtainImg from '../../static/curtain.png'


export default class Index extends Component {

  constructor() {
    super(...arguments);
    this.state = {
      isOpened: false,
      activity: [],
      searchContent: ''
    }
  }

  setSearchContent(e) {
    this.setState({
      searchContent: e
    })
  }

  componentDidMount() {
    Taro.request({
      url: 'http://www.r-share.cn:8080/webao_war/activity/list'
    }).then(res => {
      if (res.statusCode === 200) {
        this.setState({
          activity: res.data
        });
      }
    });
    setTimeout(() => {
      this.openCurtain()
    }, 3000)
  }

  openCurtain() {
    this.setState({
      isOpened: true
    })
  }

  closeCurtain() {
    this.setState({
      isOpened: false
    })
  }

  toAcDetail(mid) {
    Taro.navigateTo({
      url:'/pages/manageActivity/activityDetail?id=' + mid
    })
  }

  config = {
    navigationBarTitleText: '首页'
  };

  render() {
    return (
      <View>
        <AtSearchBar value={this.state.serarchContent} onChange={this.setSearchContent.bind(this)}/>
        <AtCurtain isOpened={this.state.isOpened} onClose={this.closeCurtain.bind(this)} closeBtnPosition={'top'}>
          <Image style='width:100%;height:250px' src={curtainImg}/>
        </AtCurtain>
        <View className='toCenter'>
          <Swiper
            indicatorColor='#999'
            indicatorActiveColor='#333'
            vertical={false}
            circular={true}
            indicatorDots
            autoplay>
            <SwiperItem>
              <View><Image src={img1}/></View>
            </SwiperItem>
            <SwiperItem>
              <View><Image src={img2}/></View>
            </SwiperItem>
            <SwiperItem>
              <View><Image src={img3}/></View>
            </SwiperItem>
          </Swiper>
        </View>
        <AtGrid mode='rect' data={
          [
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t6160/14/2008729947/2754/7d512a86/595c3aeeNa89ddf71.png',
              value: '抽奖中心'
            },
            {
              image: 'https://img20.360buyimg.com/jdphoto/s72x72_jfs/t15151/308/1012305375/2300/536ee6ef/5a411466N040a074b.png',
              value: '折扣中心'
            },
            {
              image: 'https://img10.360buyimg.com/jdphoto/s72x72_jfs/t5872/209/5240187906/2872/8fa98cd/595c3b2aN4155b931.png',
              value: '领会员'
            },
            {
              image: 'https://img12.360buyimg.com/jdphoto/s72x72_jfs/t10660/330/203667368/1672/801735d7/59c85643N31e68303.png',
              value: '新品首发'
            },
            {
              image: 'https://img14.360buyimg.com/jdphoto/s72x72_jfs/t17251/336/1311038817/3177/72595a07/5ac44618Na1db7b09.png',
              value: '领积分'
            },
            {
              image: 'https://img30.360buyimg.com/jdphoto/s72x72_jfs/t5770/97/5184449507/2423/294d5f95/595c3b4dNbc6bc95d.png',
              value: '积分商城'
            }
          ]
        }
                hasBorder={true}
        />
        <View className='more'>更多活动</View>
        {
          this.state.activity.map(item=>{
            return <View className='margin'>
              <AtCard onClick={this.toAcDetail.bind(this, item.id)} title={item.name} extra={'发起人：' + item.author.username}>
                抽奖详情：。。。。。。
              </AtCard>
            </View>
          })
        }
        <AtDivider content='没有更多了'/>
      </View>
    )
  }
}


