import React, { Component } from 'react'
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';


export class News extends Component {
  static defaultProps={
    country: 'in',
    pageSize:8,
    category: 'general',
    totalResults:0,
  }
  static propTypes={
    country: PropTypes.string,
    pageSize:PropTypes.number,
    category: PropTypes.string,
  }
    constructor(props){
        super(props);
        this.state={
            articles: [],
            loading: false,
            page:1,
            totalResults:0,
        }
    }
    async updateNews(){
      this.props.setProgress(10);
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading: true})
      this.props.setProgress(30);
      let data= await fetch(url);
      this.props.setProgress(50);
      let parsedData= await data.json();
      this.props.setProgress(70);
      this.setState({articles: parsedData.articles, totalResults:parsedData.totalResults, loading:false})

      console.log(parsedData)
      this.props.setProgress(100);
    }
    async componentDidMount(){
      this.updateNews();
    }
    handlenextclick=async ()=>{
      // if(this.state.page +1> Math.ceil(this.state.totalResults/this.props.pageSize)){
      //   console.log("not next")
      // }
      // else{
      // console.log("Next")
      // this.setState({loading: true});
      // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
      // let data= await fetch(url);
      // let parsedData= await data.json();
      // this.setState({loading: false});

      // console.log(parsedData)
      // this.setState(
      //   {page: this.state.page+1,
      //     articles: parsedData.articles
      //   })
      // }
      this.setState({
        page: this.state.page + 1
      })
      this.updateNews();
    }
    handleprevclick= async ()=>{
      // this.setState({loading: true});
      // let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page-1}&pageSize=${this.props.pageSize}`;
      // let data= await fetch(url);
      // let parsedData= await data.json();
      // this.setState({loading: false});

      // console.log(parsedData)
      // this.setState({
      //   page: this.state.page-1,
      //   articles:parsedData.articles
      // })
      this.setState({
        page: this.state.page - 1
      })
      this.updateNews();
    }
    fetchMoreData = async () => {
      
      const url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page+1}&pageSize=${this.props.pageSize}`;
      this.setState({page : this.state.page +1})
      this.setState({loading: true})
      let data= await fetch(url);
      let parsedData= await data.json();
      this.setState({articles: this.state.articles.concat(parsedData.articles), totalResults:parsedData.totalResults, loading:false})

      console.log(parsedData)
      
    };
  render() {
    return (<>        <h2 className='text-center' style={{margin: "35px 8px", marginTop:"90px"}}>NewsMonkey - Top {this.props.category} Headlines  </h2>
        {/* {this.state.loading && <Spinner />} */}
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length  !== this.state.totalResults}
          loader={<Spinner/>}
        >
        <div className="container">
          <div className="row">
            {this.state.articles.map((element)=>{
              return <div className="col md-4" key={element.url}>
                  <NewsItem  title={element.title?element.title.slice(0,45):""} description={element.description?element.description.slice(0,88):""} imageUrl={element.urlToImage} newsURL={element.url} author={!element.author?"unknown":element.author} date={element.publishedAt} source={element.source.name}/>
                  </div>
                  
            })}
          </div>
        </div>
        </InfiniteScroll>
        </>


    )
  }
}

export default News
