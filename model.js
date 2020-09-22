var WIDTH,HEIGHT

var model

var video = document.querySelector('video')
const photo = document.querySelector('button')
const canvas = document.createElement('canvas')
const ss = document.getElementById('ss')

function imager()
{
    if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    {
        navigator.mediaDevices.getUserMedia({video:true}).then((stream)=>{
            video.srcObject = stream//window.URL.createObjectURL(stream)
            video.play()
        })
    }   
    
    photo.addEventListener('click',(event)=>{
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        WIDTH = video.width
        HEIGHT = video.height
        canvas.getContext('2d').drawImage(video,0,0)
        ss.src = canvas.toDataURL('image/png')

        console.log(ss)
        document.querySelector('button').innerHTML = '<h2>LOADING....</h2>'
        document.querySelector('#result').innerHTML = `<div class='loader'></div>`
        ss.style.border = ""
    })
}

async function loads()
{
    model = await tf.loadGraphModel('./tfjs_model/model.json')
    //model.summary()

    console.log(model)
    ss.addEventListener('load',predictor)
}


async function predictor()
{
    imager()

    var imgArray = await tf.browser.fromPixels(ss).reshape([-1,224,224,3])
    
    var newArray = await tf.div(imgArray,tf.tensor([255.0]))
    //console.log(newArray.dataSync())

    var face = await model.predict(newArray).dataSync()
    
    document.querySelector('button').innerHTML = '<h2>DONE</h2>'

    console.log(Array(face)[0])
    console.log(Math.max(Array(face)[0][0],Array(face)[0][1]))

    var output = 'null',maxx = null

    if(face[0]<face[1]) output = 'NO MASK',maxx=face[1]
    else output = 'MASK',maxx=face[0]

    document.querySelector('#result').innerHTML = `<h2>${output} ${100*maxx} %</h2>`

    ss.style.border = "5px solid blue"
    setTimeout(()=>{
        document.querySelector('button').innerHTML="CLICK !"
    },2000)
}


imager()
loads()