<template>
  <section>
    <section v-if="showLoading" class="pageLoading">加载中...</section>
    <section v-show="!showLoading">
      <h1>{{subject.title}}</h1>
      <section class="info">
        <div class="info-left">
          <p class="rating">
            <strong class="value">{{rating.value?'评分：'+rating.value:''}}</strong>
            <strong>{{rating.count?rating.count+'人评价':''}}</strong>
          </p>
          <p class="short-info">{{extra.short_info}}</p>
        </div>
        <div class="info-right">
          <img :src="subject.cover_img.url">
        </div>
      </section>
      <section>
        <h2>{{subject.title?subject.title+'的剧集简介':''}}</h2>
        <div class="desc line-h" v-html="desc"></div>
      </section>
      <section v-if="(celebrities2.length || celebrities1.name)">
        <h2>影人</h2>
        <ul class="credits">
          <li class="credits-item">
            <img :src="imgBaseUrl + celebrities1.cover_url">
            <p class="credits-name">{{celebrities1.name}}</p>
            <p class="p2">导演</p>
          </li>
          <li class="credits-item" v-for="item in celebrities2" :key="item.id">
            <img :src="imgBaseUrl + item.cover_url">
            <p class="credits-name">{{item.name}}</p>
            <p class="p2">演员</p>
          </li>
        </ul>
      </section>
      <section v-if="photos.length">
        <h2>{{subject.title}}的照片</h2>
        <div class="photos">
          <img :src="item" mode="center" v-for="(item, index) in photos" :key="index" @click="previewImg(index)">
        </div>
      </section>
      <section v-show="interests">
        <h2>{{subject.title}}的短评({{interestsTotal}})</h2>
        <ul class="interests">
          <li v-for="item in interests" :key="item.id">
            <div class="avatar">
              <img :src="item.user.avatar">
            </div>
            <div class="comment">
              <p class="line-h">{{item.comment}}</p>
              <div class="vote-rating">
                <strong class="vote">点赞 : {{item.vote_count}}</strong>
                <strong>评分 : {{ item.rating ? item.rating.value : '' }}</strong>
              </div>
            </div>
          </li>
          <li style="justify-content: center;">
            <button @click="moreInterests" class="more loading">{{moreText}}</button>
          </li>
        </ul>
      </section>
    </section>
  </section>
</template>

<script>
export default {
  data() {
    return {
      showLoading: true,
      id: '',
      subject: { cover_img: {} },
      extra: {},
      rating: {},
      celebrities1: {},
      celebrities2: [],
      interests: null,
      photos: [],
      interestsTotal: 0,
      desc: "",
      count: 20,
      start: 0,
      moreText: '更多评论',
      imgBaseUrl: 'https://images.weserv.nl/?url='
    }
  },
  mounted() {
    this.reset()
    let id = this.$route.params.id||'27001001'
    this.id = id
    this.getSubject()
    this.getPhotos()
  },
  methods: {
    reset() {
      this.showLoading = true
      this.subject = { cover_img: {} }
      this.extra = {}
      this.rating = {}
      this.celebrities1 = {}
      this.celebrities2 = []
      this.interests = null
      this.interestsTotal = 0
      this.photos = []
      this.desc = ""
      this.start = 0
    },
    //获取subject
    getSubject() {
      this.$http
        .get(`/rexxar/api/v2/elessar/subject/${this.id}`)
        .then(res => {
          this.showLoading = false
          this.subject = Object.freeze(res)
          this.extra = res.extra
          this.rating = this.extra.rating_group.rating || {}
          this.subtype = res.subtype
          let start = res.desc.indexOf('class="content">') + 16
          let end = res.desc.indexOf("</div>") - 16 - 5
          let desc = res.desc.substr(start, end)
          this.desc = desc
          this.getCredits()
          this.getInterests()
        })
    },
    //获取影人
    getCredits() {
      this.$http
        .get(`/rexxar/api/v2/${this.subtype}/${this.id}/credits`)
        .then(res => {
          let credits = res.credits || []
          this.celebrities1 = Object.freeze(((credits[0]||{}).celebrities || [])[0]||{})
          let celebrities2 = (credits[1]||{}).celebrities || []
          if(celebrities2.length) {
            celebrities2 = celebrities2.slice(0,4)
            this.celebrities2 = Object.freeze(celebrities2)
          }
        })
    },
    //获取剧照
    getPhotos() {
      let url = `/j/fetch_photo/?start=0&type=S&mid=${this.id}`
      this.$http
        .get(url)
        .then(res => {
          let photos = res.photos || []
          let photosUrls = []
          photos.every((element,index) => {
            photosUrls.push(this.imgBaseUrl + element.imgurl)
            if(index >= 4) {
              return false
            }
            return true
          })
          this.photos = Object.freeze(photosUrls)
        })
    },
    // 查看图片
    previewImg() {
      
    },
    //获取评论
    getInterests() {
      let url = `/rexxar/api/v2/${this.subtype}/${this.id}/interests?count=${this.count}&order_by=hot&start=${this.start}&ck=&for_mobile=1`
      this.moreText = '加载中...'
      this.$http
        .get(url)
        .then(res => {
          let interests = res.interests || []
          this.moreText = interests.length ? '更多评论': ''
          if(this.start === 0) {
            this.interestsTotal = res.total
            this.interests = Object.freeze(interests)
          } else {
            this.interests = [...this.interests, ...interests]
          }
        })
        .catch( () => {
          this.moreText = '网络错误'
        })
    },
    //获取更多评论
    moreInterests() {
      this.start += this.count + 5
      this.getInterests()
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: .48rem;
  margin: .2rem auto .3rem;
}

h2 {
  color: #aaa;
  font-size: .3rem;
  margin-top: .3rem;
  margin-bottom: .3rem;
}

.line-h {
  line-height: .44rem;
}

.info {
  display: flex;
}

.rating {
  display: flex;
  margin-bottom: .2rem;
  color: #aaa;
}
.info-left {
  flex: 1;
  padding-right: .3rem;
}
.info-right {
  width: 100px;
}

.info-right img {
  width: 2rem;
  height: 3rem;
}

.credits {
  min-height: 3.32rem;
  padding-bottom: .2rem;
  margin-bottom: .4rem;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll;
}

.credits-item {
  display: inline-block;
  width: 1.5rem;
  margin-right: .3rem;
  vertical-align: top;
  text-align: center;
}

.credits-item img {
  width: 1.5rem;
  height: 2.14rem;
}

.credits-name {
  white-space: normal;
}

.photos {
  min-height: 2.6rem;
  padding-bottom: .2rem;
  margin-bottom: .4rem;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  overflow-x: scroll;
}

.photos img {
  height: 2.4rem;
  margin-right: .06rem;
}

.p2 {
  margin-top: .1rem;
  color: #aaa;
}

.interests li {
  display: flex;
  margin-bottom: .6rem;
}

.avatar {
  width: .72rem;
  display: flex;
}

.avatar img {
  width: .72rem;
  height: .72rem;
  border-radius: 50%;
}

.comment {
  padding-left: .3rem;
}

.vote-rating {
  display: flex;
  margin-top: .1rem;
  color: #aaa;
}

.vote, .value {
  margin-right: .2rem;
}
.more {
  font-size: .28rem;
  color: #42bd56;
}
</style>
 