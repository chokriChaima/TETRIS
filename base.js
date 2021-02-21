document.addEventListener('DOMContentLoaded', () => {
  const space = document.querySelector('.space')
  let squares = Array.from(document.querySelectorAll('.space div'))
  const disScore = document.querySelector('#score')
  const disLevel = document.querySelector('#Level')
  const disLines = document.querySelector('#Lines')
  const startButton = document.querySelector('#startButton')
  const pauseButton = document.querySelector('#pauseButton')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  let Level = 0
  let lines = 0
  const speed = 1000
  const colors = [
    'darkviolet',
    'darkred',
    'green',
    'darkblue'
  ]

  
  const LT = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2]
  ]


  const TT = [
    [1,width,width+1,width+2],
    [1,width+1,width+2,width*2+1],
    [width,width+1,width+2,width*2+1],
    [1,width,width+1,width*2+1]
  ]

  const OT = [
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1],
    [0,1,width,width+1]
  ]

  const IT = [
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3],
    [1,width+1,width*2+1,width*3+1],
    [width,width+1,width+2,width+3]
  ]

  const Tetro = [LT, TT, OT, IT]

  let currentPosition = 4
  let currentRotation = 0

  console.log(Tetro[0][0])

  let random = Math.floor(Math.random()*Tetro.length)
  let current = Tetro[random][currentRotation]

  
  function draw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.add('aTetro')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  
  function undraw() {
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('aTetro')
      squares[currentPosition + index].style.backgroundColor = ''

    })
  }

  
  function control(E) {
    if(E.keyCode === 37) {
     Left()
    } else if (E.keyCode === 38) {
      rotate()
    } else if (E.keyCode === 39) {
      Right()
    } else if (E.keyCode === 32) {
      Down()
    }
  }
  document.addEventListener('keyup', control)

  
  function Down() {
    undraw()
    currentPosition += width
    draw()
    stop()
  }

  
  function stop() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('res'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('res'))
      
      random = nextRandom
      nextRandom = Math.floor(Math.random()*Tetro.length)
      current = Tetro[random][currentRotation]
      currentPosition = 4
      draw()
      showNext()
      add()
      gameOver()
    }
  }

  
  function Left() {
    undraw()
    const LeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!LeftEdge) currentPosition -=1
    if(current.some(index => squares[currentPosition + index].classList.contains('res'))) {
      currentPosition +=1
    }
    draw()
  }

  
  function Right() {
    undraw()
    const RightEdge = current.some(index => (currentPosition + index) % width === width -1)
    if(!RightEdge) currentPosition +=1
    if(current.some(index => squares[currentPosition + index].classList.contains('res'))) {
      currentPosition -=1
    }
    draw()
  }

  
  
  function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition      
    if ((P+1) % width < 4) {         
      if (isAtRight()){            
        currentPosition += 1    
        checkRotatedPosition(P) 
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  

  function rotate() {
    undraw()
    currentRotation ++
    if(currentRotation === current.length) { 
      currentRotation = 0
    }
    current = Tetro[random][currentRotation]
    checkRotatedPosition()
    draw()
  }

  const nextSquares = document.querySelectorAll('.next div')
  const nextWidth = 4
  const nextIndex = 0


  
  const NextT = [
    [1, nextWidth+1, nextWidth*2+1, 2], 
    [1, nextWidth, nextWidth+1, nextWidth+2], 
    [0, 1, nextWidth, nextWidth+1], 
    [1, nextWidth+1, nextWidth*2+1, nextWidth*3+1] 
  ]

  
  function showNext() {
    
      nextSquares.forEach(square => {
      square.classList.remove('aTetro')
      square.style.backgroundColor = ''
    })
     NextT[nextRandom].forEach( index => {
      nextSquares[nextIndex + index].classList.add('aTetro')
      nextSquares[nextIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  
  startButton.addEventListener('click', () =>
    {  
       draw()
      timerId = setInterval(Down, speed)
      nextRandom = Math.floor(Math.random()*Tetro.length)
      showNext()
    }
  )
  
  pauseButton.addEventListener('click' , () => 
    {
	  clearInterval(timerId)
      timerId = null
   })
  


   function add() {
    for (let i = 0; i < 219; i +=width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('res'))) {
		  lines++
		  if(Level ===0)
		  {
			  switch(lines)
			  {
				  case 1:score+=40;break
				  case 2:score+=100;break
				  case 3:score+=300;break
				  case 4:score+=1200
				  lines= 0 
				  Level = 1
				  ;break
				  
			  }  
		  } 

           else 
		   {
			   timerId = setInterval(Down,speed/1.2)
			   switch(lines)
			   {
				  case 1:score+=40*(Level+1);break
				  case 2:score+=100*(Level+1);break
				  case 3:score+=300*(Level+1);break
				  case 4:score+=1200*(Level+1)
				  lines= 0 
				  Level++
				  ;break
			   }
			   
			   
		   }		   
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
		  
          disLevel.innerHTML = Level
          disScore.innerHTML = score
		  disLines.innerHTML = lines
          row.forEach(index => {
          squares[index].classList.remove('res')
          squares[index].classList.remove('aTetro')
          squares[index].style.backgroundColor = ''
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => space.appendChild(cell))
      }
    }
  }

  
  function gameOver() {
    if(current.some(index => squares[currentPosition + index].classList.contains('res'))) {
      alert('game over , your score is ' + disScore.innerHTML )
      clearInterval(timerId)
	  
	  
    }
  }

})
