function make(){

	paths=[]

	pgScale = 100

	for(i=0;i<polygons.length;i++){

		offset=[]

		offset.push(polygons[i].curves)
	
		if(polygons[i].holes.length>0){
			for(j=0;j<polygons[i].holes.length;j++){
				offset.push(polygons[i].holes[j])

			}
		}
	
		ClipperLib.JS.ScaleUpPaths(offset, pgScale)

		co = new ClipperLib.ClipperOffset(0.25, 0.25)
		co.AddPaths(offset, ClipperLib.JoinType.jtMiter, ClipperLib.EndType.etClosedPolygon)
		cutout = new ClipperLib.Paths()

		t = tool*pgScale

		co.Execute(cutout,t)

		ClipperLib.JS.ScaleDownPaths(offset, pgScale)
		ClipperLib.JS.ScaleDownPaths(cutout, pgScale)

		paths.push(cutout)

	}

	offset=paths

	draw()

	cutDepth = ((thickness/10)+0.015).toFixed(3)

	pt= Math.ceil(cutDepth/((tool/10)*2))  //passes
	pd = parseFloat(cutDepth/pt) //depth of pass


	for(i=0;i<offset.length;i++){


		sbp="MS,0.5,0.25\n"
		sbp+="JZ,0.25\n"
		sbp+="SO,1,1\n"
		sbp+="PAUSE 3\n"

		yOffset = 0
		if((i<2)||(i==2)){
			xOffset = birdhouse.width/2
		}
		else if(i==2){
			xOffset = birdhouse.depth/2
		}
		else if(i==3){
			xOffset = birdhouse.width/2
			yOffset = thickness/10
		}
		else if(i==4){
			xOffset = thickness/10
		}
		else if(i==5){
			xOffset = 0
			
		}


		for(j=offset[i].length-1;j>=0;j--){

			sbp+="J2," + (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "," + (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n"

			for(p=1;p<=pt;p++){
				if(p==pt){
					sbp+="MZ,-"+cutDepth+"\n"
				}
				else{
					sbp+="MZ,-" + (p*pd).toFixed(3) + "\n"
				}
				for(k=0;k<offset[i][j].length;k++){
					sbp+="M2," + (xOffset+(offset[i][j][k].X/10)).toFixed(3) + "," + (yOffset+(offset[i][j][k].Y/10)).toFixed(3) + "\n"
				}
				sbp+="M2," + (xOffset+(offset[i][j][0].X/10)).toFixed(3) + "," + (yOffset+(offset[i][j][0].Y/10)).toFixed(3) + "\n"
			}
			sbp+="JZ,0.125\n"
			
		}

	sbp+="JZ,0.25\n"
	sbp+="SO,1,0\n"
	sbp+="J2,0,0\n"	

	if(i==0){
		partName='birdhouseFront'
	}
	else if(i==1){
		partName='birdhouseBack'
	}
	else if(i==2){
		partName='birdhouseLeftRight'
	}
	else if(i==3){
		partName='birdhouseBottom'
	}
	else if(i==4){
		partName='birdhouseTopLeft'
	}
	else if(i==5){
		partName='birdhouseTopRight'
	}
	
	fabmo.submitJob({
		file : sbp,
		filename : partName + '.SBP',
		name : partName,
		description :  '1/8\"endmill'
	})
	
	}


}
