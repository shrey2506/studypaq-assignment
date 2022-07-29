import React, { useEffect,useRef,useState } from 'react'
import axios from 'axios'
import styles from  '../../styles/ImageGallery.module.css'


const ImageGallery = () => {

    const [images,setImages]=useState([])
    const [limit,setLimit]=useState(30)
    const [loading,setLoading]=useState(true)
 

    const ref=useRef(null)
    const scrollToEnd=useRef(null)
   
    const CancelToken = axios.CancelToken;
    let cancel;
  
 
    const fetchData=async()=>{
        setImages([])
        await axios.get(`https://www.reddit.com/r/images/new.json?limit=${limit}`, {
            cancelToken: new CancelToken(function executor(c) {
              cancel = c;
            })
        }).then(res=>{
        const data=res.data.data.children
        data.map((d,i)=>{
            const Data={
                index: i,
                liked: false,
                postData : d.data
            }
            setImages(currentList=>[...currentList, Data ])
            setLoading(false)
        })

        })
        .catch(err=>{
          console.log(err)
        })      
        
    }

    const loadMore=()=>{
       setLoading(true)
       
        setTimeout(()=>{
            const data=axios.get(`https://www.reddit.com/r/images/new.json?limit=${limit+10}`).then(
                res=>{
                    let data=res.data.data.children
                    console.log(data)
                    let arr=[]
                    for(let i=limit;i<limit+10;i++){
                        const Data={
                            index: i,
                            liked: false,
                            postData : data[i].data
                        }

                        arr.push(Data)
                    }
                       
                       console.log(arr)

                       setTimeout(()=>{
                        setImages(currentList=>[...currentList,...arr])
                        setLimit(limit+10)
                        setLoading(false)
                       },1000)
                }
            )
    
        },1000)
    }

  

    if(!loading){
        console.log(images)
    }

    const likePost=(index)=>{
        setImages(
            images.map(item=>

                item.liked===false?
                item.index===index
                ?{...item,liked: true}
                : item
                

                :

                item.index===index
                ?{...item,liked: false}
                : item
            )
        )

        console.log(images)
    }

    const sharePost=(link)=>{
        const redditLink=`https:Reddit.com${link}`
        window.open(redditLink, "_blank");
    }

   

   

    useEffect(()=>{
       
        fetchData()
        return ()=>{
          cancel()
          
        }
    },[])

  return (
   
       
         <div >
            <div className={styles.img_grid}>
    
                {images && images.sort((a,b)=>a.index-b.index).map((d,i)=>{
                    if(d.postData.url.includes('.jpg')||d.postData.url.includes('.png')){
                        return(
                            <div className={styles.card} key={i}>
                                <img className={styles.img} src={d.postData.url}  alt={d.postData.url} />
                                <div className={styles.card_title}>{d.postData.title}</div>
                                <div className={styles.card_row}>
                                   <button style={d.liked? {background: 'blue',color: 'white'}: {}} ref={ref} onClick={()=>likePost(d.index)}>Like</button>
                                   <button onClick={()=>sharePost(d.postData.permalink)}>Share</button>
                                </div>
                            </div>
                        )
                    }
                })}
            </div> 
           
            {<div ref={scrollToEnd} ></div>}
            {loading && <div>Loading</div>}
            {!loading && <button className={styles.load_more} onClick={loadMore}>Load more</button>}
            
        </div> 
   
  )
}

export default ImageGallery