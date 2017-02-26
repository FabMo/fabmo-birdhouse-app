function draw(){

	c = document.getElementById("myCanvas")
	ctx = c.getContext("2d")

	ctx.canvas.height = window.innerHeight-100
	ctx.canvas.width = window.innerWidth-200

	ctx.clearRect(0,0,ctx.canvas.width,ctx.canvas.height)
	ctx.lineJoin="round"
	ctx.lineCap="round"


	if(document.getElementById('2D').checked==true){

	ctx.fillStyle="rgba(200,200,200,0.2)"
	ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height)

	ctx.strokeStyle="#000"


	ctx.fillStyle="#d3b89e"

	ctx.lineWidth=1	

	sf2 = 2.5

	ctx.translate(50*sf2,ctx.canvas.height-20)

	
	for(i=0;i<polygons.length;i++){

		for(j=0;j<polygons[i].curves.length;j++){
			if(j==0){
				ctx.moveTo(polygons[i].curves[0].X*sf2,0-polygons[i].curves[0].Y*sf2)
			}
			else{
				ctx.lineTo(polygons[i].curves[j].X*sf2,0-(polygons[i].curves[j].Y*sf2))	
			}
		}
		ctx.lineTo(polygons[i].curves[0].X*sf2,0-polygons[i].curves[0].Y*sf2)
	
		if(polygons[i].holes.length>0){
			for(j=0;j<polygons[i].holes.length;j++){	
				for(k=0;k<polygons[i].holes[j].length;k++){
					if(k==0){
						ctx.moveTo(polygons[i].holes[j][k].X*sf2,0-polygons[i].holes[j][k].Y*sf2)
					}
					else{
						ctx.lineTo(polygons[i].holes[j][k].X*sf2,0-polygons[i].holes[j][k].Y*sf2)
					}
					
				}
				ctx.lineTo(polygons[i].holes[j][0].X*sf2,0-polygons[i].holes[j][0].Y*sf2)
			}
		}

		

		if(i==2){
			ctx.translate(60*sf2,0)
		}
		else if(i==3){
			ctx.translate(40*sf2,0)
		}
		else if(i>3){
			ctx.translate(50*sf2,0)
		}
		else{
			ctx.translate(60*sf2,0)
		}

	}

	ctx.fill()
	ctx.stroke()

	//cutout

	ctx.beginPath()

	ctx.strokeStyle="#0000dd"

		ctx.translate(-320*sf2,0)

	for(i=0;i<offset.length;i++){
		for(j=0;j<offset[i].length;j++){
			ctx.moveTo(offset[i][j][0].X*sf2,0-(offset[i][j][0].Y*sf2))
			for(k=0;k<offset[i][j].length;k++){
				ctx.lineTo(offset[i][j][k].X*sf2,0-(offset[i][j][k].Y*sf2))
			}
			ctx.lineTo(offset[i][j][0].X*sf2,0-(offset[i][j][0].Y*sf2))
		}


		if(i==3){
			ctx.translate(40*sf2,0)
		}
		else if(i>3){
			ctx.translate(50*sf2,0)
		}
		else{
			ctx.translate(60*sf2,0)
		}
	}

	ctx.stroke()


	}

}
